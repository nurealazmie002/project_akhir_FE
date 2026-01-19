export interface Wali {
  id: string | number
  name: string
  email: string
  phone: string
  address?: string
  occupation?: string
  isActive?: boolean
  createdAt: string
  
  updatedAt?: string
}

export interface CreateWaliRequest {
  name: string
  email: string
  phone: string
  address?: string
  occupation?: string
  password: string
}

export interface UpdateWaliRequest extends Partial<Omit<CreateWaliRequest, 'password'>> {
  isActive?: boolean
  password?: string
}

export interface WaliListResponse {
  data: Wali[]
  total: number
  page: number
  limit: number
}
