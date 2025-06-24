"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Tag, Pencil, Trash2 } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"
import { CategoryDialog } from "./category-dialog"

export function CategoriesPage() {
  const { categories, deleteCategory } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleDelete = (categoryId: number) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      console.log("Excluir categoria:", categoryId)
        deleteCategory(categoryId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    <Tag className="h-4 w-4" style={{ color: category.color }} />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: category.color + "20", color: category.color }}
                    >
                      {category.color}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button id="update" variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button id="delete" variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingCategory(null)
        }}
        category={editingCategory}
      />
    </div>
  )
}
