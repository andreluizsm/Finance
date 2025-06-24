"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"

export function DashboardOverview() {
  const { accounts, transactions, goals } = useFinanceData()

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlyIncome = transactions
    .filter((t) => t.type === "ENTRADA" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpenses = transactions
    .filter((t) => t.type === "SAIDA" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const activeGoals = goals.filter((g) => g.active).length

  const cards = [
    {
      title: "Saldo Total",
      value: totalBalance,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Receitas do Mês",
      value: monthlyIncome,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Gastos do Mês",
      value: monthlyExpenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Metas Ativas",
      value: activeGoals,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      isCount: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.isCount
                  ? card.value
                  : new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(card.value)}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
