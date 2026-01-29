import api from './api'
import type { Transaction } from '@/types/transaction.types'
import type { DashboardTransaction } from '@/types/dashboard.types'

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  currentBalance: number
  unpaidBillsCount: number
  incomeChange: number
  expenseChange: number
  balanceChange: number
}

export interface CashFlowData {
  month: string
  monthFull: string
  year: number
  income: number
  expense: number
}



const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']
const monthNamesFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        api.get('/transaction', { params: { type: 'PEMASUKAN', limit: 1000 } }),
        api.get('/transaction', { params: { type: 'PENGELUARAN', limit: 1000 } })
      ])

      const incomeTransactions = incomeRes.data.data || []
      const expenseTransactions = expenseRes.data.data || []

      const totalIncome = incomeTransactions.reduce((sum: number, t: Transaction) => 
        sum + (typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount), 0)
      const totalExpense = expenseTransactions.reduce((sum: number, t: Transaction) => 
        sum + (typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount), 0)
      const currentBalance = totalIncome - totalExpense

      return {
        totalIncome,
        totalExpense,
        currentBalance,
        unpaidBillsCount: 0,
        incomeChange: 0,
        expenseChange: 0,
        balanceChange: 0
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      return {
        totalIncome: 0,
        totalExpense: 0,
        currentBalance: 0,
        unpaidBillsCount: 0,
        incomeChange: 0,
        expenseChange: 0,
        balanceChange: 0
      }
    }
  },

  async getRecentTransactions(limit: number = 10): Promise<DashboardTransaction[]> {
    try {
      const response = await api.get('/transaction', { 
        params: { limit, page: 1 } 
      })
      
      const transactions: Transaction[] = response.data.data || []
      
      return transactions.map(t => ({
        id: t.id,
        date: new Date(t.transactionDate).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        studentName: t.santri?.fullname || 'Unknown',
        studentNis: t.santri?.nis || '-',
        type: t.category?.name || t.type,
        amount: typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount,
        status: 'LUNAS' as const,
        originalTransaction: t
      }))
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error)
      return []
    }
  },

  async getCashFlowData(months: number = 6): Promise<CashFlowData[]> {
    try {
      const response = await api.get('/transaction', { 
        params: { limit: 1000 } 
      })
      
      const transactions: Transaction[] = response.data.data || []
      const monthlyData: Map<string, CashFlowData> = new Map()
      
      const now = new Date()
      const orderedKeys: string[] = []
      
      for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        const shortYear = String(date.getFullYear()).slice(-2)
        orderedKeys.push(key)
        monthlyData.set(key, {
          month: `${monthNames[date.getMonth()]} '${shortYear}`,
          monthFull: monthNamesFull[date.getMonth()],
          year: date.getFullYear(),
          income: 0,
          expense: 0
        })
      }
      
      transactions.forEach(t => {
        const date = new Date(t.transactionDate)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        
        const monthData = monthlyData.get(key)
        if (monthData) {
          const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount
          if (t.type === 'PEMASUKAN') {
            monthData.income += amount
          } else {
            monthData.expense += amount
          }
        }
      })
      
      return orderedKeys.map(key => monthlyData.get(key)!)
    } catch (error) {
      console.error('Failed to fetch cash flow data:', error)
      return []
    }
  }
}

export default dashboardService
