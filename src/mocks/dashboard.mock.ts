import type { Transaction, CashFlowData, DashboardStats, AlertItem } from '@/types'

export const mockDashboardStats: DashboardStats = {
  totalIncome: 150000000,
  totalExpense: 45000000,
  currentBalance: 105000000,
  unpaidBillsCount: 15,
  incomeChange: 12,
  expenseChange: 5,
  balanceChange: 8,
}

export const mockCashFlowData: CashFlowData[] = [
  { month: 'MEI', income: 8000000, expense: 5000000 },
  { month: 'JUN', income: 12000000, expense: 7000000 },
  { month: 'JUL', income: 15000000, expense: 10000000 },
  { month: 'AGU', income: 25000000, expense: 12000000 },
  { month: 'SEP', income: 30000000, expense: 18000000 },
  { month: 'OKT', income: 45000000, expense: 20000000 },
]

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '24 Okt 2023',
    studentName: 'Ahmad Fulan',
    type: 'SPP Bulan Oktober',
    amount: 500000,
    status: 'LUNAS',
  },
  {
    id: '2',
    date: '24 Okt 2023',
    studentName: 'Siti Aminah',
    type: 'Uang Makan',
    amount: 300000,
    status: 'LUNAS',
  },
  {
    id: '3',
    date: '23 Okt 2023',
    studentName: 'Budi Santoso',
    type: 'SPP Bulan Oktober',
    amount: 500000,
    status: 'PENDING',
  },
  {
    id: '4',
    date: '23 Okt 2023',
    studentName: 'Dewi Lestari',
    type: 'Uang Kegiatan',
    amount: 250000,
    status: 'LUNAS',
  },
]

export const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Tagihan Listrik Belum Dibayar',
    description: 'Jatuh tempo: 25 Okt 2023. Sebesar Rp 2.500.000',
    actionLabel: 'Bayar Sekarang',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Verifikasi Pembayaran Transfer',
    description: '5 transaksi dari wali santri menunggu verifikasi manual.',
  },
  {
    id: '3',
    type: 'info',
    title: 'Stok Dapur Menipis',
    description: 'Laporan dari bagian dapur untuk pengajuan belanja minggu depan.',
  },
]
