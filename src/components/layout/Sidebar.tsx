import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Settings,
  LogOut,
  X,
  Building2,
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
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="relative border-b border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white tracking-tight">Pesantren</h1>
                <p className="text-xs text-slate-400">Sistem Keuangan</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 hover:bg-white/10 text-slate-400 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur">
            <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.institutionName || 'Administrator'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Menu Utama</p>
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
                    <span>{item.label}</span>
                    
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

        <div className="border-t border-white/5 p-4 space-y-1">
          <NavLink to="/admin/pengaturan" onClick={handleNavClick}>
            <div
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                location.pathname === '/admin/pengaturan'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                location.pathname === '/admin/pengaturan' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-white/5 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400'
              )}>
                <Settings size={20} />
              </div>
              Pengaturan
            </div>
          </NavLink>
          
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

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
    </>
  )
}
