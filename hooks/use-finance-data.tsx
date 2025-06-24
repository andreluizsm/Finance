"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Category {
  id: number
  name: string
  color: string
  icon: string
}

interface Account {
  id: number
  name: string
  type: string
  balance: number
}

interface Transaction {
  id: number
  date: string
  amount: number
  description: string
  type: "ENTRADA" | "SAIDA" | "TRANSFERENCIA"
  categoryId?: number
  accountId: number
}

interface Goal {
  id: number
  title: string
  targetValue: number
  currentValue: number
  startDate: string
  endDate: string
  categoryId?: number
  active: boolean
}

interface FinanceContextType {
  categories: Category[]
  accounts: Account[]
  transactions: Transaction[]
  goals: Goal[]
  isLoading: boolean
  refreshData: () => Promise<void>
  addCategory: (category: Omit<Category, "id">) => Promise<void>
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
  addAccount: (account: Omit<Account, "id">) => Promise<void>
  updateAccount: (id: number, account: Partial<Account>) => Promise<void>
  deleteAccount: (id: number) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  updateTransaction: (id: number, transaction: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: number) => Promise<void>
  addGoal: (goal: Omit<Goal, "id" | "active">) => Promise<void>
  updateGoal: (id: number, goal: Partial<Goal>) => Promise<void>
  deleteGoal: (id: number) => Promise<void>
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const API_BASE_URL = "http://localhost:8080/api"

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("finance-token")
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const headers = getAuthHeaders()

      const [transactionsRes, categoriesRes, accountsRes, goalsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/transacoes`, { headers }),
        fetch(`${API_BASE_URL}/categorias`, { headers }),
        fetch(`${API_BASE_URL}/contas`, { headers }),
        fetch(`${API_BASE_URL}/metas`, { headers }),
      ])

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(
          transactionsData.map((t: any) => ({
            id: t.id,
            date: t.data,
            amount: Number.parseFloat(t.valor),
            description: t.descricao,
            type: t.tipo,
            categoryId: t.categoria?.id,
            accountId: t.conta?.id,
          })),
        )
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(
          categoriesData.map((c: any) => ({
            id: c.id,
            name: c.nome,
            color: c.cor,
            icon: c.icone,
          })),
        )
      }

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json()
        setAccounts(
          accountsData.map((a: any) => ({
            id: a.id,
            name: a.nome,
            type: a.tipo,
            balance: Number.parseFloat(a.saldo),
          })),
        )
      }

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json()
        setGoals(
          goalsData.map((g: any) => ({
            id: g.id,
            title: g.titulo,
            targetValue: Number.parseFloat(g.valorAlvo),
            currentValue: Number.parseFloat(g.valorAtual),
            startDate: g.dataInicio,
            endDate: g.dataFim,
            categoryId: g.categoria?.id,
            active: g.ativa,
          })),
        )
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("finance-token")
    if (token) {
      refreshData()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Transactions
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const payload = {
        data: transaction.date,
        valor: transaction.amount,
        descricao: transaction.description,
        tipo: transaction.type,
        categoria: transaction.categoryId ? { id: transaction.categoryId } : null,
        conta: { id: transaction.accountId },
      }

      const response = await fetch(`${API_BASE_URL}/transacoes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro ao criar transação")
      }

      await refreshData()
    } catch (error) {
      console.error("Erro ao criar transação:", error)
      throw error
    }
  }

  const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    try {
      const payload = {
        data: transaction.date,
        valor: transaction.amount,
        descricao: transaction.description,
        tipo: transaction.type,
        categoria: transaction.categoryId ? { id: transaction.categoryId } : null,
        conta: { id: transaction.accountId },
      }

      const response = await fetch(`${API_BASE_URL}/transacoes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro ao atualizar transação")
      }

      await refreshData()
    } catch (error) {
      console.error("Erro ao atualizar transação:", error)
      throw error
    }
  }

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transacoes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro ao excluir transação")
      }

      await refreshData()
    } catch (error) {
      console.error("Erro ao excluir transação:", error)
      throw error
    }
  }

  // Categories
  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: category.name,
          cor: category.color,
          icone: category.icon,
        }),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
    }
  }

  const updateCategory = async (id: number, category: Partial<Category>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: category.name,
          cor: category.color,
          icone: category.icon,
        }),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error)
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
    }
  }

  // Accounts
  const addAccount = async (account: Omit<Account, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: account.name,
          tipo: account.type,
          saldo: account.balance,
        }),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error)
    }
  }

  const updateAccount = async (id: number, account: Partial<Account>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contas/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: account.name,
          tipo: account.type,
          saldo: account.balance,
        }),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao atualizar conta:", error)
    }
  }

  const deleteAccount = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contas/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error)
    }
  }

  // Goals
  const addGoal = async (goal: Omit<Goal, "id" | "active">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/metas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          titulo: goal.title,
          valorAlvo: goal.targetValue,
          valorAtual: goal.currentValue,
          dataInicio: goal.startDate,
          dataFim: goal.endDate,
          categoria: goal.categoryId ? { id: goal.categoryId } : null,
        }),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao criar meta:", error)
    }
  }

  const updateGoal = async (id: number, goal: Partial<Goal>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/metas/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          titulo: goal.title,
          valorAlvo: goal.targetValue,
          valorAtual: goal.currentValue,
          dataInicio: goal.startDate,
          dataFim: goal.endDate,
          categoria: goal.categoryId ? { id: goal.categoryId } : null,
          ativa: goal.active,
        }),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao atualizar meta:", error)
    }
  }

  const deleteGoal = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/metas/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error("Erro ao excluir meta:", error)
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        categories,
        accounts,
        transactions,
        goals,
        isLoading,
        refreshData,
        addCategory,
        updateCategory,
        deleteCategory,
        addAccount,
        updateAccount,
        deleteAccount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinanceData() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinanceData must be used within a FinanceProvider")
  }
  return context
}
