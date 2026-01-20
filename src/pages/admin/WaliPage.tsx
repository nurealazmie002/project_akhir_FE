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
import { waliService } from '@/services/waliService'
import type { Wali } from '@/types/wali.types'
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
  Eye,
  EyeOff,
  Phone,
  Mail
} from 'lucide-react'

const waliSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
})

type WaliFormData = z.infer<typeof waliSchema>

export function WaliPage() {
  const [waliList, setWaliList] = useState<Wali[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingWali, setEditingWali] = useState<Wali | null>(null)
  const [deletingWali, setDeletingWali] = useState<Wali | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaliFormData>({
    resolver: zodResolver(waliSchema),
  })

  const fetchWali = async () => {
    setIsLoading(true)
    try {
      const response = await waliService.getAll()
      setWaliList(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data wali')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWali()
  }, [])

  const filteredWali = waliList.filter(
    (wali) =>
      (wali.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (wali.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (wali.phone || '').includes(searchQuery)
  )

  const onSubmit = async (data: WaliFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      if (editingWali) {
        const updateData: any = { ...data }
        if (!updateData.password) delete updateData.password
        await waliService.update(String(editingWali.id), updateData)
      } else {
        if (!data.password) {
          setError('Password wajib diisi untuk akun baru')
          setIsLoading(false)
          return
        }
        await waliService.create(data as any)
      }
      await fetchWali()
      setShowModal(false)
      reset()
      setEditingWali(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data wali')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (wali: Wali) => {
    setEditingWali(wali)
    reset({
      username: wali.username || wali.name || '',
      email: wali.email,
      password: '',
    })
    setShowModal(true)
  }

  const handleDelete = (wali: Wali) => {
    setDeletingWali(wali)
  }

  const confirmDelete = async () => {
    if (!deletingWali) return

    setIsLoading(true)
    try {
      await waliService.delete(String(deletingWali.id))
      await fetchWali()
      setDeletingWali(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus wali')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingWali(null)
    reset({
      username: '',
      email: '',
      password: '',
    })
    setShowModal(true)
  }

  const getStatusBadge = (isActive?: boolean) => {
    if (isActive === undefined) return <span className="text-muted-foreground">-</span>
    return isActive ? (
      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Aktif</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Nonaktif</Badge>
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
          <div className="rounded-lg bg-purple-500/20 p-2">
            <Users className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Wali</h1>
            <p className="text-sm text-muted-foreground">
              Kelola akun wali santri
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
        >
          <Plus size={18} />
          Tambah Wali
        </Button>
      </div>

      {error && (
        <Badge variant="destructive" className="w-full justify-center py-2">
          {error}
        </Badge>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card md:col-span-2">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{waliList.length}</p>
              <p className="text-xs text-muted-foreground">Total Wali</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/20 p-2">
              <UserPlus className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {waliList.filter(w => w.isActive !== false).length}
              </p>
              <p className="text-xs text-muted-foreground">Wali Aktif</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Daftar Wali</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Nama</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Telepon</TableHead>
                <TableHead className="text-muted-foreground">Pekerjaan</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredWali.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {searchQuery ? 'Tidak ada hasil ditemukan' : 'Belum ada data wali'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWali.map((wali) => (
                  <TableRow
                    key={wali.id}
                    className="border-border hover:bg-accent"
                  >
                    <TableCell className="text-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-purple-400" />
                        </div>
                        {wali.username || wali.name || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {wali.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {wali.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {wali.occupation || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(wali.isActive)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(wali)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(wali)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-xl border border-border bg-background p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingWali ? 'Edit Wali' : 'Tambah Wali Baru'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  <User className="inline h-4 w-4 mr-1" />
                  Username <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Username wali"
                  {...register('username')}
                />
                {errors.username && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.username.message}
                  </Badge>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.email.message}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Password {!editingWali && <span className="text-red-400">*</span>}
                  {editingWali && <span className="text-muted-foreground text-xs">(kosongkan jika tidak diubah)</span>}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.password.message}
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
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? 'Menyimpan...' : editingWali ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingWali && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl border border-border bg-background p-6"
          >
            <h2 className="text-xl font-bold text-foreground">Hapus Wali</h2>
            <p className="mt-2 text-muted-foreground">
              Apakah Anda yakin ingin menghapus akun wali{' '}
              <span className="font-semibold text-foreground">{deletingWali.name}</span>?
            </p>
            <p className="mt-1 text-sm text-red-400">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeletingWali(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Batal
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
