import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-z0-9_]+$/, 'Username hanya boleh huruf kecil, angka, dan underscore'),
  email: z.string().email('Email tidak valid'),
  lembagaName: z.string().min(3, 'Nama lembaga minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak sama',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    console.log('Register data:', data)
    setIsLoading(false)
    
    navigate('/login')
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
          <UserPlus className="h-6 w-6 text-emerald-400" />
        </div>
        <CardTitle className="text-2xl text-white">Daftar Admin Lembaga</CardTitle>
        <CardDescription className="text-gray-400">
          Buat akun untuk mengelola keuangan lembaga Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
              <Input
                placeholder="Ahmad Fulan"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                {...register('name')}
              />
              {errors.name && (
                <Badge variant="destructive" className="text-xs">
                  {errors.name.message}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <Input
                placeholder="admin_alikhlas"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                {...register('username')}
              />
              {errors.username && (
                <Badge variant="destructive" className="text-xs">
                  {errors.username.message}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="text-sm font-medium text-gray-300">Nama Lembaga</label>
              <Input
                placeholder="Pesantren Al-Ikhlas"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                {...register('lembagaName')}
              />
              {errors.lembagaName && (
                <Badge variant="destructive" className="text-xs">
                  {errors.lembagaName.message}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Konfirmasi Password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <Badge variant="destructive" className="text-xs">
                  {errors.confirmPassword.message}
                </Badge>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
            Masuk
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
