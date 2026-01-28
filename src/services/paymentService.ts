import api from './api'

export interface CreatePaymentRequest {
  invoiceId: string
  amount: number
}

export interface PaymentResponse {
  success: boolean
  message: string
  data: {
    orderId: string
    snapToken: string
    redirectUrl?: string
  }
}

export interface PaymentStatus {
  orderId: string
  status: 'pending' | 'success' | 'failed' | 'expired'
  transactionId?: string
  paymentType?: string
  paidAt?: string
}

export interface PaymentStatusResponse {
  success: boolean
  message: string
  data: PaymentStatus
}

export const paymentService = {
  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse['data']> {
    const response = await api.post<PaymentResponse>('/payment', data)
    return response.data.data
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    const response = await api.get<PaymentStatusResponse>(`/payment/status/${orderId}`)
    return response.data.data
  },

  openSnapPayment(snapToken: string, callbacks?: {
    onSuccess?: (result: any) => void
    onPending?: (result: any) => void
    onError?: (result: any) => void
    onClose?: () => void
  }) {
    if (typeof window !== 'undefined' && (window as any).snap) {
      (window as any).snap.pay(snapToken, {
        onSuccess: callbacks?.onSuccess || ((result: any) => {
          console.log('Payment success:', result)
        }),
        onPending: callbacks?.onPending || ((result: any) => {
          console.log('Payment pending:', result)
        }),
        onError: callbacks?.onError || ((result: any) => {
          console.error('Payment error:', result)
        }),
        onClose: callbacks?.onClose || (() => {
          console.log('Payment popup closed')
        })
      })
    } else {
      console.error('Midtrans Snap not loaded')
      if (callbacks?.onError) {
        callbacks.onError('Midtrans Snap SDK not loaded')
      }
      if (callbacks?.onClose) {
        callbacks.onClose()
      }
    }
  }
}

export default paymentService
