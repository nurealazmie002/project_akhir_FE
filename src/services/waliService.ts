import api from './api'
import type { Wali, CreateWaliRequest, UpdateWaliRequest, WaliListResponse } from '@/types/wali.types'

interface BackendResponse<T> {
  success: boolean
  message: string
  data: T
}

interface BackendListResponse {
  success: boolean
  message: string
  data: Wali[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const waliService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<WaliListResponse> {
    const response = await api.get<BackendListResponse>('/users', { params })
    return {
      data: response.data.data,
      total: response.data.pagination.total,
      page: response.data.pagination.page,
      limit: response.data.pagination.limit,
    }
  },

  async getById(id: string): Promise<Wali> {
    const response = await api.get<BackendResponse<Wali>>(`/users/${id}`)
    return response.data.data
  },

  async create(data: CreateWaliRequest): Promise<Wali> {
    const response = await api.post<BackendResponse<Wali>>('/users', data)
    return response.data.data
  },

  async update(id: string, data: UpdateWaliRequest): Promise<Wali> {
    const response = await api.patch<BackendResponse<Wali>>(`/users/${id}`, data)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}

export default waliService
