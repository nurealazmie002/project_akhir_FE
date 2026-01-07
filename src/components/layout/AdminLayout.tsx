import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AdminLayoutProps {
  title?: string
  subtitle?: string
}

export function AdminLayout({ title = 'Selamat Datang, Admin', subtitle = 'Ringkasan keuangan pesantren hari ini,' }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0d1f12]">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
