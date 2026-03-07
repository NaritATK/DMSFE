import apiClient from '@/libs/axios'

export interface AcademicYear {
  academicYearId: string
  year: string
  description: string | null
  startDate: string | null
  endDate: string | null
  isActive: boolean
  isLocked: boolean
  createdBy: string | null
  createdAt: string
  updatedBy: string | null
  updatedAt: string
}

export interface CreateAcademicYearDto {
  year: string
  description: string
  startDate?: string | null
  endDate?: string | null
  isActive?: boolean
}

export interface UpdateAcademicYearDto {
  description?: string
  startDate?: string | null
  endDate?: string | null
  isActive?: boolean
  isLocked?: boolean
}

export const academicYearService = {
  async getAll(): Promise<AcademicYear[]> {
    const response = await apiClient.get<AcademicYear[]>('/academic-years')

    
return response.data
  },

  async create(payload: CreateAcademicYearDto): Promise<AcademicYear> {
    const response = await apiClient.post<AcademicYear>('/academic-years', payload)

    
return response.data
  },

  async update(id: string, payload: UpdateAcademicYearDto): Promise<AcademicYear> {
    const response = await apiClient.put<AcademicYear>(`/academic-years/${id}`, payload)

    
return response.data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/academic-years/${id}`)
  },

  async toggleActive(id: string): Promise<AcademicYear> {
    const response = await apiClient.patch<AcademicYear>(`/academic-years/${id}/toggle`)

    
return response.data
  }
}
