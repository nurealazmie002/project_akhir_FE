import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Data Santri', href: '/admin/santri', icon: <Users size={20} /> },
  { label: 'Data Wali', href: '/admin/wali', icon: <UserCheck size={20} /> },
  { label: 'Pemasukan', href: '/admin/pemasukan', icon: <ArrowDownCircle size={20} /> },
  { label: 'Pengeluaran', href: '/admin/pengeluaran', icon: <ArrowUpCircle size={20} /> },
  { label: 'Laporan', href: '/admin/laporan', icon: <FileText size={20} /> },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <>
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-gradient-to-b from-card via-card to-card/95 border-r border-border/50 text-card-foreground transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header with gradient background */}
        <div className="relative border-b border-border/50 p-5 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground truncate">{user?.name || 'Admin Keuangan'}</h2>
                <p className="text-xs text-muted-foreground truncate">{user?.institutionName || 'Pesantren Al-Ikhlas'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu Utama</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
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

        {/* Footer */}
        <div className="border-t border-border/50 p-4 space-y-1">
          <NavLink to="/admin/pengaturan" onClick={handleNavClick}>
            <div
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                location.pathname === '/admin/pengaturan'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                location.pathname === '/admin/pengaturan' 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary'
              )}>
                <Settings size={20} />
              </div>
              Pengaturan
            </div>
          </NavLink>
          
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
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
    </>
  )
}
