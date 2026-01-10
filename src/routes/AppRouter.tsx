import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout, AuthLayout } from '@/components/layout'
import { DashboardPage, SantriPage } from '@/pages/admin'
import { LoginPage, RegisterPage, OtpVerificationPage } from '@/pages/auth'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="santri" element={<SantriPage />} />
          <Route path="pemasukan" element={<PlaceholderPage title="Pemasukan" />} />
          <Route path="pengeluaran" element={<PlaceholderPage title="Pengeluaran" />} />
          <Route path="laporan" element={<PlaceholderPage title="Laporan" />} />
          <Route path="pengaturan" element={<PlaceholderPage title="Pengaturan" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

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
