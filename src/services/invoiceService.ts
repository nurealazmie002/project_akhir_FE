import api from './api'
import type { 
  Invoice,
  CreateInvoiceRequest,
  BackendInvoiceResponse,
  BackendSingleInvoiceResponse,
  Receipt
} from '@/types/invoice.types'
import type { Transaction } from '@/types/transaction.types'

export const invoiceService = {
  async getAll(): Promise<{ data: Invoice[] }> {
    try {
      const response = await api.get<BackendInvoiceResponse>('/invoice')
      return {
        data: response.data.data || []
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { data: [] }
      }
      throw error
    }
  },

  async getById(id: string): Promise<Invoice> {
    const response = await api.get<BackendSingleInvoiceResponse>(`/invoice/${id}`)
    return response.data.data
  },

  async create(data: CreateInvoiceRequest): Promise<Invoice> {
    const response = await api.post<BackendSingleInvoiceResponse>('/invoice', data)
    return response.data.data
  },

  generateReceiptFromTransaction(transaction: Transaction, institutionName: string = 'Pondok Pesantren'): Receipt {
    const now = new Date()
    const receiptNumber = `RCP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${transaction.id.slice(-6).toUpperCase()}`
    
    return {
      id: `receipt-${transaction.id}`,
      receiptNumber,
      transactionId: transaction.id,
      santriName: transaction.santri?.fullname || 'Unknown',
      santriNis: transaction.santri?.nis || '-',
      institutionName,
      items: [{
        description: transaction.category?.name || transaction.description || transaction.type,
        amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount
      }],
      totalAmount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount,
      paidAt: transaction.transactionDate,
      createdAt: transaction.createdAt
    }
  },

  generateReceiptFromInvoice(invoice: Invoice, institutionName: string = 'Pondok Pesantren'): Receipt {
    const now = new Date()
    const receiptNumber = `RCP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${invoice.id.slice(-6).toUpperCase()}`
    
    return {
      id: `receipt-${invoice.id}`,
      receiptNumber,
      invoiceId: invoice.id,
      santriName: invoice.santri?.fullname || 'Unknown',
      santriNis: invoice.santri?.nis || '-',
      institutionName,
      items: invoice.items.map(item => ({
        description: item.description,
        amount: item.amount * item.quantity
      })),
      totalAmount: invoice.totalAmount,
      paidAt: invoice.paidAt || new Date().toISOString(),
      createdAt: invoice.createdAt
    }
  }
}

export default invoiceService
