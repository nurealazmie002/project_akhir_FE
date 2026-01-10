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
  institutionId: z.string().min(1, 'Institution ID wajib diisi'),
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
      console.log('📚 Fetched santri:', response.data)
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

        const updatedSantri = await santriService.update(editingSantri.id, data)
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
      institutionId: santri.institutionId,
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

      await santriService.delete(deletingSantri.id)
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
      institutionId: '',
      waliName: '',
    })
    setShowModal(true)
  }

  const getStatusBadge = (status: Santri['status']) => {
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
            <h1 className="text-2xl font-bold text-white">Data Santri</h1>
            <p className="text-sm text-gray-400">
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
        <Card className="border-white/10 bg-white/5 md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama, NIS, atau kelas..."
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
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{santriList.length}</p>
              <p className="text-xs text-gray-400">Total Santri</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <UserPlus className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {santriList.filter((s) => s.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-gray-400">Santri Aktif</p>
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


      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Daftar Santri</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">NIS</TableHead>
                <TableHead className="text-gray-400">Nama</TableHead>
                <TableHead className="text-gray-400">Kelas</TableHead>
                <TableHead className="text-gray-400">Gender</TableHead>
                <TableHead className="text-gray-400">Institution ID</TableHead>
                <TableHead className="text-gray-400">Nama Wali</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSantri.map((santri) => (
                <TableRow
                  key={santri.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium text-amber-400">
                    {santri.nis}
                  </TableCell>
                  <TableCell className="text-white">{santri.fullname}</TableCell>
                  <TableCell className="text-gray-300">{santri.kelas}</TableCell>
                  <TableCell className="text-gray-300">
                    {santri.gender}
                  </TableCell>
                  <TableCell className="text-gray-300 text-xs">
                    {santri.institutionId}
                  </TableCell>
                  <TableCell className="text-gray-300 text-xs">
                    {santri.waliName}
                  </TableCell>
                  <TableCell>{getStatusBadge(santri.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(santri)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(santri)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
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
                    className="h-24 text-center text-gray-400"
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
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d1f12] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingSantri ? 'Edit Santri' : 'Tambah Santri Baru'}
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
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Masukkan nama lengkap"
                    className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-gray-500"
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
                  <label className="text-sm font-medium text-gray-300">
                    NIS <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="2024001"
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    {...register('nis')}
                  />
                  {errors.nis && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.nis.message}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Kelas <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="VII-A"
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
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
                <label className="text-sm font-medium text-gray-300">
                  Jenis Kelamin <span className="text-red-400">*</span>
                </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <label className="text-sm font-medium text-gray-300">
                    Institution ID <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="pesantren-al-ikhlas"
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    {...register('institutionId')}
                  />
                  {errors.institutionId && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.institutionId.message}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Nama Wali <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="Nama lengkap wali santri"
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
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
                  className="text-gray-400 hover:text-white"
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
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d1f12] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-500/20 p-3">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Hapus Santri</h2>
                <p className="text-sm text-gray-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="mb-6 text-gray-300">
              Apakah Anda yakin ingin menghapus santri{' '}
              <span className="font-semibold text-white">{deletingSantri.fullname}</span> (NIS: {deletingSantri.nis})?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeletingSantri(null)}
                className="text-gray-400 hover:text-white"
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
