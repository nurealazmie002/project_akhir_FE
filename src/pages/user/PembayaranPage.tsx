import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { userService, type PembayaranItem } from '@/services/userService'
import { fadeInUp } from '@/lib/animations'
import { 
  Receipt, 
  Search,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

export function PembayaranPage() {
  const [pembayaranList, setPembayaranList] = useState<PembayaranItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await userService.getPembayaran()
        setPembayaranList(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredPembayaran = pembayaranList.filter(
    (item) =>
      item.jenis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.santriName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.santriNis?.includes(searchQuery)
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const totalPending = pembayaranList
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.jumlah, 0)

  const totalLunas = pembayaranList
    .filter(p => p.status === 'LUNAS')
    .reduce((sum, p) => sum + p.jumlah, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LUNAS': return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case 'PENDING': return <Clock className="h-4 w-4 text-amber-400" />
      default: return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-500/20 p-2">
          <Receipt className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pembayaran</h1>
          <p className="text-sm text-muted-foreground">Riwayat dan tagihan pembayaran</p>
        </div>
      </div>

      {error && (
        <Badge variant="destructive" className="w-full justify-center py-2">
          {error}
        </Badge>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-500/20 p-3">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Rp {formatCurrency(totalPending)}</p>
              <p className="text-sm text-muted-foreground">Total Tagihan Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-500/20 p-3">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Rp {formatCurrency(totalLunas)}</p>
              <p className="text-sm text-muted-foreground">Total Sudah Dibayar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari jenis pembayaran, nama anak, atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Tanggal</TableHead>
                <TableHead className="text-muted-foreground">Anak</TableHead>
                <TableHead className="text-muted-foreground">Jenis</TableHead>
                <TableHead className="text-muted-foreground">Jumlah</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredPembayaran.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {searchQuery ? 'Tidak ada hasil ditemukan' : 'Belum ada riwayat pembayaran'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPembayaran.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-accent">
                    <TableCell className="text-muted-foreground">{item.tanggal}</TableCell>
                    <TableCell className="text-foreground">
                      <div>
                        <p className="font-medium">{item.santriName}</p>
                        <p className="text-xs text-muted-foreground">NIS: {item.santriNis}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{item.jenis}</TableCell>
                    <TableCell className="text-foreground font-medium">
                      Rp {formatCurrency(item.jumlah)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={
                          item.status === 'LUNAS' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
