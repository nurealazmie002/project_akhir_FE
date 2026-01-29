import api from './api'

export interface InstitutionProfile {
  id?: number
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logoUrl?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateInstitutionDto {
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
}

export interface UpdateInstitutionDto {
  name?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
}

export const institutionService = {
  get: async (): Promise<InstitutionProfile | null> => {
    const response = await api.get('/profileinstitution')
    return response.data.data || response.data
  },

  create: async (data: CreateInstitutionDto, logo?: File): Promise<InstitutionProfile> => {
    const formData = new FormData()
    
    formData.append('name', data.name)
    if (data.address) formData.append('address', data.address)
    if (data.phone) formData.append('phone', data.phone)
    if (data.email) formData.append('email', data.email)
    if (data.website) formData.append('website', data.website)
    if (data.description) formData.append('description', data.description)
    if (logo) formData.append('logoUrl', logo)

    const response = await api.post('/profileinstitution', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data || response.data
  },

  update: async (data: UpdateInstitutionDto, logo?: File): Promise<InstitutionProfile> => {
    const formData = new FormData()
    
    if (data.name) formData.append('name', data.name)
    if (data.address) formData.append('address', data.address)
    if (data.phone) formData.append('phone', data.phone)
    if (data.email) formData.append('email', data.email)
    if (data.website) formData.append('website', data.website)
    if (data.description) formData.append('description', data.description)
    if (logo) formData.append('logoUrl', logo)

    const response = await api.put('/profileinstitution', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data || response.data
  },

  delete: async (): Promise<void> => {
    await api.delete('/profileinstitution')
  }
}

export default institutionService
