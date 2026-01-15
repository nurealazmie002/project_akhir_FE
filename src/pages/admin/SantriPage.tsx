import { useState, useEffect } from 'react'
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
  User
} from 'lucide-react'

const santriSchema = z.object({
  fullname: z.string().min(3, 'Nama minimal 3 karakter'),
  nis: z.string().min(1, 'NIS wajib diisi'),
  kelas: z.string().min(1, 'Kelas wajib diisi'),
  gender: z.enum(['Laki-laki', 'Perempuan'], { message: 'Pilih jenis kelamin' }),
  institutionName: z.string().min(1, 'Nama Lembaga wajib diisi'),
  waliName: z.string().min(1, 'Nama Wali wajib diisi'),
})

type SantriFormData = z.infer<typeof santriSchema>

export function SantriPage() {
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
      console.log(' Fetched santri:', response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data santri')
      console.error('Failed to fetch santri:', err)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchSantri()
  }, [])


  const filteredSantri = santriList.filter(
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

        const updatedSantri = await santriService.update(String(editingSantri.id), data)
        console.log('✏️ Updated santri:', updatedSantri)
      } else {

        const newSantri = await santriService.create(data)
        console.log('➕ Created santri:', newSantri)
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
      institutionName: santri.institutionName || '',
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
      console.log('🗑️ Deleted santri:', deletingSantri.id)
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
      institutionName: '',
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
      className="space-y-6"
    >

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/20 p-2">
            <Users className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Santri</h1>
            <p className="text-sm text-muted-foreground">
              Kelola data santri pesantren
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus size={18} />
          Tambah Santri
        </Button>
      </div>


      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIS, atau kelas..."
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
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{santriList.length}</p>
              <p className="text-xs text-muted-foreground">Total Santri</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <UserPlus className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {santriList.filter((s) => s.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-muted-foreground">Santri Aktif</p>
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


      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Daftar Santri</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">NIS</TableHead>
                <TableHead className="text-muted-foreground">Nama</TableHead>
                <TableHead className="text-muted-foreground">Kelas</TableHead>
                <TableHead className="text-muted-foreground">Gender</TableHead>
                <TableHead className="text-muted-foreground">Institution ID</TableHead>
                <TableHead className="text-muted-foreground">Nama Wali</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSantri.map((santri) => (
                <TableRow
                  key={santri.id}
                  className="border-border hover:bg-card"
                >
                  <TableCell className="font-medium text-amber-400">
                    {santri.nis}
                  </TableCell>
                  <TableCell className="text-foreground">{santri.fullname}</TableCell>
                  <TableCell className="text-muted-foreground">{santri.kelas}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {santri.gender}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {santri.institutionName || santri.institutionId || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {santri.waliName}
                  </TableCell>
                  <TableCell>
                    {santri.isActive !== undefined ? (
                      <span className={`rounded-full px-2 py-1 text-xs ${santri.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {santri.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    ) : santri.status ? (
                      getStatusBadge(santri.status)
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(santri)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(santri)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSantri.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? 'Tidak ada santri yang ditemukan'
                      : 'Belum ada data santri'}
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Lembaga <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="Pesantren Al-Ikhlas"
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                    {...register('institutionName')}
                  />
                  {errors.institutionName && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.institutionName.message}
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
