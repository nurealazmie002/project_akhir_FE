import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout, AuthLayout, UserLayout } from '@/components/layout'
import { 
  DashboardPage, 
  SantriPage,
  SantriTransaksiPage,
  WaliPage,
  InvoicePage,
  PengaturanPage
} from '@/pages/admin'
import { 
  UserDashboardPage,
  SantriListPage,
  SantriDetailPage,
  PembayaranPage as UserPembayaranPage,
  UserProfilPage
} from '@/pages/user'
import { LoginPage, RegisterPage, OtpVerificationPage } from '@/pages/auth'
import { PaymentResultPage } from '@/pages/payment'
import { LandingPage } from '@/pages/LandingPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />


        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
        </Route>

        <Route path="/payment/success" element={<PaymentResultPage status="success" />} />
        <Route path="/payment/failed" element={<PaymentResultPage status="failed" />} />
        <Route path="/payment/pending" element={<PaymentResultPage status="pending" />} />


        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="santri" element={<SantriPage />} />
          <Route path="wali" element={<WaliPage />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="pengaturan" element={<PengaturanPage />} />
        </Route>


        <Route path="/admin/santri/:santriId/transaksi" element={<SantriTransaksiPage />} />


        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboardPage />} />
          <Route path="santri" element={<SantriListPage />} />
          <Route path="santri/:nis" element={<SantriDetailPage />} />
          <Route path="pembayaran" element={<UserPembayaranPage />} />
          <Route path="profil" element={<UserProfilPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
