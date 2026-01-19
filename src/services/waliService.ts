import api from './api'
import type { Wali, CreateWaliRequest, UpdateWaliRequest, WaliListResponse } from '@/types/wali.types'

export const waliService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<WaliListResponse> {
    const response = await api.get<WaliListResponse>('/wali', { params })
    return response.data
  },

  async getById(id: string): Promise<Wali> {
    const response = await api.get<Wali>(`/wali/${id}`)
    return response.data
  },

  async create(data: CreateWaliRequest): Promise<Wali> {
    const response = await api.post<Wali>('/wali', data)
    return response.data
  },

  async update(id: string, data: UpdateWaliRequest): Promise<Wali> {
    const response = await api.patch<Wali>(`/wali/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/wali/${id}`)
  },
}

export default waliService
