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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/20 p-2">
            <ArrowDownCircle className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Pemasukan</h1>
            <p className="text-sm text-gray-400">
              Kelola data pemasukan pesantren
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus size={18} />
          Input Pemasukan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-white/5 md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama, kategori, atau keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/20 p-2">
              <ArrowDownCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Rp {formatCurrency(totalPemasukan)}</p>
              <p className="text-xs text-gray-400">Total Pemasukan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Rp {formatCurrency(totalLunas)}</p>
              <p className="text-xs text-gray-400">Sudah Lunas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Daftar Pemasukan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Tanggal</TableHead>
                <TableHead className="text-gray-400">Nama Santri</TableHead>
                <TableHead className="text-gray-400">Kategori</TableHead>
                <TableHead className="text-gray-400">Keterangan</TableHead>
                <TableHead className="text-gray-400">Jumlah</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPemasukan.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="text-gray-300">{item.tanggal}</TableCell>
                  <TableCell className="font-medium text-white">{item.santriName}</TableCell>
                  <TableCell className="text-gray-300">{item.kategori}</TableCell>
                  <TableCell className="text-gray-300">{item.keterangan}</TableCell>
                  <TableCell className="text-emerald-400 font-medium">Rp {formatCurrency(item.jumlah)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingPemasukan(item)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
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
                    className="h-24 text-center text-gray-400"
                  >
                    {searchQuery
                      ? 'Tidak ada pemasukan yang ditemukan'
                      : 'Belum ada data pemasukan'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d1f12] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingPemasukan ? 'Edit Pemasukan' : 'Input Pemasukan Baru'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Nama Santri <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Pilih atau ketik nama santri"
                  className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
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
                  <label className="text-sm font-medium text-gray-300">
                    Kategori <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
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
                  <label className="text-sm font-medium text-gray-300">
                    Tanggal <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="date"
                    className="border-white/10 bg-white/5 text-white"
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
                <label className="text-sm font-medium text-gray-300">
                  Jumlah (Rp) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="500000"
                  className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  {...register('jumlah')}
                />
                {errors.jumlah && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.jumlah.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Keterangan <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Pembayaran SPP Bulan Januari"
                  className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
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
                  className="text-gray-400 hover:text-white"
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
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d1f12] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-500/20 p-3">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Hapus Pemasukan</h2>
                <p className="text-sm text-gray-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="mb-6 text-gray-300">
              Apakah Anda yakin ingin menghapus pemasukan dari{' '}
              <span className="font-semibold text-white">{deletingPemasukan.santriName}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeletingPemasukan(null)}
                className="text-gray-400 hover:text-white"
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
