import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { profileService } from '@/services/profileService'
import {
  LayoutDashboard,
  Users,
  Receipt,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/user', icon: <LayoutDashboard size={20} /> },
  { label: 'Data Santri', href: '/user/santri', icon: <Users size={20} /> },
  { label: 'Pembayaran', href: '/user/pembayaran', icon: <Receipt size={20} /> },
  { label: 'Profil', href: '/user/profil', icon: <User size={20} /> },
]

export function UserLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuthStore() // Add updateUser
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  
  // Fetch profile data and sync auth store
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getMyProfile()
        if (profile) {
          if (profile.profile_picture_url) {
            setProfilePicture(profile.profile_picture_url)
          }
          // Sync profile name to auth store
          if (profile.name) {
            updateUser({ name: profile.name })
          }
        }
      } catch (err) {
      }
    }
    fetchProfile()
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
      
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="relative border-b border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-2 ring-emerald-500/30">
                {profilePicture && <AvatarImage src={profilePicture} alt="Profile" />}
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                  {(user?.name || user?.username)?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="font-bold text-white truncate">{user?.name || user?.username || 'User'}</h2>
                <p className="text-xs text-slate-400 truncate">Portal Wali Santri</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 hover:bg-white/10 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Menu</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === '/user' 
                ? location.pathname === '/user'
                : location.pathname.startsWith(item.href)
              
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={handleNavClick}
                >
                  <div
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <div className={cn(
                      "absolute left-0 w-1 h-8 rounded-r-full bg-emerald-500 transition-all duration-200",
                      isActive ? "opacity-100" : "opacity-0"
                    )} />
                    
                    <div className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-white/5 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400'
                    )}>
                      {item.icon}
                    </div>
                    {item.label}
                    
                    <svg 
                      className={cn(
                        "ml-auto w-4 h-4 transition-all duration-200",
                        isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                      )}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </NavLink>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-white/5 p-4">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-all duration-200">
              <LogOut size={20} />
            </div>
            Keluar
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-72 flex flex-col min-h-screen relative">
        <header className="sticky top-0 z-20 border-b border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 hover:bg-emerald-500/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Portal Wali Santri</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Selamat datang, <span className="text-emerald-600 dark:text-emerald-400 font-medium">{user?.name || user?.username || 'User'}</span></p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
