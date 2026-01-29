import api from './api'

export interface Profile {
  id: string
  userId: string
  name: string
  gender?: string
  address: string
  occupation?: string
  phone?: string
  profile_picture_url?: string
  public_id?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateProfileDto {
  name: string
  address: string
  gender?: string
  occupation?: string
  phone?: string
}

export interface UpdateProfileDto {
  name?: string
  address?: string
  gender?: string
  occupation?: string
  phone?: string
}

export const profileService = {
  getById: async (id: string): Promise<Profile> => {
    const response = await api.get(`/profile/${id}`)
    return response.data.data || response.data
  },

  getMyProfile: async (): Promise<Profile | null> => {
    try {
      const response = await api.get('/profile/me')
      const data = response.data.data || response.data
      return data
    } catch (error) {
      return null
    }
  },

  create: async (data: CreateProfileDto, profilePicture?: File): Promise<Profile> => {
    const formData = new FormData()
    
    formData.append('name', data.name)
    formData.append('address', data.address)
    if (data.gender) formData.append('gender', data.gender)
    if (data.occupation) formData.append('occupation', data.occupation)
    if (data.phone) formData.append('phone', data.phone)
    if (profilePicture) formData.append('profile_picture', profilePicture)

    const response = await api.post('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data || response.data
  },

  update: async (id: string, data: UpdateProfileDto, profilePicture?: File): Promise<Profile> => {
    const formData = new FormData()
    
    if (data.name) formData.append('name', data.name)
    if (data.address) formData.append('address', data.address)
    if (data.gender) formData.append('gender', data.gender)
    if (data.occupation) formData.append('occupation', data.occupation)
    if (data.phone) formData.append('phone', data.phone)
    if (profilePicture) formData.append('profile_picture', profilePicture)

    const response = await api.put(`/profile/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data || response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/profile/${id}`)
  }
}

export default profileService
