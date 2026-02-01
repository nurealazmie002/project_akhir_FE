import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export function SantriDetailPage() {
  const { nis } = useParams<{ nis: string }>()
  const [santri, setSantri] = useState<Santri | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isExpanded, setIsExpanded] = useState(false)

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


      <Card 
        className="border-border bg-card cursor-pointer md:cursor-default transition-colors hover:bg-accent/5 md:hover:bg-card"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="h-16 w-16 md:h-24 md:w-24 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 md:h-12 md:w-12 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-foreground truncate max-w-[200px] md:max-w-none">{santri.fullname}</h1>
                  
                  <div className={`mt-1 md:block ${isExpanded ? 'block' : 'hidden'}`}>
                    <p className="text-muted-foreground text-sm md:text-base">NIS: {santri.nis}</p>
                    <div className="mt-2 md:mt-0 md:absolute md:top-6 md:right-6">
                       <Badge className={santri.isActive !== false 
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-red-500/20 text-red-400'
                      }>
                        {santri.isActive !== false ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </div>

                  {!isExpanded && (
                     <p className="text-xs text-primary mt-1 md:hidden">Ketuk untuk lihat detail</p>
                  )}
                </div>
                
                <div className="md:hidden text-muted-foreground">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {(isExpanded || window.innerWidth >= 768) && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden mt-4 pt-4 border-t border-border overflow-hidden"
              >
                  <p className="text-sm font-medium text-foreground mb-2">Status Santri</p>
                  <Badge className={santri.isActive !== false 
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-red-500/20 text-red-400'
                  }>
                    {santri.isActive !== false ? 'Aktif' : 'Nonaktif'}
                  </Badge>
              </motion.div>
            )}
          </AnimatePresence>
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
              <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-sky-400" />
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
