import type { ActivityLog } from '@/services/activity-log.service'

export const getActionColor = (action: string) => {
  const normalized = action.toUpperCase()

  if (['CREATE', 'UPLOAD'].includes(normalized)) return 'success'
  if (normalized === 'UPDATE') return 'info'
  if (normalized === 'DELETE') return 'error'
  if (['VIEW', 'LOGIN'].includes(normalized)) return 'default'

  return 'primary'
}

export const formatShortId = (value?: string | null) => {
  if (!value) return '-'
  return value.length > 8 ? `${value.substring(0, 8)}...` : value
}

export const flattenDetails = (details: ActivityLog['details']) => {
  if (!details || typeof details !== 'object') return [] as [string, unknown][]
  return Object.entries(details)
}
