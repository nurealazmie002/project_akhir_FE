import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CreditCard, Bell, Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { santriService } from '@/services/santriService'
import { transactionService } from '@/services/transactionService'
import { useAuthStore } from '@/stores/authStore'
import type { Santri } from '@/types/santri.types'
import type { Transaction } from '@/types/transaction.types'

export function UserDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) return
      setIsLoading(true)
      try {
        const santriResponse = await santriService.getAll()
        const allSantri = Array.isArray(santriResponse) ? santriResponse : (santriResponse.data || [])
        const waliSantri = allSantri.filter(
          (s: Santri) => s.waliName?.toLowerCase() === user.username?.toLowerCase()
        )
        setSantriList(waliSantri)

        if (waliSantri.length > 0) {
          const allTransactions: Transaction[] = []
          for (const santri of waliSantri) {
            try {
              const txResponse = await transactionService.getBySantriId(String(santri.id))
              allTransactions.push(...txResponse.data)
            } catch (err) {
              console.error('Failed to fetch transactions for santri:', santri.id)
            }
          }
          setTransactions(allTransactions)
        }
      } catch (err: any) {
        console.error('Failed to fetch data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user?.username])

  const totalSantri = santriList.length
  const totalIncome = transactions.filter(t => t.type === 'PEMASUKAN').reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'PENGELUARAN').reduce((sum, t) => sum + Number(t.amount), 0)
  const balance = totalIncome - totalExpense

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, 5)

  const quickLinks = [
    {
      title: 'Daftar Santri',
      description: `${totalSantri} santri terdaftar`,
      icon: Users,
      href: '/user/santri',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Total Pemasukan',
      description: formatCurrency(totalIncome),
      icon: TrendingDown,
      href: '/user/santri',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Total Pengeluaran',
      description: formatCurrency(totalExpense),
      icon: TrendingUp,
      href: '/user/santri',
      color: 'from-rose-500 to-rose-600'
    },
    {
      title: 'Saldo',
      description: formatCurrency(balance),
      icon: Wallet,
      href: '/user/santri',
      color: 'from-cyan-500 to-cyan-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Selamat Datang, {user?.username || 'Wali Santri'}!
        </h1>
        <p className="text-muted-foreground">
          Kelola informasi santri dan pembayaran dengan mudah melalui dashboard ini.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/50 bg-card animate-pulse">
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl bg-muted mb-4" />
                <div className="h-4 w-24 bg-muted rounded mb-2" />
                <div className="h-3 w-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="border-border/50 bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(link.href)}
              >
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Daftar Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            {santriList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada data santri</p>
              </div>
            ) : (
              <div className="space-y-3">
                {santriList.map((santri) => (
                  <div 
                    key={santri.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/santri/${santri.id}/transaksi`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-white text-sm font-medium">
                        {santri.fullname?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{santri.fullname}</p>
                        <p className="text-xs text-muted-foreground">NIS: {santri.nis} • {santri.kelas}</p>
                      </div>
                    </div>
                    <Badge className={santri.isActive !== false 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                    }>
                      {santri.isActive !== false ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Transaksi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada transaksi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        tx.type === 'PEMASUKAN' 
                          ? 'bg-emerald-500/20' 
                          : 'bg-red-500/20'
                      }`}>
                        {tx.type === 'PEMASUKAN' 
                          ? <TrendingDown className="h-5 w-5 text-emerald-400" />
                          : <TrendingUp className="h-5 w-5 text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{tx.description || tx.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.transactionDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold text-sm ${
                      tx.type === 'PEMASUKAN' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'PEMASUKAN' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
