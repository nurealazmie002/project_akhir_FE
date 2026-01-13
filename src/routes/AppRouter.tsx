import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout, AuthLayout } from '@/components/layout'
import { 
  DashboardPage, 
  SantriPage, 
  PemasukanPage, 
  PengeluaranPage, 
  LaporanPage, 
  PengaturanPage 
} from '@/pages/admin'
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
          <Route path="pemasukan" element={<PemasukanPage />} />
          <Route path="pengeluaran" element={<PengeluaranPage />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route path="pengaturan" element={<PengaturanPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
