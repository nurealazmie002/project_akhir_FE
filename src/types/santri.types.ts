export interface Santri {
  id: string | number
  fullname: string
  nis: string
  kelas: string
  gender: 'Laki-laki' | 'Perempuan'
  institutionId?: string
  institutionName?: string
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
  institutionName: string
  waliName: string
}

export interface UpdateSantriRequest extends Partial<CreateSantriRequest> {
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
  isActive?: boolean
}

export interface SantriListResponse {
  data: Santri[]
  total: number
  page: number
  limit: number
}
