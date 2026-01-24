export interface Santri {
  id: string | number
  fullname: string
  nis: string
  kelas: string
  gender: 'Laki-laki' | 'Perempuan'
  institutionId?: number | string
  institutionName?: string
  waliId?: number | string
  waliName: string
  isActive?: boolean
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
  createdAt: string
  updatedAt?: string
}

export interface CreateSantriRequest {
  fullname: string
  nis: string
  kelas: string
  gender: 'Laki-laki' | 'Perempuan'
  waliName: string
}

export interface UpdateSantriRequest extends Partial<CreateSantriRequest> {
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
  isActive?: boolean
}

export interface SantriListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface SantriListResponse {
  data: Santri[]
  meta: SantriListMeta
}

export interface BackendSantriResponse {
  success: boolean
  message: string
  data: SantriListResponse
}

export interface BackendSingleSantriResponse {
  success: boolean
  message: string
  data: Santri
}
