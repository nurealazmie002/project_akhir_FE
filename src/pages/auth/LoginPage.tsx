import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { fadeInUp, staggerItem } from '@/lib/animations'
import { Eye, EyeOff, LogIn, CheckCircle2, XCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
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
    setIsError(false)

    console.log('Memulai login untuk:', data.email)
    try {
      const [response] = await Promise.all([
        authService.login(data),
        new Promise(resolve => setTimeout(resolve, 2000))
      ])
      
      console.log('Login berhasil')

      if (!response || !response.user) {
        throw new Error('Data user tidak ditemukan dalam respons')
      }

      login(response.user, response.token)

      setIsSuccess(true)
      setIsLoading(false)

      let destination = '/admin'
      const role = response.user.role
      if (role === 'WALI_SANTRI') {
        destination = '/user/santri'
      }

      setTimeout(() => {
        navigate(destination)
      }, 1500)

    } catch (err: any) {
      console.error(' Login gagal:', err.response?.data || err.message)      
      setIsLoading(false)
      setIsError(true)
      
      const errorMessage = err.response?.data?.message || err.message || 'Email atau password salah'
      setError(errorMessage)
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={isLoading ? { 
          scale: [1, 1.02, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : { scale: 1 }}
      >
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="space-y-1 text-center">
          <motion.div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {isSuccess ? (
               <motion.div
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
               >
                 <CheckCircle2 className="h-8 w-8 text-emerald-500" />
               </motion.div>
            ) : isError ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <XCircle className="h-8 w-8 text-destructive" />
                </motion.div>
            ) : (
                <LogIn className="h-6 w-6 text-primary" />
            )}
          </motion.div>
          <CardTitle className="text-2xl text-foreground">
             {isSuccess ? 'Login Berhasil!' : isError ? 'Login Gagal' : 'Masuk'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSuccess ? 'Mengalihkan ke dashboard...' : isError ? 'Silakan coba lagi beberapa saat' : 'Masuk ke akun Admin Lembaga Anda'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </motion.div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    Berhasil masuk, mohon tunggu...
                  </p>
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <XCircle className="h-10 w-10 text-destructive" />
                  </motion.div>
                  <p className="text-sm text-destructive font-medium mb-4">
                    Email atau password salah
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-destructive/50 hover:bg-destructive/10 text-destructive"
                    onClick={() => setIsError(false)}
                  >
                    Coba Lagi
                  </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0 },
                  animate: { 
                    opacity: 1, 
                    transition: { staggerChildren: 0.1 } 
                  },
                  exit: { opacity: 0 }
                }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
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
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input
                      type="email"
                      placeholder="admin@pesantren.com"
                      {...register('email')}
                    />
                  )}
                  {errors.email && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.email.message}
                    </Badge>
                  )}
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  {isLoading ? (
                     <Skeleton className="h-10 w-full" />
                  ) : (
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
                  )}
                  {errors.password && (
                    <Badge variant="destructive" className="text-xs">
                      {errors.password.message}
                    </Badge>
                  )}
                </motion.div>

                <motion.div variants={staggerItem}>
                  {isLoading ? (
                     <Skeleton className="h-10 w-full" />
                  ) : (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      Masuk
                    </Button>
                  )}
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  )
}
