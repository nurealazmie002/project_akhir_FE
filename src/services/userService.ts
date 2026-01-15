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
    const response = await api.get<PembayaranListResponse>('/user/pembayaran')
    return response.data
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
