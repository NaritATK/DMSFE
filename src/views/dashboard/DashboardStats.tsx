'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// Icon Imports
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import { getDocuments } from '@/services/document.service'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  bgColor: string
  iconColor: string
  trend?: {
    value: number
    isPositive: boolean
  }
  trendLabel?: string
}

const StatCard = ({ title, value, icon, bgColor, iconColor, trend, trendLabel }: StatCardProps) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant='h4' fontWeight={700} color='text.primary'>
              {value}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: bgColor
            }}
          >
            <Icon icon={icon} fontSize={28} color={iconColor} />
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Icon
              icon={trend.isPositive ? 'tabler-trending-up' : 'tabler-trending-down'}
              fontSize={20}
              color={trend.isPositive ? '#28C76F' : '#EA5455'}
            />
            <Typography variant='body2' sx={{ color: trend.isPositive ? 'success.main' : 'error.main', fontWeight: 600 }}>
              {trend.value}%
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {trendLabel}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

const getStartOfMonthISO = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)

  return start.toISOString()
}

const bytesToGB = (bytes: number) => {
  const gb = bytes / (1024 * 1024 * 1024)

  return Math.round(gb * 10) / 10
}

const DashboardStats = () => {
  const { t } = useDictionary()
  const theme = useTheme()

  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSizeGB: 0,
    documentsThisMonth: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1) Total documents (use limit=1 just to get total)
      const totalResp = await getDocuments({ page: 0, limit: 1 })

      // 2) This month documents (use backend filter if supported)
      let thisMonthTotal = 0

      try {
        const thisMonthResp = await getDocuments({ page: 0, limit: 1, dateFrom: getStartOfMonthISO() })

        thisMonthTotal = thisMonthResp.total || 0
      } catch {
        thisMonthTotal = 0
      }

      // 3) Total size (best-effort: sum first N docs)
      // NOTE: Backend has no aggregate endpoint yet; we do best-effort in FE.
      const pageSize = 500
      const docsResp = await getDocuments({ page: 0, limit: pageSize })
      const usedBytes = (docsResp.documents || []).reduce((acc, doc) => acc + (Number(doc.fileSize) || 0), 0)

      setStats({
        totalDocuments: totalResp.total || 0,
        totalSizeGB: bytesToGB(usedBytes),
        documentsThisMonth: thisMonthTotal
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError(t('dms.common.error', 'Failed to load dashboard stats'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Define colors for each stat card
  const primaryBg = theme.palette.mode === 'dark' ? 'rgba(115, 103, 240, 0.16)' : 'rgba(115, 103, 240, 0.12)'
  const successBg = theme.palette.mode === 'dark' ? 'rgba(40, 199, 111, 0.16)' : 'rgba(40, 199, 111, 0.12)'
  const warningBg = theme.palette.mode === 'dark' ? 'rgba(255, 159, 67, 0.16)' : 'rgba(255, 159, 67, 0.12)'

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert
        severity='error'
        action={
          <Button color='inherit' size='small' onClick={fetchStats}>
            {t('dms.common.retry', 'Retry')}
          </Button>
        }
      >
        {error}
      </Alert>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 6
      }}
    >
      <StatCard
        title={t('dms.dashboard.totalDocuments')}
        value={stats.totalDocuments.toLocaleString()}
        icon='tabler-file-text'
        bgColor={primaryBg}
        iconColor='#7367F0'
      />
      <StatCard
        title={t('dms.dashboard.storageUsed')}
        value={`${stats.totalSizeGB} ${t('dms.common.fileSizeUnits.gb')}`}
        icon='tabler-database'
        bgColor={successBg}
        iconColor='#28C76F'
      />
      <StatCard
        title={t('dms.dashboard.thisMonth')}
        value={stats.documentsThisMonth}
        icon='tabler-calendar'
        bgColor={warningBg}
        iconColor='#FF9F43'
      />
    </Box>
  )
}

export default DashboardStats
