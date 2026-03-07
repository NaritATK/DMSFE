'use client'

import { useEffect, useState } from 'react'

import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import { useAuth } from '@/hooks/useAuth'
import { useDictionary } from '@/hooks/useDictionary'
import { activityLogService, type ActivityLog } from '@/services/activity-log.service'

const formatRelativeTime = (dateString: string, t: (key: string, fallback?: string) => string) => {
  const date = new Date(dateString)
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return t('dms.dashboard.relative.justNow')
  if (minutes < 60) return t('dms.dashboard.relative.minutesAgo').replace('{count}', String(minutes))

  const hours = Math.floor(minutes / 60)

  if (hours < 24) return t('dms.dashboard.relative.hoursAgo').replace('{count}', String(hours))

  const days = Math.floor(hours / 24)

  return t('dms.dashboard.relative.daysAgo').replace('{count}', String(days))
}

const getActivityMeta = (log: ActivityLog) => {
  const action = (log.action || '').toUpperCase()

  if (action === 'UPLOAD' || action === 'CREATE') return { icon: 'tabler-upload', color: 'success' as const }
  if (action === 'UPDATE' || action === 'EDIT') return { icon: 'tabler-edit', color: 'info' as const }
  if (action === 'DELETE') return { icon: 'tabler-trash', color: 'error' as const }
  if (action === 'LOGIN') return { icon: 'tabler-login', color: 'primary' as const }
  if (action === 'LOGOUT') return { icon: 'tabler-logout', color: 'warning' as const }
  if (action === 'VIEW') return { icon: 'tabler-eye', color: 'primary' as const }

  return { icon: 'tabler-activity', color: 'primary' as const }
}

const getActivityTitle = (log: ActivityLog, t: (key: string, fallback?: string) => string) => {
  const action = log.action || ''
  const resource = log.resource || ''
  const composed = [action, resource].filter(Boolean).join(' - ')

  return composed || t('dms.dashboard.recentActivity', 'Recent Activity')
}

const getActivityDescription = (log: ActivityLog) => {
  const actor = log.userDisplayName || log.userEmail || log.userId || '-'
  const resource = log.resource || '-'
  const resourceId = log.resourceId ? ` (${log.resourceId})` : ''

  return `${actor} • ${resource}${resourceId}`
}

const ActivityTimeline = () => {
  const { t } = useDictionary()
  const { user } = useAuth()

  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)

        const sysUserId = (user as any)?.sysUserId
        const role = user?.role

        if (!user || !sysUserId) {
          setLogs([])
          return
        }

        const response =
          role === 'ADMIN'
            ? await activityLogService.getActivityLogs({ page: 1, limit: 8 })
            : await activityLogService.getUserActivityLogs(sysUserId, 1, 8)

        setLogs(response.logs || [])
      } catch (error: any) {
        console.error('[ActivityTimeline] Error fetching activities:', error?.message || error)
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user])

  if (loading) {
    return (
      <Card>
        <CardHeader title={t('dms.dashboard.recentActivity')} />
        <CardContent>
          <Box className='flex items-center justify-center p-8'>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title={t('dms.dashboard.recentActivity')} />
      <CardContent>
        <Timeline
          sx={{
            p: 0,
            m: 0,
            '& .MuiTimelineItem-root:before': {
              display: 'none'
            }
          }}
        >
          {logs.map((log, index) => {
            const meta = getActivityMeta(log)

            return (
              <TimelineItem key={log.logId}>
                <TimelineSeparator>
                  <TimelineDot color={meta.color}>
                    <Icon icon={meta.icon} fontSize={20} />
                  </TimelineDot>
                  {index < logs.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Box className='flex flex-col gap-1 pb-4'>
                    <Box className='flex items-center gap-2'>
                      <Typography variant='body1' fontWeight={600}>
                        {getActivityTitle(log, t)}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {formatRelativeTime(log.createdAt, t)}
                      </Typography>
                    </Box>
                    <Typography variant='body2' color='text.secondary'>
                      {getActivityDescription(log)}
                    </Typography>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline
