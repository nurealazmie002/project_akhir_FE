import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/userService'
import { fadeInUp } from '@/lib/animations'
import { 
  User, 
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  address: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password minimal 6 karakter'),
  newPassword: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Password minimal 6 karakter'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function UserProfilPage() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: '',
      address: '',
    }
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      await userService.updateProfile(data)
      setSuccessMessage('Profil berhasil diperbarui')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setSuccessMessage('Password berhasil diubah')
      passwordForm.reset()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengubah password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-purple-500/20 p-2">
          <User className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profil Saya</h1>
          <p className="text-sm text-muted-foreground">Kelola informasi akun Anda</p>
        </div>
      </div>

      {successMessage && (
        <Badge className="w-full justify-center py-2 bg-emerald-500/20 text-emerald-400">
          {successMessage}
        </Badge>
      )}

      {error && (
        <Badge variant="destructive" className="w-full justify-center py-2">
          {error}
        </Badge>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Info */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> Nama Lengkap
                </label>
                <Input
                  {...profileForm.register('name')}
                />
                {profileForm.formState.errors.name && (
                  <Badge variant="destructive" className="text-xs">
                    {profileForm.formState.errors.name.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Telepon
                </label>
                <Input
                  placeholder="08123456789"
                  {...profileForm.register('phone')}
                />
                {profileForm.formState.errors.phone && (
                  <Badge variant="destructive" className="text-xs">
                    {profileForm.formState.errors.phone.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Alamat
                </label>
                <Input
                  placeholder="Alamat lengkap"
                  {...profileForm.register('address')}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Save size={18} />
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5" /> Ubah Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    {...passwordForm.register('currentPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <Badge variant="destructive" className="text-xs">
                    {passwordForm.formState.errors.currentPassword.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Password Baru
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    {...passwordForm.register('newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <Badge variant="destructive" className="text-xs">
                    {passwordForm.formState.errors.newPassword.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Konfirmasi Password Baru
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <Badge variant="destructive" className="text-xs">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </Badge>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2"
              >
                <Lock size={18} />
                {isLoading ? 'Mengubah...' : 'Ubah Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
