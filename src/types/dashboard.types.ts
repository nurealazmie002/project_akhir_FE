export interface Transaction {
  id: string
  date: string
  studentName: string
  type: string
  amount: number
  status: 'LUNAS' | 'PENDING' | 'GAGAL'
}

export interface CashFlowData {
  month: string
  income: number
  expense: number
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  currentBalance: number
  unpaidBillsCount: number
  incomeChange: number
  expenseChange: number
  balanceChange: number
}

export interface AlertItem {
  id: string
  type: 'warning' | 'info' | 'urgent'
  title: string
  description: string
  actionLabel?: string
  actionUrl?: string
}
