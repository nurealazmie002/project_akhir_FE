export type UserRole = 'SUPER_ADMIN' | 'ADMIN_LEMBAGA' | 'SISWA'

export type AccountStatus = 'ACTIVE' | 'BANNED' | 'SUSPENDED'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: AccountStatus
  lembagaId?: string
  lembagaName?: string
  createdAt: string
  bannedUntil?: string
}

export interface LoginRequest {
  email: string
  password: string
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
