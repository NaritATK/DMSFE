import apiClient from '@/libs/axios'

export interface UserAccess {
  accessId: string
  email: string
  roleCode: 'ADMIN' | 'STAFF'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const userAccessService = {
  async getAll(): Promise<UserAccess[]> {
    const response = await apiClient.get<UserAccess[]>('/user-access')

    
return response.data
  },

  async create(email: string, roleCode: 'ADMIN' | 'STAFF'): Promise<UserAccess> {
    const response = await apiClient.post<UserAccess>('/user-access', { email, roleCode })

    
return response.data
  },

  async toggle(accessId: string): Promise<UserAccess> {
    const response = await apiClient.delete<UserAccess>(`/user-access/${accessId}`)

    
return response.data
  }
}
