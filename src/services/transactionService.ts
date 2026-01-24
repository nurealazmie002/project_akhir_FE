import api from './api'
import type { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  BackendTransactionResponse,
  BackendSingleTransactionResponse,
  TransactionType,
  TransactionPagination,
  TransactionCategory,
  BackendCategoryResponse
} from '@/types/transaction.types'

export interface GetTransactionsParams {
  page?: number
  limit?: number
  type?: TransactionType
  santriId?: string
  categoryId?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface TransactionListResult {
  data: Transaction[]
  pagination: TransactionPagination
}

export const transactionService = {
  async getAll(params?: GetTransactionsParams): Promise<TransactionListResult> {
    const response = await api.get<BackendTransactionResponse>('/transaction', { params })
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  },

  async getById(id: string): Promise<Transaction> {
    const response = await api.get<BackendSingleTransactionResponse>(`/transaction/${id}`)
    return response.data.data
  },

  async getBySantriId(santriId: string, params?: Omit<GetTransactionsParams, 'santriId'>): Promise<TransactionListResult> {
    return this.getAll({ ...params, santriId })
  },

  async create(data: CreateTransactionRequest): Promise<Transaction> {
    const response = await api.post<BackendSingleTransactionResponse>('/transaction', data)
    return response.data.data
  },

  async update(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
    const response = await api.put<BackendSingleTransactionResponse>(`/transaction/${id}`, data)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transaction/${id}`)
  },

  async getIncome(params?: Omit<GetTransactionsParams, 'type'>): Promise<TransactionListResult> {
    const response = await this.getAll({ ...params, type: 'PEMASUKAN' })
    return response
  },

  async getExpense(params?: Omit<GetTransactionsParams, 'type'>): Promise<TransactionListResult> {
    const response = await this.getAll({ ...params, type: 'PENGELUARAN' })
    return response
  },

  async getCategories(type?: TransactionType, institutionId?: string): Promise<TransactionCategory[]> {
    const response = await api.get<BackendCategoryResponse>('/category', { 
      params: { type, institutionId } 
    })
    return response.data.data.data || []
  },
}

export default transactionService
