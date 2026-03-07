import apiClient from '@/libs/axios'

export interface ActivityLog {
  logId: string
  userId: string
  userEmail?: string | null
  userDisplayName?: string | null
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown> | null
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface ActivityLogResponse {
  logs: ActivityLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ActivityLogFilters {
  page?: number
  limit?: number
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
}

class ActivityLogService {
  async getActivityLogs(filters?: ActivityLogFilters): Promise<ActivityLogResponse> {
    const params = new URLSearchParams()

    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.userId) params.append('userId', filters.userId)
    if (filters?.action) params.append('action', filters.action)
    if (filters?.resource) params.append('resource', filters.resource)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const query = params.toString()
    const response = await apiClient.get<ActivityLogResponse>(query ? `/activity-logs?${query}` : '/activity-logs')

    return response.data
  }

  async getUserActivityLogs(userId: string, page = 1, limit = 50): Promise<ActivityLogResponse> {
    const response = await apiClient.get<ActivityLogResponse>(`/activity-logs/user/${userId}?page=${page}&limit=${limit}`)

    return response.data
  }
}

export const activityLogService = new ActivityLogService()
