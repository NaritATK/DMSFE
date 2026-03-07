'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'

// Icon Imports
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import { getDocuments } from '@/services/document.service'

interface StorageData {
  used: number // GB
  total: number // GB
  percentage: number
}

const bytesToGB = (bytes: number) => {
  const gb = bytes / (1024 * 1024 * 1024)

  return Math.round(gb * 10) / 10
}

const StorageUsage = () => {
  const { t } = useDictionary()

  const totalStorageGB = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_STORAGE_TOTAL_GB
    const parsed = raw ? Number(raw) : NaN

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10
  }, [])

  const [storage, setStorage] = useState<StorageData>({
    used: 0,
    total: totalStorageGB,
    percentage: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        // Best-effort: compute used size from first N documents.
        // NOTE: Backend has no aggregate endpoint yet.
        const pageSize = 500
        const res = await getDocuments({ page: 0, limit: pageSize })

        const usedBytes = (res.documents || []).reduce((acc, doc) => acc + (Number(doc.fileSize) || 0), 0)
        const used = bytesToGB(usedBytes)
        const total = totalStorageGB
        const percentage = total > 0 ? (used / total) * 100 : 0

        setStorage({ used, total, percentage })
      } catch (error) {
        console.error('Error fetching storage:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStorage()
  }, [totalStorageGB])

  const getStorageColor = (percentage: number) => {
    if (percentage >= 90) return 'error'
    if (percentage >= 75) return 'warning'

    return 'success'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title={t('dms.dashboard.storageUsage')} />
        <CardContent>
          <Box className='flex items-center justify-center' style={{ height: 200 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  const color = getStorageColor(storage.percentage)

  return (
    <Card>
      <CardHeader
        title={t('dms.dashboard.storageUsage')}
        action={<Chip label={`${storage.percentage.toFixed(1)}%`} color={color} size='small' />}
      />
      <CardContent className='flex flex-col gap-6'>
        {/* Storage Icon and Stats */}
        <Box className='flex items-center gap-4'>
          <Box className={`flex items-center justify-center w-16 h-16 rounded-full bg-${color}-100`}>
            <Icon icon='tabler-database' fontSize={32} className={`text-${color}-main`} />
          </Box>
          <Box className='flex flex-col'>
            <Typography variant='h4' color='text.primary'>
              {storage.used} {t('dms.common.fileSizeUnits.gb')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('dms.dashboard.ofTotalUsed').replace('{total}', String(storage.total))}
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box>
          <LinearProgress
            variant='determinate'
            value={Math.min(100, Math.max(0, storage.percentage))}
            color={color}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>

        {/* Warning Message */}
        {storage.percentage >= 75 && (
          <Box className={`p-3 rounded bg-${color}-100`}>
            <Typography variant='body2' color={`${color}.main`}>
              {storage.percentage >= 90 ? t('dms.dashboard.storageAlmostFull') : t('dms.dashboard.storageHigh')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default StorageUsage
