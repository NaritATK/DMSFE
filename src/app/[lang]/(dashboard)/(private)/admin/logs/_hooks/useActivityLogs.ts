import { useState } from 'react'

import { activityLogService, type ActivityLog, type ActivityLogFilters } from '@/services/activity-log.service'

export const useActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [totalLogs, setTotalLogs] = useState(0)
  const [filters, setFilters] = useState<ActivityLogFilters>({ action: '', resource: '', userId: '' })
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

  const fetchLogs = async (fallbackError: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await activityLogService.getActivityLogs({
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
      })

      setLogs(response.logs)
      setTotalLogs(response.total)
    } catch (err: any) {
      console.error('Error fetching logs:', err)
      setError(err.response?.data?.error || err.message || fallbackError)
    } finally {
      setLoading(false)
    }
  }

  return {
    state: {
      logs,
      loading,
      error,
      page,
      rowsPerPage,
      totalLogs,
      filters,
      expandedLogId,
    },
    actions: {
      setError,
      setPage,
      setRowsPerPage,
      setFilters,
      setExpandedLogId,
      fetchLogs,
    },
  }
}
