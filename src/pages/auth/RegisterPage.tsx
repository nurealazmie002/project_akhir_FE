import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { authService } from '@/services/authService'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-z0-9_]+$/, 'Username hanya boleh huruf kecil, angka, dan underscore'),
  email: z.string().email('Email tidak valid'),
  institution: z.string().min(3, 'Nama lembaga minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const registerResponse = await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
        institution: data.institution,
      })
      console.log('✅ Register berhasil:', registerResponse)
      console.log('📧 OTP (jika ada):', registerResponse)
      
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="space-y-1 text-center">
          <motion.div 
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <UserPlus className="h-6 w-6 text-emerald-400" />
          </motion.div>
          <CardTitle className="text-2xl text-white">Daftar Admin Lembaga</CardTitle>
          <CardDescription className="text-gray-400">
            Buat akun untuk mengelola keuangan lembaga Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                key={error}
              >
                <Badge variant="destructive" className="w-full justify-center py-2">
                  {error}
                </Badge>
              </motion.div>
            )}

            <motion.div variants={staggerItem} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <Input
                placeholder="admin_alikhlas"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                {...register('username')}
              />
              {errors.username && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Badge variant="destructive" className="text-xs">
                    {errors.username.message}
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                placeholder="admin@pesantren.com"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                {...register('email')}
              />
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Badge variant="destructive" className="text-xs">
                    {errors.email.message}
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nama Lembaga</label>
              <Input
                placeholder="Pesantren Al-Ikhlas"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                {...register('institution')}
              />
              {errors.institution && (
                <Badge variant="destructive" className="text-xs">
                  {errors.institution.message}
                </Badge>
              )}
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="border-white/10 bg-white/5 pr-10 text-white placeholder:text-gray-500"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <Badge variant="destructive" className="text-xs">
                  {errors.password.message}
                </Badge>
              )}
            </motion.div>

            <motion.div variants={staggerItem}>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Daftar'}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div 
            className="mt-6 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sudah punya akun?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
              Masuk
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
