export type UserRole = 'ADMIN' | 'WALI_SANTRI'

export type AccountStatus = 'ACTIVE' | 'BANNED' | 'SUSPENDED'

export interface User {
  id: string 
  email: string
  name?: string
  username?: string
  role: UserRole
  status?: AccountStatus
  institutionId?: string
  institutionName?: string
  lembagaId?: string 
  createdAt?: string
  bannedUntil?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: User
}

export interface RegisterAdminRequest {
  username: string
  email: string
  password: string
  institution: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}
