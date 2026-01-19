import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  ArrowUpCircle,
  TrendingDown
} from 'lucide-react'

interface Pengeluaran {
  id: string
  tanggal: string
  kategori: string
  keterangan: string
  jumlah: number
  status: 'DISETUJUI' | 'PENDING' | 'DITOLAK'
}

const mockPengeluaran: Pengeluaran[] = [
  { id: '1', tanggal: '2026-01-10', kategori: 'Operasional', keterangan: 'Pembelian ATK', jumlah: 250000, status: 'DISETUJUI' },
  { id: '2', tanggal: '2026-01-09', kategori: 'Listrik', keterangan: 'Pembayaran Listrik Januari', jumlah: 1500000, status: 'DISETUJUI' },
  { id: '3', tanggal: '2026-01-08', kategori: 'Air', keterangan: 'Pembayaran PDAM', jumlah: 350000, status: 'DISETUJUI' },
  { id: '4', tanggal: '2026-01-07', kategori: 'Perbaikan', keterangan: 'Perbaikan AC Ruang Kelas', jumlah: 800000, status: 'PENDING' },
  { id: '5', tanggal: '2026-01-06', kategori: 'Konsumsi', keterangan: 'Snack Rapat Bulanan', jumlah: 150000, status: 'DISETUJUI' },
]

const pengeluaranSchema = z.object({
  kategori: z.string().min(1, 'Kategori wajib diisi'),
  keterangan: z.string().min(1, 'Keterangan wajib diisi'),
  jumlah: z.string().min(1, 'Jumlah wajib diisi'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
})

type PengeluaranFormData = z.infer<typeof pengeluaranSchema>

export function PengeluaranPage() {
  const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>(mockPengeluaran)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPengeluaran, setEditingPengeluaran] = useState<Pengeluaran | null>(null)
  const [deletingPengeluaran, setDeletingPengeluaran] = useState<Pengeluaran | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PengeluaranFormData>({
    resolver: zodResolver(pengeluaranSchema),
  })

  const filteredPengeluaran = pengeluaranList.filter(
    (item) =>
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPengeluaran = pengeluaranList.reduce((sum, item) => sum + item.jumlah, 0)
  const totalDisetujui = pengeluaranList.filter(item => item.status === 'DISETUJUI').reduce((sum, item) => sum + item.jumlah, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const onSubmit = (data: PengeluaranFormData) => {
    if (editingPengeluaran) {
      setPengeluaranList((prev) =>
        prev.map((item) =>
          item.id === editingPengeluaran.id
            ? { ...item, ...data, jumlah: parseInt(data.jumlah) }
            : item
        )
      )
    } else {
      const newPengeluaran: Pengeluaran = {
        id: Date.now().toString(),
        tanggal: data.tanggal,
        kategori: data.kategori,
        keterangan: data.keterangan,
        jumlah: parseInt(data.jumlah),
        status: 'PENDING',
      }
      setPengeluaranList((prev) => [newPengeluaran, ...prev])
    }
    setShowModal(false)
    reset()
    setEditingPengeluaran(null)
  }

  const handleEdit = (item: Pengeluaran) => {
    setEditingPengeluaran(item)
    reset({
      kategori: item.kategori,
      keterangan: item.keterangan,
      jumlah: item.jumlah.toString(),
      tanggal: item.tanggal,
    })
    setShowModal(true)
  }

  const confirmDelete = () => {
    if (deletingPengeluaran) {
      setPengeluaranList((prev) => prev.filter((item) => item.id !== deletingPengeluaran.id))
      setDeletingPengeluaran(null)
    }
  }

  const openAddModal = () => {
    setEditingPengeluaran(null)
    reset({
      kategori: '',
      keterangan: '',
      jumlah: '',
      tanggal: new Date().toISOString().split('T')[0],
    })
    setShowModal(true)
  }

  const getStatusBadge = (status: Pengeluaran['status']) => {
    const variants = {
      DISETUJUI: 'bg-emerald-500/20 text-emerald-400',
      PENDING: 'bg-yellow-500/20 text-yellow-400',
      DITOLAK: 'bg-red-500/20 text-red-400',
    }
    const labels = {
      DISETUJUI: 'Disetujui',
      PENDING: 'Pending',
      DITOLAK: 'Ditolak',
    }
    return (
      <span className={`rounded-full px-2 py-1 text-xs ${variants[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-red-500/20 p-2">
            <ArrowUpCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pengeluaran</h1>
            <p className="text-sm text-muted-foreground">
              Kelola data pengeluaran pesantren
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
        >
          <Plus size={18} />
          Input Pengeluaran
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kategori atau keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-red-500/20 p-2">
              <ArrowUpCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Rp {formatCurrency(totalPengeluaran)}</p>
              <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-yellow-500/20 p-2">
              <TrendingDown className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Rp {formatCurrency(totalDisetujui)}</p>
              <p className="text-xs text-muted-foreground">Sudah Disetujui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Daftar Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Tanggal</TableHead>
                <TableHead className="text-muted-foreground">Kategori</TableHead>
                <TableHead className="text-muted-foreground">Keterangan</TableHead>
                <TableHead className="text-muted-foreground">Jumlah</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPengeluaran.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-card"
                >
                  <TableCell className="text-muted-foreground">{item.tanggal}</TableCell>
                  <TableCell className="font-medium text-foreground">{item.kategori}</TableCell>
                  <TableCell className="text-muted-foreground">{item.keterangan}</TableCell>
                  <TableCell className="text-red-400 font-medium">Rp {formatCurrency(item.jumlah)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingPengeluaran(item)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPengeluaran.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? 'Tidak ada pengeluaran yang ditemukan'
                      : 'Belum ada data pengeluaran'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-xl border border-border bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingPengeluaran ? 'Edit Pengeluaran' : 'Input Pengeluaran Baru'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Kategori <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
                    {...register('kategori')}
                  >
                    <option value="Operasional" className="bg-gray-900">Operasional</option>
                    <option value="Listrik" className="bg-gray-900">Listrik</option>
                    <option value="Air" className="bg-gray-900">Air</option>
                    <option value="Perbaikan" className="bg-gray-900">Perbaikan</option>
                    <option value="Konsumsi" className="bg-gray-900">Konsumsi</option>
                    <option value="Gaji" className="bg-gray-900">Gaji</option>
                    <option value="Lainnya" className="bg-gray-900">Lainnya</option>
                  </select>
                  {errors.kategori && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.kategori.message}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="date"
                    className="border-border bg-card text-foreground"
                    {...register('tanggal')}
                  />
                  {errors.tanggal && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.tanggal.message}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Jumlah (Rp) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="500000"
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                  {...register('jumlah')}
                />
                {errors.jumlah && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.jumlah.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Keterangan <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Deskripsi pengeluaran"
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                  {...register('keterangan')}
                />
                {errors.keterangan && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.keterangan.message}
                  </Badge>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {editingPengeluaran ? 'Simpan Perubahan' : 'Simpan'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {deletingPengeluaran && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeletingPengeluaran(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-xl border border-border bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-500/20 p-3">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Hapus Pengeluaran</h2>
                <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="mb-6 text-muted-foreground">
              Apakah Anda yakin ingin menghapus pengeluaran{' '}
              <span className="font-semibold text-foreground">{deletingPengeluaran.keterangan}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeletingPengeluaran(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Batal
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
