"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFinanceData } from "@/hooks/use-finance-data"

export function GoalsProgress() {
  const { goals } = useFinanceData()

  const activeGoals = goals.filter((g) => g.active).slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso das Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activeGoals.map((goal) => {
            const progress = (goal.currentValue / goal.targetValue) * 100
            const isCompleted = progress >= 100

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{goal.title}</h4>
                  <span className={`text-sm ${isCompleted ? "text-green-600" : "text-gray-600"}`}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(goal.currentValue)}
                  </span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(goal.targetValue)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
