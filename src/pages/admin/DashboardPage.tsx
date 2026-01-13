import { Wallet, Receipt, FileText } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { TransactionTable } from '@/components/dashboard/TransactionTable'
import { QuickActions } from '@/components/dashboard/QuickActions'
import {motion} from 'framer-motion'
import {
  mockDashboardStats,
  mockCashFlowData,
  mockTransactions,
} from '@/mocks/dashboard.mock'

const quickActions = [
  { id: '1', label: 'Input Pembayaran', icon: <Wallet size={18} />, variant: 'primary' as const },
  { id: '2', label: 'Input Pengeluaran', icon: <Receipt size={18} /> },
  { id: '3', label: 'Buat Tagihan Baru', icon: <FileText size={18} /> },
]

export function DashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  return (
    <motion.div 
      className="space-y-6" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Pemasukan"
          value={`Rp ${formatCurrency(mockDashboardStats.totalIncome)}`}
          change={mockDashboardStats.incomeChange}
          changeLabel="dari bulan lalu"
          icon="down"
        />
        <StatCard
          title="Total Pengeluaran"
          value={`Rp ${formatCurrency(mockDashboardStats.totalExpense)}`}
          change={mockDashboardStats.expenseChange}
          changeLabel="lebih tinggi"
          icon="up"
        />
        <StatCard
          title="Saldo Saat Ini"
          value={`Rp ${formatCurrency(mockDashboardStats.currentBalance)}`}
          change={mockDashboardStats.balanceChange}
          changeLabel="pertumbuhan"
          icon="check"
        />
        <StatCard
          title="Tagihan Belum Lunas"
          value={`${mockDashboardStats.unpaidBillsCount} Santri`}
          changeLabel="2% dari total santri"
          variant="warning"
          icon="warning"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 items-stretch">
        <div className="col-span-2 h-full">
          <CashFlowChart data={mockCashFlowData} title="Arus Kas Semester Ini" />
        </div>

        <div className="h-full">
          <QuickActions actions={quickActions} />
        </div>
      </div>

      <TransactionTable
        transactions={mockTransactions}
        title="Transaksi Terakhir"
        onViewAll={() => console.log('View all transactions')}
      />
    </motion.div>
  )
}
