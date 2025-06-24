"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFinanceData } from "@/hooks/use-finance-data"
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft } from "lucide-react"

export function RecentTransactions() {
  const { transactions, categories } = useFinanceData()

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "ENTRADA":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "SAIDA":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      case "TRANSFERENCIA":
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "ENTRADA":
        return "text-green-600"
      case "SAIDA":
        return "text-red-600"
      case "TRANSFERENCIA":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const category = categories.find((c) => c.id === transaction.categoryId)
            return (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "SAIDA" ? "-" : "+"}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Math.abs(transaction.amount))}
                  </p>
                  {category && (
                    <Badge variant="secondary" className="text-xs">
                      {category.name}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
