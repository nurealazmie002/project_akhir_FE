import api from './api'
import type { User, LoginRequest, RegisterAdminRequest } from '@/types'

interface AuthResponse {
  user: User
  token: string
  message?: string
}

interface OtpRequest {
  email: string
  otpCode: string
}

interface ResendOtpRequest {
  email: string
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  async register(data: RegisterAdminRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/register-admin', data)
    return response.data
  },

  async verifyOtp(data: OtpRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/email-verification/verify-otp', data)
    return response.data
  },

  async requestOtp(data: ResendOtpRequest): Promise<{ message: string; otp?: string }> {
    const response = await api.post<{ message: string; otp?: string }>('/email-verification/request-otp', data)
    return response.data
  },

  async resendOtp(data: ResendOtpRequest): Promise<{ message: string; otp?: string }> {
    const response = await api.post<{ message: string; otp?: string }>('/email-verification/resend-otp', data)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/profile')
    return response.data
  },
}

export default authService
