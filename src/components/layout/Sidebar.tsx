import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Data Santri', href: '/admin/santri', icon: <Users size={20} /> },
  { label: 'Pemasukan', href: '/admin/pemasukan', icon: <ArrowDownCircle size={20} /> },
  { label: 'Pengeluaran', href: '/admin/pengeluaran', icon: <ArrowUpCircle size={20} /> },
  { label: 'Laporan', href: '/admin/laporan', icon: <FileText size={20} /> },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-card border-r border-border text-card-foreground">
      <div className="flex items-center gap-3 border-b border-border p-5">
        <Avatar className="h-10 w-10 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
            {user?.name?.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{user?.name || 'Admin Keuangan'}</h2>
          <p className="text-xs text-muted-foreground">{user?.lembagaName || 'PESANTREN AL-IKHLAS'}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <NavLink key={item.href} to={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-1">
        <NavLink to="/admin/pengaturan">
          <Button
            variant={location.pathname === '/admin/pengaturan' ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3',
              location.pathname === '/admin/pengaturan'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Settings size={20} />
            Pengaturan
          </Button>
        </NavLink>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Keluar
        </Button>
      </div>
    </aside>
  )
}
