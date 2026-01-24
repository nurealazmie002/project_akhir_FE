import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { userService } from '@/services/userService'
import type { Santri } from '@/types/santri.types'
import { fadeInUp } from '@/lib/animations'
import { 
  GraduationCap, 
  ArrowLeft,
  User,
  Calendar,
  MapPin
} from 'lucide-react'

export function SantriDetailPage() {
  const { nis } = useParams<{ nis: string }>()
  const [santri, setSantri] = useState<Santri | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!nis) return
      setIsLoading(true)
      try {
        const response = await userService.getSantriByNis(nis)
        setSantri(response)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [nis])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    )
  }

  if (error || !santri) {
    return (
      <div className="space-y-4">
        <Link to="/user/santri">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={18} /> Kembali
          </Button>
        </Link>
        <Badge variant="destructive" className="w-full justify-center py-2">
          {error || 'Data tidak ditemukan'}
        </Badge>
      </div>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <Link to="/user/santri">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} /> Kembali ke Daftar Santri
        </Button>
      </Link>


      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{santri.fullname}</h1>
                  <p className="text-muted-foreground">NIS: {santri.nis}</p>
                </div>
                <Badge className={santri.isActive !== false 
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
                }>
                  {santri.isActive !== false ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Informasi Akademik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelas</p>
                <p className="font-medium text-foreground">{santri.kelas}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                <p className="font-medium text-foreground">{santri.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lembaga</p>
                <p className="font-medium text-foreground">{santri.institutionName || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Informasi Wali</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nama Wali</p>
                <p className="font-medium text-foreground">{santri.waliName || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terdaftar Sejak</p>
                <p className="font-medium text-foreground">
                  {new Date(santri.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
