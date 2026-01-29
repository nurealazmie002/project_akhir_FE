import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { fadeInUp } from '@/lib/animations'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { profileService } from '@/services/profileService'
import { institutionService, type InstitutionProfile } from '@/services/institutionService'
import { 
  Settings,
  User,
  Building,
  Save,
  Camera,
  Palette,
  Sun,
  Moon,
  Upload
} from 'lucide-react'

export function PengaturanPage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'profil' | 'lembaga' | 'tampilan'>('profil')
  
  const profilePictureRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [profileId, setProfileId] = useState<string | null>(null)
  const [profilData, setProfilData] = useState({
    name: user?.name || '',
    gender: 'male',
    address: '',
    occupation: '',
    phone: '',
    profile_picture_url: '',
  })

  const [lembagaData, setLembagaData] = useState<InstitutionProfile>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    logoUrl: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const profile = await profileService.getMyProfile()
        if (profile) {
          setProfileId(profile.id)
          setProfilData({
            name: profile.name || user?.name || '',
            gender: profile.gender?.toLowerCase() || 'male',
            address: profile.address || '',
            occupation: profile.occupation || '',
            phone: profile.phone || '',
            profile_picture_url: profile.profile_picture_url || '',
          })
          if (profile.profile_picture_url) {
            setProfilePreview(profile.profile_picture_url)
          }
        }

        const institution = await institutionService.get().catch(() => null)
        if (institution) {
          setLembagaData(institution)
          if (institution.logoUrl) {
            setLogoPreview(institution.logoUrl)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      setProfilePreview(URL.createObjectURL(file))
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      if (profileId) {
        await profileService.update(profileId, {
          name: profilData.name,
          address: profilData.address,
          gender: profilData.gender || undefined,
          occupation: profilData.occupation || undefined,
          phone: profilData.phone || undefined,
        }, profilePicture || undefined)
      } else {
        const newProfile = await profileService.create({
          name: profilData.name,
          address: profilData.address,
          gender: profilData.gender || undefined,
          occupation: profilData.occupation || undefined,
          phone: profilData.phone || undefined,
        }, profilePicture || undefined)
        setProfileId(newProfile.id)
      }
      setMessage({ type: 'success', text: 'Profil berhasil disimpan!' })
      setProfilePicture(null)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal menyimpan profil' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveLembaga = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      if (lembagaData.id) {
        await institutionService.update({
          name: lembagaData.name,
          address: lembagaData.address,
          phone: lembagaData.phone,
          email: lembagaData.email,
          website: lembagaData.website,
          description: lembagaData.description,
        }, logoFile || undefined)
      } else {
        await institutionService.create({
          name: lembagaData.name || 'Pesantren',
          address: lembagaData.address,
          phone: lembagaData.phone,
          email: lembagaData.email,
          website: lembagaData.website,
          description: lembagaData.description,
        }, logoFile || undefined)
      }
      setMessage({ type: 'success', text: 'Data lembaga berhasil disimpan!' })
      setLogoFile(null)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal menyimpan data lembaga' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = () => {
    if (activeTab === 'profil') {
      handleSaveProfile()
    } else if (activeTab === 'lembaga') {
      handleSaveLembaga()
    } else {
      setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' })
    }
  }

  const tabs = [
    { id: 'profil' as const, label: 'Profil', icon: User },
    { id: 'lembaga' as const, label: 'Lembaga', icon: Building },
    { id: 'tampilan' as const, label: 'Tampilan', icon: Palette },
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
          <div className="rounded-lg bg-purple-500/20 p-2">
            <Settings className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
            <p className="text-sm text-muted-foreground">
              Kelola pengaturan akun dan lembaga
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-border bg-card md:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-3 ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </Button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        <Card className="border-border bg-card md:col-span-3">
          <CardHeader>
            <CardTitle className="text-foreground">
              {tabs.find(t => t.id === activeTab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeTab === 'profil' && (
              <>
                {message && (
                  <Badge className={`w-full justify-center py-2 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.text}
                  </Badge>
                )}
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profilePreview ? (
                      <img 
                        src={profilePreview} 
                        alt="Profile" 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-emerald-600 flex items-center justify-center text-foreground text-3xl font-bold">
                        {profilData.name.charAt(0) || 'A'}
                      </div>
                    )}
                    <input
                      type="file"
                      ref={profilePictureRef}
                      onChange={handleProfilePictureChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => profilePictureRef.current?.click()}
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-accent p-0 hover:bg-white/20"
                    >
                      <Camera size={14} className="text-foreground" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{profilData.name || user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">{user?.role || 'Admin'}</Badge>
                  </div>
                </div>

                <Separator className="bg-accent" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                    <Input
                      value={profilData.name}
                      onChange={(e) => setProfilData({ ...profilData, name: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
<<<<<<< HEAD
=======
                    <label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</label>
                    <select
                      value={profilData.gender}
                      onChange={(e) => setProfilData({ ...profilData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                      className="w-full h-10 px-3 rounded-md border border-border bg-card text-foreground"
                    >
                      <option value="MALE">Laki-laki</option>
                      <option value="FEMALE">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="border-border bg-card text-foreground opacity-60"
                    />
                    <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                  </div>
                  <div className="space-y-2">
>>>>>>> eff7022f5172357b0f37fb39bc879750952329a7
                    <label className="text-sm font-medium text-muted-foreground">No. Telepon</label>
                    <Input
                      value={profilData.phone}
                      onChange={(e) => setProfilData({ ...profilData, phone: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="08123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Alamat <span className="text-red-400">*</span></label>
                    <Input
                      value={profilData.address}
                      onChange={(e) => setProfilData({ ...profilData, address: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="Alamat lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Pekerjaan</label>
                    <Input
                      value={profilData.occupation}
                      onChange={(e) => setProfilData({ ...profilData, occupation: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="Pekerjaan/jabatan"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'lembaga' && (
              <>
                {message && (
                  <Badge className={`w-full justify-center py-2 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.text}
                  </Badge>
                )}
                
                {/* Logo Upload */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="relative">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo" 
                        className="h-20 w-20 rounded-xl object-cover border border-border"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                        <Building size={32} />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={logoRef}
                      onChange={handleLogoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => logoRef.current?.click()}
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-accent p-0 hover:bg-white/20"
                    >
                      <Upload size={14} className="text-foreground" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{lembagaData.name || 'Nama Lembaga'}</h3>
                    <p className="text-sm text-muted-foreground">Logo Lembaga</p>
                  </div>
                </div>

                <Separator className="bg-accent" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Nama Lembaga</label>
                    <Input
                      value={lembagaData.name}
                      onChange={(e) => setLembagaData({ ...lembagaData, name: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="Nama pesantren/lembaga"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                    <Input
                      value={lembagaData.address || ''}
                      onChange={(e) => setLembagaData({ ...lembagaData, address: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="Alamat lengkap lembaga"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">No. Telepon</label>
                    <Input
                      value={lembagaData.phone || ''}
                      onChange={(e) => setLembagaData({ ...lembagaData, phone: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="021-1234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Lembaga</label>
                    <Input
                      type="email"
                      value={lembagaData.email || ''}
                      onChange={(e) => setLembagaData({ ...lembagaData, email: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="info@pesantren.id"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <Input
                      value={lembagaData.website || ''}
                      onChange={(e) => setLembagaData({ ...lembagaData, website: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="https://pesantren.id"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Deskripsi</label>
                    <Input
                      value={lembagaData.description || ''}
                      onChange={(e) => setLembagaData({ ...lembagaData, description: e.target.value })}
                      className="border-border bg-card text-foreground"
                      placeholder="Deskripsi singkat lembaga"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'tampilan' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Pilih Tema</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/20'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <Moon className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">Gelap</p>
                          <p className="text-xs text-muted-foreground">Tema hitam shadcn</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-primary/20'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center">
                          <Sun className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">Terang</p>
                          <p className="text-xs text-muted-foreground">Tema putih shadcn</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">
                    Tema akan otomatis tersimpan dan diterapkan ke seluruh halaman.
                  </p>
                </div>
              </div>
            )}


          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
