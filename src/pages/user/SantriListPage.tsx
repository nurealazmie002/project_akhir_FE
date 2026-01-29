import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import type { Santri } from '@/types/santri.types'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { 
  Search,
  Wallet,
  Users,
  UserCheck,
  User,
  UserX
} from 'lucide-react'

export function SantriListPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) {
        console.log('No user.username found:', user)
        return
      }
      setIsLoading(true)
      try {
        console.log('Fetching santri for wali:', user.username)
        const response = await santriService.getAll()
        const allSantri = Array.isArray(response) ? response : (response.data || [])
        console.log('All santri:', allSantri)
        
        const waliSantri = allSantri.filter(
          (s: Santri) => s.waliName?.toLowerCase() === user.username?.toLowerCase()
        )
        console.log('Filtered santri for wali:', waliSantri)
        setSantriList(waliSantri)
      } catch (err: any) {
        console.error('Error fetching santri:', err)
        setError(err.response?.data?.message || 'Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user?.username])

  const filteredSantri = santriList.filter(
    (santri) =>
      santri.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      santri.nis?.includes(searchQuery) ||
      santri.kelas?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSantri = santriList.length
  const activeSantri = santriList.filter(s => s.isActive !== false).length
  const maleSantri = santriList.filter(s => s.gender?.toLowerCase() === 'laki-laki').length
  const femaleSantri = santriList.filter(s => s.gender?.toLowerCase() === 'perempuan').length

  const statCards = [
    { title: 'Total Santri', value: totalSantri, icon: Users, color: 'from-teal-500 to-teal-600' },
    { title: 'Santri Aktif', value: activeSantri, icon: UserCheck, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Laki-laki', value: maleSantri, icon: User, color: 'from-cyan-500 to-cyan-600' },
    { title: 'Perempuan', value: femaleSantri, icon: UserX, color: 'from-rose-400 to-rose-500' },
  ]

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
            <Wallet className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Santri - {user?.name || 'Wali Santri'}</h1>
            <p className="text-sm text-muted-foreground">Pilih santri untuk melihat transaksi keuangan</p>
          </div>
        </div>
        <Badge className="bg-primary/20 text-primary w-fit">
          {totalSantri} santri
        </Badge>
      </div>

      {error && (
        <Badge variant="destructive" className="w-full justify-center py-2">
          {error}
        </Badge>
      )}

      <motion.div 
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.title} variants={staggerItem}>
            <Card className="border-border/50 bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-foreground">Daftar Santri</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{filteredSantri.length} dari {totalSantri} santri</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIS, kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Memuat data...</p>
          ) : filteredSantri.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery ? 'Tidak ada hasil ditemukan' : 'Belum ada data santri'}
            </p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold text-foreground">NIS</TableHead>
                    <TableHead className="font-semibold text-foreground">NAMA</TableHead>
                    <TableHead className="font-semibold text-foreground">KELAS</TableHead>
                    <TableHead className="font-semibold text-foreground">GENDER</TableHead>
                    <TableHead className="font-semibold text-foreground">INSTITUSI</TableHead>
                    <TableHead className="font-semibold text-foreground">STATUS</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.map((santri) => (
                    <TableRow 
                      key={santri.id} 
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/santri/${santri.id}/transaksi`)}
                    >
                      <TableCell className="font-mono text-sm">{santri.nis}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-white text-xs font-medium">
                            {santri.fullname?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <span className="font-medium">{santri.fullname}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          {santri.kelas}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{santri.gender}</TableCell>
                      <TableCell className="text-muted-foreground">{santri.institutionName || '-'}</TableCell>
                      <TableCell>
                        <Badge className={santri.isActive !== false 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                        }>
                          {santri.isActive !== false ? '● Aktif' : '● Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/admin/santri/${santri.id}/transaksi`)
                          }}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <Wallet size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
