import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { userService } from '@/services/userService'
import type { Santri } from '@/types/santri.types'
import { fadeInUp } from '@/lib/animations'
import { 
  Users, 
  GraduationCap, 
  Search,
  ChevronRight
} from 'lucide-react'

export function SantriListPage() {
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await userService.getSantri()
        setSantriList(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredSantri = santriList.filter(
    (santri) =>
      santri.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      santri.nis?.includes(searchQuery) ||
      santri.kelas?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/20 p-2">
          <Users className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Santri</h1>
          <p className="text-sm text-muted-foreground">Daftar santri yang terdaftar</p>
        </div>
      </div>

      {error && (
        <Badge variant="destructive" className="w-full justify-center py-2">
          {error}
        </Badge>
      )}

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, NIS, atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Daftar Santri ({filteredSantri.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Memuat data...</p>
          ) : filteredSantri.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery ? 'Tidak ada hasil ditemukan' : 'Belum ada data santri'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredSantri.map((santri) => (
                <Link
                  key={santri.id}
                  to={`/user/santri/${santri.nis}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{santri.fullname}</p>
                      <p className="text-sm text-muted-foreground">
                        NIS: {santri.nis} • Kelas: {santri.kelas} • {santri.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={santri.isActive !== false 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                    }>
                      {santri.isActive !== false ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
