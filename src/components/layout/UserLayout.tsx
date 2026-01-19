import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
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
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-gradient-to-b from-card via-card to-card/95 border-r border-border/50 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="relative border-b border-border/50 p-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground truncate">{user?.name || 'User'}</h2>
                <p className="text-xs text-muted-foreground truncate">Portal Wali Santri</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</p>
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
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <div className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                      isActive 
                        ? 'bg-primary-foreground/20' 
                        : 'bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary'
                    )}>
                      {item.icon}
                    </div>
                    {item.label}
                  </div>
                </NavLink>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-border/50 p-4">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50 group-hover:bg-destructive/20 transition-all duration-200">
              <LogOut size={20} />
            </div>
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 hover:bg-primary/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Portal Wali Santri</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Selamat datang, <span className="text-primary font-medium">{user?.name || 'User'}</span></p>
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
