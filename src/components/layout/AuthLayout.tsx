import { Outlet } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-muted to-background p-12 lg:flex">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Keuangan</h1>
          <p className="text-primary">Pesantren Al-Ikhlas</p>
        </div>
        <div className="space-y-6">
          <blockquote className="text-lg text-muted-foreground">
            "Sistem pengelolaan keuangan pesantren yang terintegrasi untuk memudahkan administrasi dan transparansi."
          </blockquote>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 bg-primary/20">
              <AvatarFallback className="bg-primary/20">
                <User className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">Admin Pesantren</p>
              <p className="text-sm text-muted-foreground">Kelola dengan mudah</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">© 2024 Pesantren Al-Ikhlas</p>
      </div>
      
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
