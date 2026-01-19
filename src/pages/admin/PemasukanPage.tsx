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
  ArrowDownCircle,
  TrendingUp
} from 'lucide-react'

interface Pemasukan {
  id: string
  tanggal: string
  santriName: string
  kategori: string
  keterangan: string
  jumlah: number
  status: 'LUNAS' | 'PENDING'
}

const mockPemasukan: Pemasukan[] = [
  { id: '1', tanggal: '2026-01-10', santriName: 'Ahmad Fauzi', kategori: 'SPP', keterangan: 'Pembayaran SPP Januari', jumlah: 500000, status: 'LUNAS' },
  { id: '2', tanggal: '2026-01-09', santriName: 'Siti Aisyah', kategori: 'SPP', keterangan: 'Pembayaran SPP Januari', jumlah: 500000, status: 'LUNAS' },
  { id: '3', tanggal: '2026-01-08', santriName: 'Muhammad Rizki', kategori: 'Infaq', keterangan: 'Infaq Bulanan', jumlah: 100000, status: 'LUNAS' },
  { id: '4', tanggal: '2026-01-07', santriName: 'Fatimah Zahra', kategori: 'Daftar Ulang', keterangan: 'Biaya Daftar Ulang Semester 2', jumlah: 750000, status: 'PENDING' },
  { id: '5', tanggal: '2026-01-06', santriName: 'Umar Abdullah', kategori: 'SPP', keterangan: 'Pembayaran SPP Januari', jumlah: 500000, status: 'LUNAS' },
]

const pemasukanSchema = z.object({
  santriName: z.string().min(1, 'Nama santri wajib diisi'),
  kategori: z.string().min(1, 'Kategori wajib diisi'),
  keterangan: z.string().min(1, 'Keterangan wajib diisi'),
  jumlah: z.string().min(1, 'Jumlah wajib diisi'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
})

type PemasukanFormData = z.infer<typeof pemasukanSchema>

export function PemasukanPage() {
  const [pemasukanList, setPemasukanList] = useState<Pemasukan[]>(mockPemasukan)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPemasukan, setEditingPemasukan] = useState<Pemasukan | null>(null)
  const [deletingPemasukan, setDeletingPemasukan] = useState<Pemasukan | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PemasukanFormData>({
    resolver: zodResolver(pemasukanSchema),
  })

  const filteredPemasukan = pemasukanList.filter(
    (item) =>
      item.santriName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPemasukan = pemasukanList.reduce((sum, item) => sum + item.jumlah, 0)
  const totalLunas = pemasukanList.filter(item => item.status === 'LUNAS').reduce((sum, item) => sum + item.jumlah, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const onSubmit = (data: PemasukanFormData) => {
    if (editingPemasukan) {
      setPemasukanList((prev) =>
        prev.map((item) =>
          item.id === editingPemasukan.id
            ? { ...item, ...data, jumlah: parseInt(data.jumlah) }
            : item
        )
      )
    } else {
      const newPemasukan: Pemasukan = {
        id: Date.now().toString(),
        tanggal: data.tanggal,
        santriName: data.santriName,
        kategori: data.kategori,
        keterangan: data.keterangan,
        jumlah: parseInt(data.jumlah),
        status: 'PENDING',
      }
      setPemasukanList((prev) => [newPemasukan, ...prev])
    }
    setShowModal(false)
    reset()
    setEditingPemasukan(null)
  }

  const handleEdit = (item: Pemasukan) => {
    setEditingPemasukan(item)
    reset({
      santriName: item.santriName,
      kategori: item.kategori,
      keterangan: item.keterangan,
      jumlah: item.jumlah.toString(),
      tanggal: item.tanggal,
    })
    setShowModal(true)
  }

  const confirmDelete = () => {
    if (deletingPemasukan) {
      setPemasukanList((prev) => prev.filter((item) => item.id !== deletingPemasukan.id))
      setDeletingPemasukan(null)
    }
  }

  const openAddModal = () => {
    setEditingPemasukan(null)
    reset({
      santriName: '',
      kategori: '',
      keterangan: '',
      jumlah: '',
      tanggal: new Date().toISOString().split('T')[0],
    })
    setShowModal(true)
  }

  const getStatusBadge = (status: Pemasukan['status']) => {
    const variants = {
      LUNAS: 'bg-emerald-500/20 text-emerald-400',
      PENDING: 'bg-yellow-500/20 text-yellow-400',
    }
    const labels = {
      LUNAS: 'Lunas',
      PENDING: 'Pending',
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
          <div className="rounded-lg bg-emerald-500/20 p-2">
            <ArrowDownCircle className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pemasukan</h1>
            <p className="text-sm text-muted-foreground">
              Kelola data pemasukan pesantren
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
        >
          <Plus size={18} />
          Input Pemasukan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, kategori, atau keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/20 p-2">
              <ArrowDownCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Rp {formatCurrency(totalPemasukan)}</p>
              <p className="text-xs text-muted-foreground">Total Pemasukan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Rp {formatCurrency(totalLunas)}</p>
              <p className="text-xs text-muted-foreground">Sudah Lunas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Daftar Pemasukan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Tanggal</TableHead>
                <TableHead className="text-muted-foreground">Nama Santri</TableHead>
                <TableHead className="text-muted-foreground">Kategori</TableHead>
                <TableHead className="text-muted-foreground">Keterangan</TableHead>
                <TableHead className="text-muted-foreground">Jumlah</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPemasukan.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-card"
                >
                  <TableCell className="text-muted-foreground">{item.tanggal}</TableCell>
                  <TableCell className="font-medium text-foreground">{item.santriName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.kategori}</TableCell>
                  <TableCell className="text-muted-foreground">{item.keterangan}</TableCell>
                  <TableCell className="text-emerald-400 font-medium">Rp {formatCurrency(item.jumlah)}</TableCell>
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
                        onClick={() => setDeletingPemasukan(item)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPemasukan.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? 'Tidak ada pemasukan yang ditemukan'
                      : 'Belum ada data pemasukan'}
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
                {editingPemasukan ? 'Edit Pemasukan' : 'Input Pemasukan Baru'}
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Nama Santri <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Pilih atau ketik nama santri"
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                  {...register('santriName')}
                />
                {errors.santriName && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.santriName.message}
                  </Badge>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Kategori <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
                    {...register('kategori')}
                  >
                    <option value="SPP" className="bg-gray-900">SPP</option>
                    <option value="Infaq" className="bg-gray-900">Infaq</option>
                    <option value="Daftar Ulang" className="bg-gray-900">Daftar Ulang</option>
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
                  placeholder="Pembayaran SPP Bulan Januari"
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
                  {editingPemasukan ? 'Simpan Perubahan' : 'Simpan'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {deletingPemasukan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeletingPemasukan(null)}
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
                <h2 className="text-xl font-bold text-foreground">Hapus Pemasukan</h2>
                <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="mb-6 text-muted-foreground">
              Apakah Anda yakin ingin menghapus pemasukan dari{' '}
              <span className="font-semibold text-foreground">{deletingPemasukan.santriName}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeletingPemasukan(null)}
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
