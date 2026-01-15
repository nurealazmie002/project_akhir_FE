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
import { useState } from 'react'

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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-card border-r border-border transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 border-b border-border p-5">
          <Avatar className="h-10 w-10 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">{user?.name || 'User'}</h2>
            <p className="text-xs text-muted-foreground">Portal Wali Santri</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = item.href === '/user' 
              ? location.pathname === '/user'
              : location.pathname.startsWith(item.href)
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut size={20} />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
