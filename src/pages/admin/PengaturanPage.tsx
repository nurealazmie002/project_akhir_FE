import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { fadeInUp } from '@/lib/animations'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { 
  Settings,
  User,
  Building,
  Bell,
  Shield,
  Save,
  Camera,
  Palette,
  Sun,
  Moon
} from 'lucide-react'

export function PengaturanPage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profil' | 'lembaga' | 'tampilan' | 'notifikasi' | 'keamanan'>('profil')

  const [profilData, setProfilData] = useState({
    name: user?.name || 'Admin Keuangan',
    email: user?.email || 'admin@pesantren.id',
    phone: '081234567890',
  })

  const [lembagaData, setLembagaData] = useState({
    name: user?.institutionName || 'Pesantren Al-Ikhlas',
    address: 'Jl. Pesantren No. 123, Kota',
    phone: '021-1234567',
    email: 'info@pesantren-alikhlas.id',
  })

  const [notifikasiSettings, setNotifikasiSettings] = useState({
    emailPembayaran: true,
    emailLaporan: true,
    pushNotifikasi: false,
  })

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Pengaturan berhasil disimpan!')
    }, 1000)
  }

  const tabs = [
    { id: 'profil' as const, label: 'Profil', icon: User },
    { id: 'lembaga' as const, label: 'Lembaga', icon: Building },
    { id: 'tampilan' as const, label: 'Tampilan', icon: Palette },
    { id: 'notifikasi' as const, label: 'Notifikasi', icon: Bell },
    { id: 'keamanan' as const, label: 'Keamanan', icon: Shield },
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
          disabled={isSaving}
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
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-emerald-600 flex items-center justify-center text-foreground text-3xl font-bold">
                      {profilData.name.charAt(0)}
                    </div>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-accent p-0 hover:bg-white/20"
                    >
                      <Camera size={14} className="text-foreground" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{profilData.name}</h3>
                    <p className="text-sm text-muted-foreground">{profilData.email}</p>
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Admin</Badge>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">No. Telepon</label>
                    <Input
                      value={profilData.phone}
                      onChange={(e) => setProfilData({ ...profilData, phone: e.target.value })}
                      className="border-border bg-card text-foreground"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'lembaga' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Nama Lembaga</label>
                  <Input
                    value={lembagaData.name}
                    onChange={(e) => setLembagaData({ ...lembagaData, name: e.target.value })}
                    className="border-border bg-card text-foreground"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                  <Input
                    value={lembagaData.address}
                    onChange={(e) => setLembagaData({ ...lembagaData, address: e.target.value })}
                    className="border-border bg-card text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">No. Telepon</label>
                  <Input
                    value={lembagaData.phone}
                    onChange={(e) => setLembagaData({ ...lembagaData, phone: e.target.value })}
                    className="border-border bg-card text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Lembaga</label>
                  <Input
                    type="email"
                    value={lembagaData.email}
                    onChange={(e) => setLembagaData({ ...lembagaData, email: e.target.value })}
                    className="border-border bg-card text-foreground"
                  />
                </div>
              </div>
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

            {activeTab === 'notifikasi' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <h4 className="font-medium text-foreground">Email Pembayaran</h4>
                    <p className="text-sm text-muted-foreground">Terima notifikasi email saat ada pembayaran masuk</p>
                  </div>
                  <Button
                    variant={notifikasiSettings.emailPembayaran ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNotifikasiSettings({ ...notifikasiSettings, emailPembayaran: !notifikasiSettings.emailPembayaran })}
                    className={notifikasiSettings.emailPembayaran ? 'bg-emerald-600' : 'border-border text-muted-foreground'}
                  >
                    {notifikasiSettings.emailPembayaran ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <h4 className="font-medium text-foreground">Email Laporan</h4>
                    <p className="text-sm text-muted-foreground">Terima laporan bulanan via email</p>
                  </div>
                  <Button
                    variant={notifikasiSettings.emailLaporan ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNotifikasiSettings({ ...notifikasiSettings, emailLaporan: !notifikasiSettings.emailLaporan })}
                    className={notifikasiSettings.emailLaporan ? 'bg-emerald-600' : 'border-border text-muted-foreground'}
                  >
                    {notifikasiSettings.emailLaporan ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <h4 className="font-medium text-foreground">Push Notifikasi</h4>
                    <p className="text-sm text-muted-foreground">Terima push notification di browser</p>
                  </div>
                  <Button
                    variant={notifikasiSettings.pushNotifikasi ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNotifikasiSettings({ ...notifikasiSettings, pushNotifikasi: !notifikasiSettings.pushNotifikasi })}
                    className={notifikasiSettings.pushNotifikasi ? 'bg-emerald-600' : 'border-border text-muted-foreground'}
                  >
                    {notifikasiSettings.pushNotifikasi ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'keamanan' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Ubah Password</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Password Lama</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-border bg-card text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Password Baru</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-border bg-card text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Konfirmasi Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-border bg-card text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-accent" />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Sesi Aktif</h4>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Browser Saat Ini</p>
                        <p className="text-sm text-muted-foreground">Chrome - Windows • Aktif sekarang</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Aktif</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
