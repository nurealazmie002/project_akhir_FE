export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE' | 'UNPAID'

export interface InvoiceItem {
  id: string
  description: string
  amount: number | string
  quantity: number | string
}

export interface Invoice {
  id: string
  invoiceNumber?: string
  santriId: string
  santri?: {
    id: string
    fullname: string
    nis: string
  }
  items?: InvoiceItem[]
  totalAmount: number | string
  paidAmount?: number | string
  status: InvoiceStatus
  dueDate: string
  paidAt?: string
  notes?: string
  description?: string
  categoryId?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateInvoiceRequest {
  santriId: string
  items: Omit<InvoiceItem, 'id'>[]
  dueDate: string
  notes?: string
}

export interface UpdateInvoiceRequest {
  items?: Omit<InvoiceItem, 'id'>[]
  dueDate?: string
  notes?: string
  status?: InvoiceStatus
}

export interface Receipt {
  id: string
  receiptNumber: string
  transactionId?: string
  invoiceId?: string
  santriName: string
  santriNis: string
  institutionName: string
  items: {
    description: string
    amount: number
  }[]
  totalAmount: number
  paymentMethod?: string
  paidAt: string
  createdAt: string
}

export interface BackendInvoiceResponse {
  success: boolean
  message: string
  data: Invoice[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface BackendSingleInvoiceResponse {
  success: boolean
  message: string
  data: Invoice
}
