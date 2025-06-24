"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_CONFIG, fetchWithTimeout } from "@/lib/api-config"

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = "http://localhost:8080/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("finance-user")
    const savedToken = localStorage.getItem("finance-token")

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro no login")
      }

      const data = await response.json()

      const userData = {
        id: data.usuario.id,
        name: data.usuario.nome,
        email: data.usuario.email,
      }

      setUser(userData)
      localStorage.setItem("finance-user", JSON.stringify(userData))
      localStorage.setItem("finance-token", data.token)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_CONFIG.BASE_URL}`,
        )
      }
      console.error("Erro no login:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          email,
          senha: password,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro no registro")
      }

      const data = await response.json()

      const userData = {
        id: data.usuario.id,
        name: data.usuario.nome,
        email: data.usuario.email,
      }

      setUser(userData)
      localStorage.setItem("finance-user", JSON.stringify(userData))
      localStorage.setItem("finance-token", data.token)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080",
        )
      }
      console.error("Erro no registro:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("finance-user")
    localStorage.removeItem("finance-token")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
