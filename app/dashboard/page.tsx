import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { GoalsProgress } from "@/components/dashboard/goals-progress"
import { FinancialCharts } from "@/components/dashboard/financial-charts"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas finanças</p>
      </div>

      <DashboardOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <GoalsProgress />
      </div>

      <FinancialCharts />
    </div>
  )
}
