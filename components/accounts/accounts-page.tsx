"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, PiggyBank, CreditCard, TrendingUp, Wallet, Pencil, Trash2 } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"
import { AccountDialog } from "./account-dialog"

export function AccountsPage() {
  const { accounts, deleteAccount } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "CORRENTE":
        return <CreditCard className="h-5 w-5" />
      case "POUPANCA":
        return <PiggyBank className="h-5 w-5" />
      case "INVESTIMENTO":
        return <TrendingUp className="h-5 w-5" />
      case "CARTEIRA":
        return <Wallet className="h-5 w-5" />
      default:
        return <PiggyBank className="h-5 w-5" />
    }
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "CORRENTE":
        return "Conta Corrente"
      case "POUPANCA":
        return "Poupança"
      case "INVESTIMENTO":
        return "Investimento"
      case "CARTEIRA":
        return "Carteira"
      default:
        return type
    }
  }

  const handleEdit = (account: any) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  const handleDelete = (accountId: number) => {
    if (confirm("Tem certeza que deseja excluir esta conta?")) {
      console.log("Excluir conta:", accountId)
      deleteAccount(accountId)
    }
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas</h1>
          <p className="text-gray-600">Gerencie suas contas financeiras</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Resumo total */}
      <Card>
        <CardHeader>
          <CardTitle>Saldo Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalBalance)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {getAccountIcon(account.type)}
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <Badge variant="secondary">{getAccountTypeLabel(account.type)}</Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button id="update" variant="ghost" size="icon" onClick={() => handleEdit(account)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button id="delete" variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(account.balance)}
                </div>
                <div className="text-sm text-gray-500">Atualizado em {new Date().toLocaleDateString("pt-BR")}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AccountDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingAccount(null)
        }}
        account={editingAccount}
      />
    </div>
  )
}
