"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceData } from "@/hooks/use-finance-data"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function FinancialCharts() {
  const { transactions, categories } = useFinanceData()

  // Dados para gráfico de pizza (gastos categoria)
  const expensesByCategory = categories
    .map((category) => {
      const total = transactions
        .filter((t) => t.type === "SAIDA" && t.categoryId === category.id)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      return {
        name: category.name,
        value: total,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)

  // Dados para gráfico de barras (receitas vs gastos mes)
  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleDateString("pt-BR", { month: "short" })

    const income = transactions
      .filter((t) => {
        const tDate = new Date(t.date)
        return (
          t.type === "ENTRADA" && tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear()
        )
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions
      .filter((t) => {
        const tDate = new Date(t.date)
        return t.type === "SAIDA" && tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear()
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    monthlyData.push({
      month,
      receitas: income,
      gastos: expenses,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value as number)
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Gastos (6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value as number)
                }
              />
              <Legend />
              <Bar dataKey="receitas" fill="#00C49F" name="Receitas" />
              <Bar dataKey="gastos" fill="#FF8042" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
