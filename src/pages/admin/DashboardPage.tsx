import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, Receipt, FileText, Loader2 } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { TransactionTable } from '@/components/dashboard/TransactionTable'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ReceiptModal } from '@/components/dashboard/ReceiptModal'
import { motion } from 'framer-motion'
import { dashboardService, type DashboardStats, type CashFlowData, type DashboardTransaction } from '@/services/dashboardService'
import { invoiceService } from '@/services/invoiceService'
import type { Receipt as ReceiptType } from '@/types/invoice.types'

const quickActions = [
  { id: '1', label: 'Input Pembayaran', icon: <Wallet size={18} />, variant: 'primary' as const },
  { id: '2', label: 'Input Pengeluaran', icon: <Receipt size={18} /> },
  { id: '3', label: 'Buat Tagihan Baru', icon: <FileText size={18} /> },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [chartPeriod, setChartPeriod] = useState(6)
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpense: 0,
    currentBalance: 0,
    unpaidBillsCount: 0,
    incomeChange: 0,
    expenseChange: 0,
    balanceChange: 0
  })
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptType | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const [statsData, cashFlow, recentTx] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getCashFlowData(chartPeriod),
          dashboardService.getRecentTransactions(5)
        ])
        
        setStats(statsData)
        setCashFlowData(cashFlow)
        setTransactions(recentTx)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handlePeriodChange = useCallback(async (months: number) => {
    setChartPeriod(months)
    try {
      const cashFlow = await dashboardService.getCashFlowData(months)
      setCashFlowData(cashFlow)
    } catch (error) {
      console.error('Failed to fetch cash flow data:', error)
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const handleViewAllTransactions = () => {
    navigate('/admin/santri')
  }

  const handleTransactionClick = (transaction: DashboardTransaction) => {
    if (transaction.originalTransaction) {
      const receipt = invoiceService.generateReceiptFromTransaction(
        transaction.originalTransaction,
        'Pondok Pesantren'
      )
      setSelectedReceipt(receipt)
      setShowReceiptModal(true)
    }
  }

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case '1':
        navigate('/admin/santri')
        break
      case '2':
        navigate('/admin/santri')
        break
      case '3':
        navigate('/admin/invoice')
        break
      default:
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div 
        className="space-y-6" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pemasukan"
            value={`Rp ${formatCurrency(stats.totalIncome)}`}
            change={stats.incomeChange}
            changeLabel="dari bulan lalu"
            icon="down"
          />
          <StatCard
            title="Total Pengeluaran"
            value={`Rp ${formatCurrency(stats.totalExpense)}`}
            change={stats.expenseChange}
            changeLabel="lebih tinggi"
            icon="up"
          />
          <StatCard
            title="Saldo Saat Ini"
            value={`Rp ${formatCurrency(stats.currentBalance)}`}
            change={stats.balanceChange}
            changeLabel="pertumbuhan"
            icon="check"
          />
          <StatCard
            title="Tagihan Belum Lunas"
            value={`${stats.unpaidBillsCount} Santri`}
            changeLabel="2% dari total santri"
            variant="warning"
            icon="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 h-full">
            <CashFlowChart 
              data={cashFlowData} 
              title={`Arus Kas ${chartPeriod} Bulan Terakhir`}
              selectedPeriod={chartPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          <div className="h-full">
            <QuickActions 
              actions={quickActions.map(a => ({
                ...a,
                onClick: () => handleQuickAction(a.id)
              }))}
            />
          </div>
        </div>

        <TransactionTable
          transactions={transactions}
          title="Transaksi Terakhir"
          onViewAll={handleViewAllTransactions}
          onRowClick={handleTransactionClick}
        />
      </motion.div>

      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />
    </>
  )
}
