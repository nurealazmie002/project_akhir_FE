import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
import { santriService } from '@/services/santriService'
import { useAuthStore } from '@/stores/authStore'
import type { Santri } from '@/types'
import { fadeInUp } from '@/lib/animations'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  Users,
  UserPlus,
  User,
  ArrowLeft,
  Wallet
} from 'lucide-react'

const santriSchema = z.object({
  fullname: z.string().min(3, 'Nama minimal 3 karakter'),
  nis: z.string().min(1, 'NIS wajib diisi'),
  kelas: z.string().min(1, 'Kelas wajib diisi'),
  gender: z.enum(['Laki-laki', 'Perempuan'], { message: 'Pilih jenis kelamin' }),
  waliName: z.string().min(1, 'Nama Wali wajib diisi'),
})

type SantriFormData = z.infer<typeof santriSchema>

export function SantriPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const waliNameFilter = searchParams.get('waliName') || ''
  
  const { user: _user } = useAuthStore()
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null)
  const [deletingSantri, setDeletingSantri] = useState<Santri | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SantriFormData>({
    resolver: zodResolver(santriSchema),
  })


  const fetchSantri = async () => {
    setIsLoading(true)
    try {
      const response = await santriService.getAll()
      setSantriList(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data santri')
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchSantri()
  }, [])


  const filteredSantri = santriList
    .filter((santri) => {
      if (!waliNameFilter) return true
      return santri.waliName?.toLowerCase() === waliNameFilter.toLowerCase()
    })
    .filter(
      (santri) =>
        (santri.fullname?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (santri.nis?.toString() || '').includes(searchQuery) ||
        (santri.kelas?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )

  const onSubmit = async (data: SantriFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      if (editingSantri) {
        await santriService.update(String(editingSantri.id), data)
      } else {
        await santriService.create(data)
      }

      await fetchSantri()
      setShowModal(false)
      reset()
      setEditingSantri(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data santri')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (santri: Santri) => {
    setEditingSantri(santri)
    reset({
      fullname: santri.fullname,
      nis: santri.nis,
      kelas: santri.kelas,
      gender: santri.gender,
      waliName: santri.waliName,
    })
    setShowModal(true)
  }

  const handleDelete = (santri: Santri) => {
    setDeletingSantri(santri)
  }

  const confirmDelete = async () => {
    if (!deletingSantri) return

    setIsLoading(true)
    try {

      await santriService.delete(String(deletingSantri.id))
      console.log('Deleted santri:', deletingSantri.id)
      await fetchSantri()
      setDeletingSantri(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus santri')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingSantri(null)
    reset({
      fullname: '',
      nis: '',
      kelas: '',
      gender: 'Laki-laki',
      waliName: '',
    })
    setShowModal(true)
  }

  const getStatusBadge = (status?: Santri['status']) => {
    if (!status) return <span className="text-muted-foreground">-</span>
    const variants = {
      ACTIVE: 'bg-emerald-500/20 text-emerald-400',
      INACTIVE: 'bg-yellow-500/20 text-yellow-400',
      GRADUATED: 'bg-blue-500/20 text-blue-400',
    }
    const labels = {
      ACTIVE: 'Aktif',
      INACTIVE: 'Tidak Aktif',
      GRADUATED: 'Lulus',
    }
    return (
      <span className={`rounded-full px-2 py-1 text-xs ${variants[status]}`}>
        {labels[status]}
      </span>
    )
  }


  void santriService

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-4 sm:space-y-6"
    >


      {waliNameFilter && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/santri')}
            className="h-9 w-9 p-0 text-purple-400 hover:bg-purple-500/20"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex-1">
            <p className="text-sm text-purple-300">Menampilkan santri dari wali:</p>
            <p className="font-semibold text-purple-400">{waliNameFilter}</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-0">
            {filteredSantri.length} santri
          </Badge>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-lg bg-emerald-500/20 p-1.5 sm:p-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">
              {waliNameFilter ? `Santri - ${waliNameFilter}` : 'Data Santri'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              {waliNameFilter ? `Daftar santri dengan wali ${waliNameFilter}` : 'Kelola data santri pesantren'}
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus size={18} />
          Tambah Santri
        </Button>
      </div>



      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/20 p-2">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{santriList.length}</p>
              <p className="text-xs text-muted-foreground">Total Santri</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-500/20 p-2">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {santriList.filter((s) => s.status === 'ACTIVE' || s.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Santri Aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-amber-100 dark:bg-amber-500/20 p-2">
              <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {santriList.filter((s) => s.gender === 'Laki-laki').length}
              </p>
              <p className="text-xs text-muted-foreground">Laki-laki</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-pink-100 dark:bg-pink-500/20 p-2">
              <User className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {santriList.filter((s) => s.gender === 'Perempuan').length}
              </p>
              <p className="text-xs text-muted-foreground">Perempuan</p>
            </div>
          </CardContent>
        </Card>
      </div>


      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="destructive" className="w-full justify-center py-2">
            {error}
          </Badge>
        </motion.div>
      )}


      <Card className="border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-foreground">Daftar Santri</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredSantri.length} dari {santriList.length} santri
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIS, kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-muted/50 border-border/50 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">NIS</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Nama</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Kelas</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Gender</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Institusi</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Wali</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSantri.map((santri, index) => (
                  <TableRow
                    key={santri.id}
                    className={`border-border transition-colors hover:bg-muted/50 ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}`}
                  >
                    <TableCell className="py-3 px-4">
                      <span className="font-mono text-sm font-medium text-primary">{santri.nis}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                          {santri.fullname?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <span className="font-medium text-foreground">{santri.fullname}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400">
                        {santri.kelas || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground text-sm">
                      {santri.gender || '-'}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground text-sm max-w-[120px] truncate">
                      {santri.institutionName || santri.institutionId || '-'}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground text-sm">
                      {santri.waliName || '-'}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {santri.isActive !== undefined ? (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${santri.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${santri.isActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                          {santri.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      ) : santri.status ? (
                        getStatusBadge(santri.status)
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/santri/${santri.id}/transaksi`)}
                          title="Lihat Transaksi"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10"
                        >
                          <Wallet size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(santri)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Edit size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(santri)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSantri.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                          <Search className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground">
                          {searchQuery
                            ? 'Tidak ada santri yang ditemukan'
                            : 'Belum ada data santri'}
                        </p>
                      </div>
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
                {editingSantri ? 'Edit Santri' : 'Tambah Santri Baru'}
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
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Masukkan nama lengkap"
                    className="border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground"
                    {...register('fullname')}
                  />
                </div>
                {errors.fullname && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.fullname.message}
                  </Badge>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    NIS <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="2024001"
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                    {...register('nis')}
                  />
                  {errors.nis && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.nis.message}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Kelas <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="VII-A"
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                    {...register('kelas')}
                  />
                  {errors.kelas && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.kelas.message}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Jenis Kelamin <span className="text-red-400">*</span>
                </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('gender')}
                  >
                    <option value="Laki-laki" className="bg-gray-900">
                      Laki-laki
                    </option>
                    <option value="Perempuan" className="bg-gray-900">
                      Perempuan
                    </option>
                  </select>
                {errors.gender && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.gender.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Nama Wali <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Nama lengkap wali santri"
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                  {...register('waliName')}
                />
                {errors.waliName && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.waliName.message}
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
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Menyimpan...'
                    : editingSantri
                    ? 'Simpan Perubahan'
                    : 'Tambah Santri'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}


      {deletingSantri && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeletingSantri(null)}
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
                <h2 className="text-xl font-bold text-foreground">Hapus Santri</h2>
                <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="mb-6 text-muted-foreground">
              Apakah Anda yakin ingin menghapus santri{' '}
              <span className="font-semibold text-foreground">{deletingSantri.fullname}</span> (NIS: {deletingSantri.nis})?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeletingSantri(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Batal
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Menghapus...' : 'Hapus Santri'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
