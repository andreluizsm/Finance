"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { API_CONFIG, fetchWithTimeout } from "@/lib/api-config"

export function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Enviar dados vazios p testar conec
        })

        // Se chegou até aqui, o backend está rodando (mesmo se voltar 400)
        setStatus("connected")
      } catch (error) {
        console.error("Erro de conexão:", error)
        setStatus("disconnected")
      }
    }

    checkConnection()
  }, [])

  if (status === "checking") {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Verificando conexão com o servidor...</AlertDescription>
      </Alert>
    )
  }

  if (status === "disconnected") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Servidor não encontrado!</strong>
          <br />
          Verifique se o backend Java está rodando em {API_CONFIG.BASE_URL}
          <br />
          <br />
          <strong>Para iniciar o backend:</strong>
          <br />
          1. Abra um terminal na pasta do backend
          <br />
          2. Execute: <code className="bg-gray-100 px-1 rounded">mvn spring-boot:run</code>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">Conectado ao servidor com sucesso!</AlertDescription>
    </Alert>
  )
}
