"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Target, AlertTriangle, TrendingDown } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"

export function NotificationCenter() {
  const { goals, accounts, transactions } = useFinanceData()
  const [isOpen, setIsOpen] = useState(false)

  // Gerar notificações
  const notifications = []

  // Verificar metas próximas do prazo
  goals.forEach((goal) => {
    const daysUntilDeadline = Math.ceil(
      (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    const progress = (goal.currentValue / goal.targetValue) * 100

    if (daysUntilDeadline <= 7 && daysUntilDeadline > 0 && progress < 100) {
      notifications.push({
        id: `goal-deadline-${goal.id}`,
        type: "warning",
        icon: Target,
        title: "Meta próxima do prazo",
        message: `A meta "${goal.title}" vence em ${daysUntilDeadline} dias`,
        time: new Date().toISOString(),
      })
    }

    if (progress >= 100) {
      notifications.push({
        id: `goal-completed-${goal.id}`,
        type: "success",
        icon: Target,
        title: "Meta concluída!",
        message: `Parabéns! Você atingiu a meta "${goal.title}"`,
        time: new Date().toISOString(),
      })
    }
  })

  // Verificar saldos negativos
  accounts.forEach((account) => {
    if (account.balance < 0) {
      notifications.push({
        id: `negative-balance-${account.id}`,
        type: "error",
        icon: AlertTriangle,
        title: "Saldo negativo",
        message: `A conta "${account.name}" está com saldo negativo`,
        time: new Date().toISOString(),
      })
    }
  })

  // Verificar gastos altos no mês
  const currentMonth = new Date().getMonth()
  const monthlyExpenses = transactions
    .filter((t) => t.type === "SAIDA" && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  if (monthlyExpenses > 5000) {
    notifications.push({
      id: "high-expenses",
      type: "warning",
      icon: TrendingDown,
      title: "Gastos elevados",
      message: `Seus gastos este mês já ultrapassaram R$ ${monthlyExpenses.toFixed(2)}`,
      time: new Date().toISOString(),
    })
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold">Notificações</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma notificação</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <Icon className={`h-5 w-5 mt-0.5 ${getNotificationColor(notification.type)}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
