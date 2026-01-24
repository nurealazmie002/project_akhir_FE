export interface Wali {
  id: string | number
  name?: string
  username?: string 
  email: string
  phone?: string
  address?: string
  occupation?: string
  role?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateWaliRequest {
  name?: string
  username?: string
  email: string
  password: string
}

export interface UpdateWaliRequest {
  name?: string
  username?: string
  email?: string
  isActive?: boolean
  password?: string
}

export interface WaliListResponse {
  data: Wali[]
  total: number
  page: number
  limit: number
}
