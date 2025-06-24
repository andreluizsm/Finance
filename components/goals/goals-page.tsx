"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Calendar, Pencil, Trash2 } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"
import { GoalDialog } from "./goal-dialog"

export function GoalsPage() {
  const { goals, categories, deleteGoal } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const handleEdit = (goal: any) => {
    setEditingGoal(goal)
    setIsDialogOpen(true)
  }

  const handleDelete = (goalId: number) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      console.log("Excluir meta:", goalId)
        deleteGoal(goalId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas Financeiras</h1>
          <p className="text-gray-600">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const category = categories.find((c) => c.id === goal.categoryId)
          const progress = (goal.currentValue / goal.targetValue) * 100
          const isCompleted = progress >= 100
          const isNearDeadline = new Date(goal.endDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

          return (
            <Card key={goal.id} className={`${isCompleted ? "border-green-500" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Target className={`h-5 w-5 ${isCompleted ? "text-green-600" : "text-blue-600"}`} />
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className={`text-sm font-medium ${isCompleted ? "text-green-600" : "text-gray-900"}`}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Atual</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(goal.currentValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Meta</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(goal.targetValue)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(goal.endDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {category && (
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: category.color + "20", color: category.color }}
                    >
                      {category.name}
                    </Badge>
                  )}
                </div>

                {isCompleted && (
                  <Badge className="w-full justify-center bg-green-100 text-green-800">Meta Concluída! 🎉</Badge>
                )}

                {isNearDeadline && !isCompleted && (
                  <Badge variant="destructive" className="w-full justify-center">
                    Prazo próximo!
                  </Badge>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingGoal(null)
        }}
        goal={editingGoal}
      />
    </div>
  )
}
