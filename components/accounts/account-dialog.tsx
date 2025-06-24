"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinanceData } from "@/hooks/use-finance-data"

interface AccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: any
}

export function AccountDialog({ open, onOpenChange, account }: AccountDialogProps) {
  const { addAccount, updateAccount } = useFinanceData()
  const [formData, setFormData] = useState({
    name: "",
    type: "CORRENTE",
    balance: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      type: "CORRENTE",
      balance: "0",
    })
  }

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
      })
    } else {
      setFormData({
        name: "",
        type: "CORRENTE",
        balance: "0",
      })
    }
  }, [account])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const accountData = {
      ...formData,
      balance: Number.parseFloat(formData.balance),
    }

    if (account) {
      updateAccount(account.id, accountData)
    } else {
      addAccount(accountData)
      resetForm()
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{account ? "Editar Conta" : "Nova Conta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Conta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CORRENTE">Conta Corrente</SelectItem>
                <SelectItem value="POUPANCA">Poupança</SelectItem>
                <SelectItem value="INVESTIMENTO">Investimento</SelectItem>
                <SelectItem value="CARTEIRA">Carteira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Inicial</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData((prev) => ({ ...prev, balance: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{account ? "Atualizar" : "Criar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
