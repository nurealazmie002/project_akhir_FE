export type TransactionType = 'PEMASUKAN' | 'PENGELUARAN'
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Transaction {
  id: string
  santriId: string
  categoryId: string
  type: TransactionType
  amount: number | string
  description?: string
  transactionDate: string
  createdBy?: string
  approvedBy?: string
  isDeleted?: boolean
  createdAt: string
  updatedAt?: string
  santri?: {
    id: string
    fullname: string
    nis: string
  }
  category?: {
    id: string
    name: string
  }
}

export interface CreateTransactionRequest {
  santriId: string
  categoryId: string
  type: TransactionType
  amount: number
  description?: string
  transactionDate: string
}

export interface UpdateTransactionRequest {
  categoryId?: string
  type?: TransactionType
  amount?: number
  description?: string
  transactionDate?: string
}

export interface TransactionPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface BackendTransactionResponse {
  success: boolean
  message: string
  data: Transaction[]
  pagination: TransactionPagination
}

export interface BackendSingleTransactionResponse {
  success: boolean
  message: string
  data: Transaction
}

export interface TransactionCategory {
  id: string
  name: string
  type: TransactionType
  description?: string
}

export interface BackendCategoryResponse {
  success: boolean
  message: string
  data: {
    data: TransactionCategory[]
    meta?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

