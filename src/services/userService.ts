import api from './api'
import type { Santri } from '@/types/santri.types'

export interface SantriListResponse {
  data: Santri[]
  total: number
}

export interface PembayaranItem {
  id: string | number
  tanggal: string
  jenis: string
  jumlah: number
  status: 'LUNAS' | 'PENDING' | 'GAGAL'
  santriNis: string
  santriName: string
}

export interface PembayaranListResponse {
  data: PembayaranItem[]
  total: number
}

export const userService = {
  async getProfile(): Promise<any> {
    const response = await api.get('/user/me')
    return response.data
  },

  async getSantri(): Promise<SantriListResponse> {
    const response = await api.get<SantriListResponse>('/user/santri')
    return response.data
  },

  async getSantriByNis(nis: string): Promise<Santri> {
    const response = await api.get<Santri>(`/user/santri/${nis}`)
    return response.data
  },

  async getPembayaran(): Promise<PembayaranListResponse> {
    try {
      // Fetch invoices for the current user's santri
      const response = await api.get('/invoice')
      const invoices = response.data.data || []
      
      // Map invoices to PembayaranItem format
      const pembayaranItems: PembayaranItem[] = invoices.map((inv: any) => ({
        id: inv.id,
        tanggal: new Date(inv.dueDate || inv.createdAt).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        jenis: inv.description || inv.items?.[0]?.description || 'Tagihan',
        jumlah: typeof inv.totalAmount === 'string' ? parseFloat(inv.totalAmount) : inv.totalAmount,
        status: inv.status === 'PAID' ? 'LUNAS' : inv.status === 'PENDING' || inv.status === 'UNPAID' ? 'PENDING' : 'GAGAL',
        santriNis: inv.santri?.nis || '-',
        santriName: inv.santri?.fullname || '-'
      }))
      
      return { data: pembayaranItems, total: pembayaranItems.length }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { data: [], total: 0 }
      }
      throw error
    }
  },

  async updateProfile(data: { name?: string; phone?: string; address?: string }): Promise<any> {
    const response = await api.patch('/user/me', data)
    return response.data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<any> {
    const response = await api.patch('/user/password', data)
    return response.data
  },
}

export default userService
