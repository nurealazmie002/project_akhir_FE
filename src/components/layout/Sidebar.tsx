import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
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
  { label: 'Pengaturan', href: '/admin/pengaturan', icon: <Settings size={20} /> },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#0a1a0f] text-white">
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <Avatar className="h-10 w-10 bg-emerald-600">
          <AvatarFallback className="bg-emerald-600 text-white text-lg font-bold">A</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">Admin Keuangan</h2>
          <p className="text-xs text-gray-400">PESANTREN AL-IKHLAS</p>
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
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-300 hover:bg-white/5 hover:text-white">
          <LogOut size={20} />
          Keluar
        </Button>
      </div>
    </aside>
  )
}
