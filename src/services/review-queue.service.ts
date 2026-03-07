import apiClient from '@/libs/axios'
import type { AuditItem, EligibilityPreviewRow, ReviewItem } from '@/types/admin/review-queue'

export const reviewQueueService = {
  async listEligibilityQueue() {
    const res = await apiClient.get('/documents/review-queue/eligibility', { params: { page: 1, limit: 100 } })

    return (res.data?.items || []) as ReviewItem[]
  },

  async resolve(conversionId: string) {
    await apiClient.patch(`/documents/review-queue/eligibility/${conversionId}/resolve`)
  },

  async requeue(conversionId: string) {
    await apiClient.patch(`/documents/review-queue/eligibility/${conversionId}/requeue`)
  },

  async getRows(conversionId: string) {
    const res = await apiClient.get(`/documents/review-queue/eligibility/${conversionId}/rows`)

    return (res.data?.rows || []) as EligibilityPreviewRow[]
  },

  async saveRows(conversionId: string, rows: EligibilityPreviewRow[]) {
    await apiClient.put(`/documents/review-queue/eligibility/${conversionId}/rows`, { rows })
  },

  async getAuditLogs(conversionId: string) {
    const res = await apiClient.get(`/documents/review-queue/eligibility/${conversionId}/audit-logs`, { params: { limit: 30 } })

    return (res.data?.items || []) as AuditItem[]
  }
}
