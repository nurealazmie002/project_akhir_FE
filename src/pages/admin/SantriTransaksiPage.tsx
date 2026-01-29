import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { transactionService } from '@/services/transactionService'
import { santriService } from '@/services/santriService'
import { waliService } from '@/services/waliService'
import type { 
  Transaction, 
  TransactionType,
  TransactionCategory
} from '@/types/transaction.types'
import type { Santri } from '@/types'
import type { Wali } from '@/types/wali.types'
import { fadeInUp } from '@/lib/animations'
import { 
  Search, 
  Edit, 
  Trash2, 
  X,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowLeft,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Building2,
  Calendar,
  Users
} from 'lucide-react'

const transactionSchema = z.object({
  type: z.enum(['PEMASUKAN', 'PENGELUARAN']),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  description: z.string().optional(),
  amount: z.string().min(1, 'Jumlah wajib diisi'),
  transactionDate: z.string().min(1, 'Tanggal wajib diisi'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

type FilterType = 'ALL' | 'PEMASUKAN' | 'PENGELUARAN'

export function SantriTransaksiPage() {
  const { santriId } = useParams<{ santriId: string }>()
  const navigate = useNavigate()
  
  const [santri, setSantri] = useState<Santri | null>(null)
  const [wali, setWali] = useState<Wali | null>(null)
  const [transactionList, setTransactionList] = useState<Transaction[]>([])
  const [_categories, setCategories] = useState<TransactionCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<TransactionType>('PEMASUKAN')
  
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  })

  const watchedType = watch('type')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories for:', watchedType)
        const data = await transactionService.getCategories(watchedType)
        console.log('Categories fetched:', data)
        setCategories(data)
        
        if (data.length > 0) {
          setValue('categoryId', data[0].id, { shouldValidate: true })
        } else {
          try {
            const newCategory = await transactionService.createCategory({
              name: watchedType === 'PEMASUKAN' ? 'Pemasukan Umum' : 'Pengeluaran Umum',
              type: watchedType
            })
            
            setCategories([newCategory])
            setValue('categoryId', newCategory.id, { shouldValidate: true })
            if (error) setError(null)
          } catch (createErr) {
            console.error('Failed to auto-create category:', createErr)
            setValue('categoryId', '')
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    if (showModal) {
      fetchCategories()
    }
  }, [watchedType, showModal, setValue])

  const fetchSantri = async () => {
    if (!santriId) return
    try {
      const response = await santriService.getById(santriId)
      setSantri(response)
      
      if (response.waliId) {
        try {
          const waliData = await waliService.getById(String(response.waliId))
          setWali(waliData)
        } catch (err) {
          console.error('Failed to fetch wali:', err)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data santri')
    }
  }

  const fetchTransactions = async () => {
    if (!santriId) return
    setIsLoading(true)
    try {
      const response = await transactionService.getBySantriId(santriId)
      setTransactionList(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data transaksi')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSantri()
    fetchTransactions()
  }, [santriId])

  const filteredTransactions = transactionList
    .filter((item) => {
      if (filterType === 'ALL') return true
      return item.type === filterType
    })
    .filter(
      (item) =>
        (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.category?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.transactionDate).getTime()
      const dateB = new Date(b.transactionDate).getTime()
      if (dateA !== dateB) return dateB - dateA
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const totalIncome = transactionList
    .filter(t => t.type === 'PEMASUKAN')
    .reduce((sum, item) => sum + Number(item.amount), 0)
  
  const totalExpense = transactionList
    .filter(t => t.type === 'PENGELUARAN')
    .reduce((sum, item) => sum + Number(item.amount), 0)
  
  const balance = totalIncome - totalExpense

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const onSubmit = async (data: TransactionFormData) => {
    if (!santriId) return
    setIsLoading(true)
    setError(null)

    try {
      const payload: any = {
        santriId: santriId,
        type: data.type,
        categoryId: data.categoryId,
        amount: parseInt(data.amount),
        description: data.description || undefined,
        transactionDate: data.transactionDate,
      }

      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, {
          type: data.type,
          categoryId: data.categoryId,
          amount: parseInt(data.amount),
          description: data.description || undefined,
          transactionDate: data.transactionDate,
        })
      } else {
        await transactionService.create(payload)
      }
      await fetchTransactions()
      setShowModal(false)
      reset()
      setEditingTransaction(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data transaksi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: Transaction) => {
    setEditingTransaction(item)
    setSelectedType(item.type)
    reset({
      type: item.type,
      categoryId: item.categoryId || '',
      description: item.description || '',
      amount: String(item.amount),
      transactionDate: item.transactionDate.split('T')[0],
    })
    setShowModal(true)
  }

  const handleDelete = (item: Transaction) => {
    setDeletingTransaction(item)
  }

  const confirmDelete = async () => {
    if (!deletingTransaction) return

    setIsLoading(true)
    try {
      await transactionService.delete(deletingTransaction.id)
      await fetchTransactions()
      setDeletingTransaction(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus data')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = (type: TransactionType = 'PEMASUKAN') => {
    setEditingTransaction(null)
    setSelectedType(type)
    reset({
      type: type,
      categoryId: '',
      description: '',
      amount: '',
      transactionDate: new Date().toISOString().split('T')[0],
    })
    setShowModal(true)
  }

  const getTypeBadge = (type: TransactionType) => {
    if (type === 'PEMASUKAN') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400">
          <ArrowDownCircle size={12} />
          Pemasukan
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-red-500/20 text-red-400">
        <ArrowUpCircle size={12} />
        Pengeluaran
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/santri')}
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft size={18} className="mr-2" />
                Kembali
              </Button>
              <div className="hidden sm:block h-6 w-px bg-white/20" />
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-white">Transaksi Santri</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => openAddModal('PEMASUKAN')}
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Pemasukan</span>
              </Button>
              <Button
                onClick={() => openAddModal('PENGELUARAN')}
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white shadow-lg shadow-rose-500/25"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Pengeluaran</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="destructive" className="w-full justify-center py-2">
              {error}
            </Badge>
          </motion.div>
        )}


        <motion.div 
          initial="initial" 
          animate="animate" 
          variants={fadeInUp}
          className="grid gap-6 lg:grid-cols-2"
        >

          <Card 
            className="border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur cursor-pointer md:cursor-default transition-all duration-300"
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/25">
                    {santri?.fullname?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Profil Santri</CardTitle>
                    <p className="text-sm text-slate-400">Informasi lengkap santri</p>
                  </div>
                </div>
                {/* Mobile Chevron */}
                <div className="md:hidden text-slate-400">
                  {isProfileExpanded ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {santri ? (
                <>
                  {/* Name is always visible, but other details are collapsible on mobile */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 md:hidden">
                    <User className="h-4 w-4 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">Nama Lengkap</p>
                      <p className="font-medium text-white">{santri.fullname}</p>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <div className={`grid gap-4 sm:grid-cols-2 ${isProfileExpanded ? 'block' : 'hidden md:grid'}`}>
                    {/* Hidden on mobile duplicate name since shown above, visible on desktop */}
                    <div className="hidden md:flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <User className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-400">Nama Lengkap</p>
                        <p className="font-medium text-white">{santri.fullname}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <GraduationCap className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-slate-400">NIS</p>
                        <p className="font-medium text-white font-mono">{santri.nis}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Building2 className="h-4 w-4 text-emerald-400" />
                      <div>
                        <p className="text-xs text-slate-400">Kelas</p>
                        <p className="font-medium text-white">{santri.kelas}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Users className="h-4 w-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-slate-400">Jenis Kelamin</p>
                        <p className="font-medium text-white">{santri.gender}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge - Collapsible on mobile */}
                  <div className={`flex items-center gap-2 pt-2 ${isProfileExpanded ? 'flex' : 'hidden md:flex'}`}>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      santri.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${santri.isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {santri.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                    {santri.institutionName && (
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400">
                        {santri.institutionName}
                      </span>
                    )}
                  </div>
                  
                  {!isProfileExpanded && (
                    <p className="text-xs text-center text-slate-500 md:hidden pt-2">Ketuk untuk lihat detail</p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              )}
            </CardContent>
          </Card>


          <Card className="border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-amber-500/25">
                  {wali?.name?.charAt(0)?.toUpperCase() || santri?.waliName?.charAt(0)?.toUpperCase() || 'W'}
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Profil Wali</CardTitle>
                  <p className="text-sm text-slate-400">Informasi wali santri</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {wali ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <User className="h-4 w-4 text-amber-400" />
                    <div>
                      <p className="text-xs text-slate-400">Nama Wali</p>
                      <p className="font-medium text-white">{wali.name || wali.username || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="font-medium text-white text-sm truncate">{wali.email}</p>
                    </div>
                  </div>
                  {wali.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Phone className="h-4 w-4 text-emerald-400" />
                      <div>
                        <p className="text-xs text-slate-400">Telepon</p>
                        <p className="font-medium text-white">{wali.phone}</p>
                      </div>
                    </div>
                  )}
                  {wali.occupation && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Briefcase className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-slate-400">Pekerjaan</p>
                        <p className="font-medium text-white">{wali.occupation}</p>
                      </div>
                    </div>
                  )}
                  {wali.address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 sm:col-span-2">
                      <MapPin className="h-4 w-4 text-rose-400" />
                      <div>
                        <p className="text-xs text-slate-400">Alamat</p>
                        <p className="font-medium text-white">{wali.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : santri?.waliName ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                  <User className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-xs text-slate-400">Nama Wali</p>
                    <p className="font-medium text-white">{santri.waliName}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-slate-400">
                  Data wali tidak tersedia
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>


        <motion.div 
          initial="initial" 
          animate="animate" 
          variants={fadeInUp}
          className="grid gap-4 grid-cols-1 sm:grid-cols-3"
        >
          <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-emerald-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">Rp {formatCurrency(totalIncome)}</p>
                <p className="text-sm text-slate-400">Total Pemasukan</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-red-500/20 p-3">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-400">Rp {formatCurrency(totalExpense)}</p>
                <p className="text-sm text-slate-400">Total Pengeluaran</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-blue-500/20 p-3">
                <Wallet className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  Rp {formatCurrency(Math.abs(balance))}
                </p>
                <p className="text-sm text-slate-400">{balance >= 0 ? 'Saldo' : 'Defisit'}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterType === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('ALL')}
            className={filterType === 'ALL' ? 'bg-blue-600 hover:bg-blue-700 border-0' : 'border-white/20 text-slate-300 hover:bg-white/10'}
          >
            Semua ({transactionList.length})
          </Button>
          <Button
            variant={filterType === 'PEMASUKAN' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('PEMASUKAN')}
            className={filterType === 'PEMASUKAN' ? 'bg-emerald-600 hover:bg-emerald-700 border-0' : 'border-white/20 text-slate-300 hover:bg-white/10'}
          >
            <ArrowDownCircle size={14} className="mr-1.5" />
            Pemasukan
          </Button>
          <Button
            variant={filterType === 'PENGELUARAN' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('PENGELUARAN')}
            className={filterType === 'PENGELUARAN' ? 'bg-red-600 hover:bg-red-700 border-0' : 'border-white/20 text-slate-300 hover:bg-white/10'}
          >
            <ArrowUpCircle size={14} className="mr-1.5" />
            Pengeluaran
          </Button>
        </div>


        <Card className="border-white/10 bg-slate-800/50 backdrop-blur">
          <CardHeader className="pb-4 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-white">Riwayat Transaksi</CardTitle>
                <p className="text-sm text-slate-400 mt-1">
                  {filteredTransactions.length} dari {transactionList.length} transaksi
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 bg-white/5 hover:bg-white/5">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400 py-3 px-4">Tanggal</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400 py-3 px-4">Tipe</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400 py-3 px-4">Kategori</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400 py-3 px-4">Keterangan</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400 py-3 px-4">Jumlah</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400 py-3 px-4 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                          <p className="text-slate-400">Memuat data...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Search className="h-6 w-6 text-slate-500" />
                          </div>
                          <p className="text-slate-400">
                            {searchQuery ? 'Tidak ada hasil ditemukan' : 'Belum ada transaksi'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={`border-white/5 transition-colors hover:bg-white/5 ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}
                      >
                        <TableCell className="py-3 px-4 text-slate-300 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            {new Date(item.transactionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">{getTypeBadge(item.type)}</TableCell>
                        <TableCell className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            item.type === 'PEMASUKAN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {item.category?.name || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-slate-300 max-w-[200px] truncate">{item.description || '-'}</TableCell>
                        <TableCell className={`py-3 px-4 font-semibold ${
                          item.type === 'PEMASUKAN' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {item.type === 'PEMASUKAN' ? '+' : '-'} Rp {formatCurrency(Number(item.amount))}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                            >
                              <Edit size={15} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
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
      </main>


      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${selectedType === 'PEMASUKAN' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  {selectedType === 'PEMASUKAN' ? (
                    <ArrowDownCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <ArrowUpCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {editingTransaction ? 'Edit Transaksi' : `Tambah ${selectedType === 'PEMASUKAN' ? 'Pemasukan' : 'Pengeluaran'}`}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)} className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                <X size={18} />
              </Button>
            </div>

            {santri && (
              <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                    {santri.fullname?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{santri.fullname}</p>
                    <p className="text-xs text-slate-400">NIS: {santri.nis} • {santri.kelas}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Tipe Transaksi</label>
                <select 
                  {...register('type', {
                    onChange: (e) => setSelectedType(e.target.value)
                  })}
                  className="w-full mt-1 h-9 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 px-3 text-sm"
                >
                  <option value="PEMASUKAN" className="bg-slate-800 text-white">Pemasukan</option>
                  <option value="PENGELUARAN" className="bg-slate-800 text-white">Pengeluaran</option>
                </select>
              </div>

              {/* Hidden category selection for backend requirement */}
              <input type="hidden" {...register('categoryId')} />
              {errors.categoryId && (
                <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded mt-1">
                  Error: Kategori tidak ditemukan. Pastikan master data kategori sudah diisi.
                </p>
              )}

              <div>
                <label className="text-sm font-medium text-slate-300">Keterangan</label>
                <Input {...register('description')} placeholder="Masukkan keterangan (opsional)" className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Jumlah (Rp)</label>
                <Input {...register('amount')} type="number" placeholder="Masukkan jumlah" className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Tanggal Transaksi</label>
                <Input {...register('transactionDate')} type="date" className="mt-1 bg-white/5 border-white/10 text-white" />
                {errors.transactionDate && <p className="mt-1 text-xs text-red-400">{errors.transactionDate.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-white/20 text-slate-300 hover:bg-white/10">
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 ${selectedType === 'PEMASUKAN' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-red-500'}`}
                >
                  {isLoading ? 'Menyimpan...' : editingTransaction ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}


      {deletingTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setDeletingTransaction(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-500/20 p-3">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Hapus Transaksi</h3>
                <p className="text-sm text-slate-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="mb-6 text-slate-300">
              Apakah Anda yakin ingin menghapus transaksi{' '}
              <span className="font-medium text-white">
                {deletingTransaction.category?.name || 'ini'} - Rp {formatCurrency(Number(deletingTransaction.amount))}
              </span>?
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeletingTransaction(null)} className="flex-1 border-white/20 text-slate-300 hover:bg-white/10">
                Batal
              </Button>
              <Button onClick={confirmDelete} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700">
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
