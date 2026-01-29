import type { Transaction } from './transaction.types'

export interface DashboardTransaction {
  id: string
  date: string
  studentName: string
  studentNis: string
  type: string
  amount: number
  status: 'LUNAS' | 'PENDING' | 'GAGAL'
  originalTransaction?: Transaction
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
