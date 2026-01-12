import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fadeInUp } from '@/lib/animations'
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Filter
} from 'lucide-react'

interface LaporanSummary {
  bulan: string
  pemasukan: number
  pengeluaran: number
  saldo: number
}

const mockLaporanBulanan: LaporanSummary[] = [
  { bulan: 'Januari 2026', pemasukan: 45000000, pengeluaran: 32000000, saldo: 13000000 },
  { bulan: 'Desember 2025', pemasukan: 42000000, pengeluaran: 28000000, saldo: 14000000 },
  { bulan: 'November 2025', pemasukan: 38000000, pengeluaran: 35000000, saldo: 3000000 },
  { bulan: 'Oktober 2025', pemasukan: 41000000, pengeluaran: 30000000, saldo: 11000000 },
  { bulan: 'September 2025', pemasukan: 39000000, pengeluaran: 29000000, saldo: 10000000 },
  { bulan: 'Agustus 2025', pemasukan: 55000000, pengeluaran: 40000000, saldo: 15000000 },
]

type PeriodeFilter = 'bulanan' | 'semester' | 'tahunan'

export function LaporanPage() {
  const [periodeFilter, setPeriodeFilter] = useState<PeriodeFilter>('bulanan')

  const totalPemasukan = mockLaporanBulanan.reduce((sum, item) => sum + item.pemasukan, 0)
  const totalPengeluaran = mockLaporanBulanan.reduce((sum, item) => sum + item.pengeluaran, 0)
  const totalSaldo = totalPemasukan - totalPengeluaran

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting to ${format}...`)
    alert(`Export ke ${format.toUpperCase()} akan segera diproses`)
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/20 p-2">
            <FileText className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Laporan Keuangan</h1>
            <p className="text-sm text-gray-400">
              Ringkasan keuangan pesantren
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleExport('excel')}
            variant="outline"
            className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <Download size={18} />
            Export Excel
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Download size={18} />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/20 p-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">Rp {formatCurrency(totalPemasukan)}</p>
              <p className="text-xs text-gray-400">Total Pemasukan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-red-500/20 p-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">Rp {formatCurrency(totalPengeluaran)}</p>
              <p className="text-xs text-gray-400">Total Pengeluaran</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">Rp {formatCurrency(totalSaldo)}</p>
              <p className="text-xs text-gray-400">Saldo Bersih</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{mockLaporanBulanan.length}</p>
              <p className="text-xs text-gray-400">Periode Tercatat</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Ringkasan Per Periode</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={periodeFilter === 'bulanan' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriodeFilter('bulanan')}
              className={periodeFilter === 'bulanan' ? 'bg-emerald-600' : 'text-gray-400'}
            >
              <Filter size={14} className="mr-1" />
              Bulanan
            </Button>
            <Button 
              variant={periodeFilter === 'semester' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriodeFilter('semester')}
              className={periodeFilter === 'semester' ? 'bg-emerald-600' : 'text-gray-400'}
            >
              Semester
            </Button>
            <Button 
              variant={periodeFilter === 'tahunan' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriodeFilter('tahunan')}
              className={periodeFilter === 'tahunan' ? 'bg-emerald-600' : 'text-gray-400'}
            >
              Tahunan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Periode</TableHead>
                <TableHead className="text-gray-400">Pemasukan</TableHead>
                <TableHead className="text-gray-400">Pengeluaran</TableHead>
                <TableHead className="text-gray-400">Saldo</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLaporanBulanan.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium text-white">{item.bulan}</TableCell>
                  <TableCell className="text-emerald-400">Rp {formatCurrency(item.pemasukan)}</TableCell>
                  <TableCell className="text-red-400">Rp {formatCurrency(item.pengeluaran)}</TableCell>
                  <TableCell className={item.saldo >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    Rp {formatCurrency(item.saldo)}
                  </TableCell>
                  <TableCell>
                    <Badge className={item.saldo >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                      {item.saldo >= 0 ? 'Surplus' : 'Defisit'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExport('pdf')}
                      className="h-8 gap-1 text-gray-400 hover:text-white"
                    >
                      <Download size={14} />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white text-lg">Kategori Pemasukan Terbesar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">SPP Bulanan</span>
              <span className="text-emerald-400 font-medium">Rp 35.000.000</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: '78%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Daftar Ulang</span>
              <span className="text-emerald-400 font-medium">Rp 7.500.000</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: '17%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Infaq</span>
              <span className="text-emerald-400 font-medium">Rp 2.500.000</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: '5%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white text-lg">Kategori Pengeluaran Terbesar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Gaji Pengajar</span>
              <span className="text-red-400 font-medium">Rp 18.000.000</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-red-500" style={{ width: '56%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Listrik & Air</span>
              <span className="text-red-400 font-medium">Rp 8.500.000</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-red-500" style={{ width: '27%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Operasional</span>
              <span className="text-red-400 font-medium">Rp 5.500.000</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-red-500" style={{ width: '17%' }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
