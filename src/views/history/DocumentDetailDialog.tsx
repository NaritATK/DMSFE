'use client'

import { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'

import type { DocumentWithRelations } from '@/types/dms'

interface DocumentDetailDialogProps {
  open: boolean
  document: DocumentWithRelations
  onClose: () => void
  onDownload: (document: DocumentWithRelations) => void
}

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

const formatFileSize = (bytes: number, t: (key: string, fallback?: string) => string) => {
  const unitKeys = [
    'dms.common.fileSizeUnits.bytes',
    'dms.common.fileSizeUnits.kb',
    'dms.common.fileSizeUnits.mb',
    'dms.common.fileSizeUnits.gb'
  ]

  if (bytes === 0) return `0 ${t(unitKeys[0])}`

  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const normalizedIndex = Math.min(Math.max(i, 0), unitKeys.length - 1)
  const value = Math.round((bytes / Math.pow(k, normalizedIndex)) * 100) / 100

  return `${value} ${t(unitKeys[normalizedIndex])}`
}

const DocumentDetailDialog = ({ open, document, onClose, onDownload }: DocumentDetailDialogProps) => {
  const { t, locale } = useDictionary()
  const [previewing, setPreviewing] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const docId = (document as any).documentId || document.id
  const fileTypeHint = [document.fileType, document.fileName, document.originalName].filter(Boolean).join(' ')

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  const handlePreview = async () => {
    if (!docId || docId === 'undefined' || docId === 'null') {
      console.error('Invalid document ID for preview:', docId)
      return
    }

    setPreviewing(true)

    try {
      const response = await fetch(`/api/documents/${docId}/presign`)

      if (!response.ok) return

      const data = await response.json()

      if (data?.url) {
        window.open(data.url, '_blank')
      }
    } finally {
      setPreviewing(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth fullScreen={isMobile}>
      <DialogTitle>
        <Box className='flex items-center justify-between'>
          <Typography variant='h5'>{t('dms.history.documentDetails')}</Typography>
          <IconButton onClick={onClose} size='small'>
            <Icon icon='tabler-x' />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box className='flex flex-col gap-6'>
          <Box className='flex items-center gap-4 p-4 rounded bg-action-hover'>
            <Avatar
              variant='rounded'
              sx={{
                width: 64,
                height: 64,
                bgcolor: `var(--mui-palette-${getFileColor(fileTypeHint)}-lightOpacity)`,
                color: `var(--mui-palette-${getFileColor(fileTypeHint)}-main)`
              }}
            >
              <Icon icon={getFileIcon(fileTypeHint)} fontSize={32} />
            </Avatar>
            <Box className='flex-1'>
              <Typography variant='h6' className='mb-1'>
                {document.fileName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {document.originalName}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant='h6' className='mb-3'>
              {t('dms.history.information')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant='caption' color='text.secondary'>
                  {t('dms.common.academicYear')}
                </Typography>
                <Box className='mt-1'>
                  <Chip label={document.academicYear} size='small' color='primary' />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant='caption' color='text.secondary'>
                  {t('dms.common.department')}
                </Typography>
                <Typography variant='body2' fontWeight={600} className='mt-1'>
                  {document.department}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant='caption' color='text.secondary'>
                  {t('dms.history.fileSize')}
                </Typography>
                <Typography variant='body2' fontWeight={600} className='mt-1'>
                  {formatFileSize(document.fileSize, t)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant='h6' className='mb-3'>
              {t('dms.history.timeline')}
            </Typography>
            <Typography variant='body2'>
              {t('dms.history.uploaded')}: {formatDate(document.createdAt)}
            </Typography>
            <Typography variant='body2'>
              {t('dms.history.lastModified')}: {formatDate(document.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose}>{t('dms.common.close')}</Button>
        <Button variant='outlined' startIcon={<Icon icon='tabler-eye' />} onClick={handlePreview} disabled={previewing}>
          {previewing ? t('dms.common.loading') : t('dms.common.preview')}
        </Button>
        <Button
          variant='contained'
          startIcon={<Icon icon='tabler-download' />}
          onClick={() => {
            onDownload(document)
            onClose()
          }}
        >
          {t('dms.common.download')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentDetailDialog
