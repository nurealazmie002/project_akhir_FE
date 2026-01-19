import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { userService, type PembayaranItem } from '@/services/userService'
import type { Santri } from '@/types/santri.types'
import { fadeInUp } from '@/lib/animations'
import { 
  Users, 
  GraduationCap, 
  Receipt, 
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export function UserDashboardPage() {
  const { user } = useAuthStore()
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [pembayaranList, setPembayaranList] = useState<PembayaranItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [santriRes, pembayaranRes] = await Promise.all([
          userService.getSantri(),
          userService.getPembayaran()
        ])
        setSantriList(santriRes.data)
        setPembayaranList(pembayaranRes.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat data')
        console.error('Failed to fetch data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const pendingPembayaran = pembayaranList.filter(p => p.status === 'PENDING').length
  const lunasPembayaran = pembayaranList.filter(p => p.status === 'LUNAS').length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      {/* Welcome Header */}
      <div className="rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 p-4 sm:p-6 border border-primary/20">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Selamat Datang, {user?.name || 'User'}! 👋
        </h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Portal Wali Santri - Pantau perkembangan santri Anda
        </p>
      </div>

      {error && (
        <Badge variant="destructive" className="w-full justify-center py-2">
          {error}
        </Badge>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-500/20 p-3">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{santriList.length}</p>
              <p className="text-sm text-muted-foreground">Jumlah Santri</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-500/20 p-3">
              <AlertCircle className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingPembayaran}</p>
              <p className="text-sm text-muted-foreground">Tagihan Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-500/20 p-3">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{lunasPembayaran}</p>
              <p className="text-sm text-muted-foreground">Pembayaran Lunas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Santri */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Data Santri Anda</CardTitle>
          <Link to="/user/santri">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              Lihat Semua <ChevronRight size={16} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Memuat data...</p>
          ) : santriList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada data santri terdaftar</p>
          ) : (
            <div className="space-y-3">
              {santriList.map((santri) => (
                <Link
                  key={santri.id}
                  to={`/user/santri/${santri.nis}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{santri.fullname}</p>
                      <p className="text-sm text-muted-foreground">
                        NIS: {santri.nis} • Kelas: {santri.kelas}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={santri.isActive !== false 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                    }>
                      {santri.isActive !== false ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pembayaran Terbaru */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Pembayaran Terbaru</CardTitle>
          <Link to="/user/pembayaran">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              Lihat Semua <ChevronRight size={16} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Memuat data...</p>
          ) : pembayaranList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada riwayat pembayaran</p>
          ) : (
            <div className="space-y-3">
              {pembayaranList.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.jenis}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.santriName} • {item.tanggal}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">Rp {formatCurrency(item.jumlah)}</p>
                    <Badge className={
                      item.status === 'LUNAS' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
