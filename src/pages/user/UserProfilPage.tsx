import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { profileService } from '@/services/profileService'
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
  gender: z.enum(['male', 'female']),
  phone: z.string().optional(),
  address: z.string().min(1, 'Alamat wajib diisi'),
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
  const [profileId, setProfileId] = useState<string | null>(null)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const profilePictureRef = useRef<HTMLInputElement>(null)

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      setProfilePreview(URL.createObjectURL(file))
    }
  }

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      gender: 'male' as const,
      phone: '',
      address: '',
    }
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getMyProfile()
        if (profile) {
          setProfileId(profile.id)
          if (profile.profile_picture_url) {
            setProfilePreview(profile.profile_picture_url)
          }
          profileForm.reset({
            name: profile.name || user?.name || '',
            gender: (profile.gender?.toLowerCase() as 'male' | 'female') || 'male',
            phone: profile.phone || '',
            address: profile.address || '',
          })
        }
      } catch (err) {
        console.log('No existing profile found')
      }
    }
    fetchProfile()
  }, [user])

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      if (profileId) {
        await profileService.update(profileId, {
          name: data.name,
          address: data.address,
          gender: data.gender,
          phone: data.phone || undefined,
        }, profilePicture || undefined)
      } else {
        if (!profilePicture) {
          setError('Foto profil wajib diupload untuk profil baru')
          setIsLoading(false)
          return
        }
        const newProfile = await profileService.create({
          name: data.name,
          address: data.address,
          gender: data.gender,
          phone: data.phone || undefined,
        }, profilePicture)
        setProfileId(newProfile.id)
      }
      setProfilePicture(null) // Reset file after successful upload
      setSuccessMessage('Profil berhasil diperbarui')
    } catch (err: any) {
      console.error('Profile update error:', err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Gagal memperbarui profil'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (_data: PasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      setError('Fitur ubah password belum tersedia')
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

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.name?.charAt(0) || 'U'}
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
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 p-0 hover:bg-emerald-600"
                  >
                    <User size={14} className="text-white" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {profilePicture ? profilePicture.name : (profileId ? 'Klik untuk ubah foto' : 'Foto profil wajib diupload')}
                </p>
              </div>

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
<<<<<<< HEAD
=======
                  <User className="h-4 w-4" /> Jenis Kelamin
                </label>
                <select
                  {...profileForm.register('gender')}
                  className="w-full h-10 px-3 rounded-md border border-border bg-card text-foreground"
                >
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
                {profileForm.formState.errors.gender && (
                  <Badge variant="destructive" className="text-xs">
                    {profileForm.formState.errors.gender.message}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
>>>>>>> eff7022f5172357b0f37fb39bc879750952329a7
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
