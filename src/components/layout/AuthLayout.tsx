import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-[#0d1f12]">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-900 to-[#0a1a0f] p-12 lg:flex">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Keuangan</h1>
          <p className="text-emerald-400">Pesantren Al-Ikhlas</p>
        </div>
        <div className="space-y-6">
          <blockquote className="text-lg text-white/80">
            "Sistem pengelolaan keuangan pesantren yang terintegrasi untuk memudahkan administrasi dan transparansi."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 font-bold">AI</span>
            </div>
            <div>
              <p className="font-medium text-white">Admin Pesantren</p>
              <p className="text-sm text-gray-400">Kelola dengan mudah</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">© 2024 Pesantren Al-Ikhlas</p>
      </div>
      
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
