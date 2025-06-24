import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { FinanceProvider } from "@/hooks/use-finance-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finance - Controle Financeiro Pessoal",
  description: "Aplicação completa para controle de finanças pessoais"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <FinanceProvider>{children}</FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
