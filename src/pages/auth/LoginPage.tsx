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
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { Eye, EyeOff, LogIn } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    console.log('📤 Memulai login untuk:', data.email)
    try {
      const response = await authService.login(data)
      console.log('✅ Login berhasil')

      if (!response || !response.user) {
        throw new Error('Data user tidak ditemukan dalam respons')
      }

      login(response.user, response.token)

      // Redirect based on role
      const role = response.user.role
      if (role === 'ADMIN') {
        navigate('/admin')
      } else if (role === 'WALI_SANTRI') {
        navigate('/user')
      } else {
        navigate('/admin') // fallback
      }
    } catch (err: any) {
      console.error('❌ Login gagal:', err.response?.data || err.message)
      const message = err.response?.data?.message || err.message || 'Login gagal. Silakan coba lagi.'
      setError(message)
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
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <motion.div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <LogIn className="h-6 w-6 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl text-foreground">Masuk</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masuk ke akun Admin Lembaga Anda
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
                className="space-y-2"
              >
                <Badge variant="destructive" className="w-full justify-center py-2">
                  {error}
                </Badge>
                {error.includes('Email not verified') && (
                  <Button
                    variant="link"
                    className="w-full text-primary hover:text-primary/80 h-auto p-0"
                    onClick={() => navigate('/verify-otp', { state: { email: getValues('email'), from: 'login' } })}
                  >
                    Verifikasi sekarang
                  </Button>
                )}
              </motion.div>
            )}

            <motion.div variants={staggerItem} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="admin@pesantren.com"
                {...register('email')}
              />
              {errors.email && (
                <Badge variant="destructive" className="text-xs">
                  {errors.email.message}
                </Badge>
              )}
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            className="mt-6 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Daftar sebagai Admin Lembaga
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
