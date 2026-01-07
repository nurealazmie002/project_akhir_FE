import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout'
import { DashboardPage } from '@/pages/admin'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="santri" element={<PlaceholderPage title="Data Santri" />} />
          <Route path="pemasukan" element={<PlaceholderPage title="Pemasukan" />} />
          <Route path="pengeluaran" element={<PlaceholderPage title="Pengeluaran" />} />
          <Route path="laporan" element={<PlaceholderPage title="Laporan" />} />
          <Route path="pengaturan" element={<PlaceholderPage title="Pengaturan" />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// Temporary placeholder component
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-gray-400">Halaman ini akan segera hadir</p>
      </div>
    </div>
  )
}
