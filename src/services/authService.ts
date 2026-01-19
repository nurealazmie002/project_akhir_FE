import api from './api'
import type { User, LoginRequest, RegisterAdminRequest } from '@/types'

interface AuthResponse {
  user: User
  token: string
}

interface OtpRequest {
  email: string
  otpCode: string
}

interface ResendOtpRequest {
  email: string
}

interface BackendResponse<T> {
  success: boolean
  message: string
  data: T
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<BackendResponse<AuthResponse>>('/auth/login', data)
    return response.data.data
  },

  async register(data: RegisterAdminRequest): Promise<{ message: string }> {
    const response = await api.post<BackendResponse<{ message: string }>>('/auth/register-admin', data)
    return response.data.data
  },

  async verifyOtp(data: OtpRequest): Promise<{ message: string }> {
    const response = await api.post<BackendResponse<{ message: string }>>('/email-verification/verify-otp', data)
    return response.data.data
  },

  async requestOtp(data: ResendOtpRequest): Promise<{ message: string; otp?: string }> {
    const response = await api.post<BackendResponse<{ message: string; otp?: string }>>('/email-verification/request-otp', data)
    return response.data.data
  },

  async resendOtp(data: ResendOtpRequest): Promise<{ message: string; otp?: string }> {
    const response = await api.post<BackendResponse<{ message: string; otp?: string }>>('/email-verification/resend-otp', data)
    return response.data.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<BackendResponse<User>>('/profile')
    return response.data.data
  },
}

export default authService
