import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, LogIn } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Mock login - replace with actual API call
    const mockUser = {
      id: '1',
      email: data.email,
      name: 'Admin Lembaga',
      role: 'ADMIN_LEMBAGA' as const,
      status: 'ACTIVE' as const,
      lembagaName: 'Pesantren Al-Ikhlas',
      createdAt: new Date().toISOString(),
    }
    
    login(mockUser, 'mock-jwt-token')
    setIsLoading(false)
    navigate('/admin')
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
          <LogIn className="h-6 w-6 text-emerald-400" />
        </div>
        <CardTitle className="text-2xl text-white">Masuk</CardTitle>
        <CardDescription className="text-gray-400">
          Masuk ke akun Admin Lembaga Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input
              type="email"
              placeholder="admin@pesantren.com"
              className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
              {...register('email')}
            />
            {errors.email && (
              <Badge variant="destructive" className="text-xs">
                {errors.email.message}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
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
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300">
            Daftar sebagai Admin Lembaga
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
