import api from './api'
import type { 
  Santri, 
  CreateSantriRequest, 
  UpdateSantriRequest, 
  SantriListResponse,
  BackendSantriResponse,
  BackendSingleSantriResponse
} from '@/types/santri.types'

export const santriService = {
  async getAll(params?: { page?: number; limit?: number; search?: string; institutionId?: string; institutionName?: string }): Promise<SantriListResponse> {
    const response = await api.get<BackendSantriResponse>('/santri', { params })
    return response.data.data
  },

  async getById(id: string): Promise<Santri> {
    const response = await api.get<BackendSingleSantriResponse>(`/santri/${id}`)
    return response.data.data
  },

  async getByNis(nis: string): Promise<Santri> {
    const response = await api.get<BackendSingleSantriResponse>(`/santri/nis/${nis}`)
    return response.data.data
  },

  async create(data: CreateSantriRequest): Promise<Santri> {
    const response = await api.post<BackendSingleSantriResponse>('/santri', data)
    return response.data.data
  },

  async update(id: string, data: UpdateSantriRequest): Promise<Santri> {
    const response = await api.patch<BackendSingleSantriResponse>(`/santri/${id}`, data)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/santri/${id}`)
  },
}

export default santriService
