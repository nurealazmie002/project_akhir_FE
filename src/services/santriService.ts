import api from './api'
import type { Santri, CreateSantriRequest, UpdateSantriRequest, SantriListResponse } from '@/types/santri.types'

export const santriService = {
  async getAll(params?: { page?: number; limit?: number; search?: string; institutionId?: string; institutionName?: string }): Promise<SantriListResponse> {
    const response = await api.get<SantriListResponse>('/santri', { params })
    return response.data
  },

  async getById(id: string): Promise<Santri> {
    const response = await api.get<Santri>(`/santri/${id}`)
    return response.data
  },

  async create(data: CreateSantriRequest): Promise<Santri> {
    const response = await api.post<Santri>('/santri', data)
    return response.data
  },

  async update(id: string, data: UpdateSantriRequest): Promise<Santri> {
    const response = await api.patch<Santri>(`/santri/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/santri/${id}`)
  },
}

export default santriService
