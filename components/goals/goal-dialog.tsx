"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinanceData } from "@/hooks/use-finance-data"

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: any
}

export function GoalDialog({ open, onOpenChange, goal }: GoalDialogProps) {
  const { categories, addGoal, updateGoal } = useFinanceData()
  const [formData, setFormData] = useState({
    title: "",
    targetValue: "",
    currentValue: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    categoryId: "",
  })

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        targetValue: goal.targetValue.toString(),
        currentValue: goal.currentValue.toString(),
        startDate: goal.startDate,
        endDate: goal.endDate,
        categoryId: goal.categoryId?.toString() || "",
      })
    } else {
      setFormData({
        title: "",
        targetValue: "",
        currentValue: "0",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        categoryId: "",
      })
    }
  }, [goal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const goalData = {
      ...formData,
      targetValue: Number.parseFloat(formData.targetValue),
      currentValue: Number.parseFloat(formData.currentValue),
      categoryId: Number.parseInt(formData.categoryId),
    }

    if (goal) {
      updateGoal(goal.id, goalData)
    } else {
      addGoal(goalData)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Editar Meta" : "Nova Meta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue">Valor Meta</Label>
              <Input
                id="targetValue"
                type="number"
                step="0.01"
                value={formData.targetValue}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetValue: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue">Valor Atual</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                value={formData.currentValue}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentValue: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{goal ? "Atualizar" : "Criar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
