import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAuthStore } from '@/stores/authStore'
import { profileService } from '@/services/profileService'

interface AdminLayoutProps {
  title?: string
  subtitle?: string
}

export function AdminLayout({ title = 'Selamat Datang, Admin', subtitle = 'Ringkasan keuangan pesantren hari ini,' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, updateUser, isAuthenticated, _hasHydrated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, _hasHydrated, navigate])

  if (!_hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Memuat sesi...</p>
        </div>
      </div>
    )
  }

  
  useEffect(() => {
    const syncData = async () => {
      try {
        const profile = await profileService.getMyProfile()
        
        const { institutionService } = await import('@/services/institutionService')
        const institution = await institutionService.get().catch(() => null)

        if (profile || institution) {
          updateUser({
            ...(profile?.name ? { name: profile.name } : {}),
            ...(institution?.name ? { institutionName: institution.name } : {})
          })
        }
      } catch (err) {
        
      }
    }
    syncData()
  }, [])

  const displayTitle = title === 'Selamat Datang, Admin' && user?.name 
    ? `Selamat Datang, ${user.name}` 
    : title

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-72 flex flex-col min-h-screen relative">
        <Header 
          title={displayTitle} 
          subtitle={subtitle} 
          onMenuClick={() => setSidebarOpen(true)}
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
