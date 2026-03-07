'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

// Icon Imports
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import { getDocuments, type Document } from '@/services/document.service'

const normalizeType = (value: string) => (value || '').toLowerCase().trim()

const getFileIcon = (fileTypeOrMime: string) => {
  const v = normalizeType(fileTypeOrMime)

  if (v.includes('pdf') || v.endsWith('.pdf')) return 'tabler-file-type-pdf'
  if (v.includes('word') || v.includes('document') || v.endsWith('.doc') || v.endsWith('.docx'))
    return 'tabler-file-type-doc'
  if (v.includes('sheet') || v.includes('excel') || v.endsWith('.xls') || v.endsWith('.xlsx') || v.endsWith('.csv'))
    return 'tabler-file-type-xls'
  if (v.includes('presentation') || v.includes('powerpoint') || v.endsWith('.ppt') || v.endsWith('.pptx'))
    return 'tabler-file-type-ppt'
  if (v.includes('image') || v.endsWith('.png') || v.endsWith('.jpg') || v.endsWith('.jpeg') || v.endsWith('.webp'))
    return 'tabler-photo'

  return 'tabler-file'
}

const getFileColor = (fileTypeOrMime: string) => {
  const v = normalizeType(fileTypeOrMime)

  if (v.includes('pdf') || v.endsWith('.pdf')) return 'error'
  if (v.includes('word') || v.includes('document') || v.endsWith('.doc') || v.endsWith('.docx')) return 'info'
  if (v.includes('sheet') || v.includes('excel') || v.endsWith('.xls') || v.endsWith('.xlsx') || v.endsWith('.csv'))
    return 'success'
  if (v.includes('presentation') || v.includes('powerpoint') || v.endsWith('.ppt') || v.endsWith('.pptx'))
    return 'warning'

  return 'default'
}

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

const bytesToMB = (bytes: number) => {
  const mb = bytes / (1024 * 1024)

  return Math.round(mb * 10) / 10
}

const RecentUploads = () => {
  const { t } = useDictionary()
  const [uploads, setUploads] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUploads = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getDocuments({ page: 0, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })

      setUploads(response.documents || [])
    } catch (error) {
      console.error('Error fetching uploads:', error)
      setError(t('dms.common.error', 'Failed to load recent uploads'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUploads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openPresignedUrl = async (documentId: string) => {
    const response = await fetch(`/api/documents/${documentId}/presign`)

    if (!response.ok) return

    const data = await response.json()

    if (data?.url) window.open(data.url, '_blank')
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title={t('dms.dashboard.recentUploads')} />
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
      <CardHeader
        title={t('dms.dashboard.recentUploads')}
        action={
          <IconButton size='small' onClick={fetchUploads}>
            <Icon icon='tabler-refresh' />
          </IconButton>
        }
      />
      {error ? (
        <CardContent>
          <Alert
            severity='error'
            action={
              <Button color='inherit' size='small' onClick={fetchUploads}>
                {t('dms.common.retry', 'Retry')}
              </Button>
            }
          >
            {error}
          </Alert>
        </CardContent>
      ) : uploads.length === 0 ? (
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            {t('dms.dashboard.noRecentUploads', 'No recent uploads yet')}
          </Typography>
        </CardContent>
      ) : (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('dms.dashboard.file')}</TableCell>
              <TableCell>{t('dms.dashboard.department')}</TableCell>
              <TableCell>{t('dms.dashboard.uploadedBy')}</TableCell>
              <TableCell>{t('dms.dashboard.time')}</TableCell>
              <TableCell>{t('dms.dashboard.size')}</TableCell>
              <TableCell align='right'>{t('dms.common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uploads.map(upload => {
              const typeHint = [upload.mimeType, upload.fileName, upload.fileExtension].filter(Boolean).join(' ')
              const fileColor = getFileColor(typeHint)
              const fileIcon = getFileIcon(typeHint)

              return (
                <TableRow key={upload.documentId} hover>
                  <TableCell>
                    <Box className='flex items-center gap-3'>
                      <Avatar
                        variant='rounded'
                        sx={{
                          bgcolor: `var(--mui-palette-${fileColor}-lightOpacity)`,
                          color: `var(--mui-palette-${fileColor}-main)`
                        }}
                      >
                        <Icon icon={fileIcon} fontSize={24} />
                      </Avatar>
                      <Box>
                        <Typography variant='body2' fontWeight={600}>
                          {upload.title || upload.fileName}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {upload.fileName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={upload.department} size='small' variant='tonal' color='primary' />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{upload.uploadedByName || upload.uploadedBy || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {formatRelativeTime(upload.uploadedAt || upload.updatedAt, t)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>
                      {bytesToMB(Number(upload.fileSize) || 0)} {t('dms.common.fileSizeUnits.mb')}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Tooltip title={t('dms.common.preview')}>
                      <IconButton size='small' onClick={() => openPresignedUrl(upload.documentId)}>
                        <Icon icon='tabler-external-link' fontSize={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('dms.common.download')}>
                      <IconButton size='small' onClick={() => openPresignedUrl(upload.documentId)}>
                        <Icon icon='tabler-download' fontSize={20} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Card>
  )
}

export default RecentUploads
