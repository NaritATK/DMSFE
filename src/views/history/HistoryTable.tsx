'use client'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'

import type { DocumentWithRelations } from '@/types/dms'

interface HistoryTableProps {
  documents: DocumentWithRelations[]
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onViewDetails: (document: DocumentWithRelations) => void
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

const HistoryTable = ({
  documents,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onDownload
}: HistoryTableProps) => {
  const { t, locale } = useDictionary()

  const formatFileSize = (bytes: number) => {
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

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  if (documents.length === 0) {
    return (
      <Box className='flex flex-col items-center justify-center p-8'>
        <Icon icon='tabler-file-off' fontSize={64} className='text-text-secondary mb-4' />
        <Typography variant='h6' color='text.secondary'>
          {t('dms.history.noDocuments')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('dms.history.adjustFilters')}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('dms.history.document')}</TableCell>
              <TableCell>{t('dms.common.academicYear')}</TableCell>
              <TableCell>{t('dms.common.department')}</TableCell>
              <TableCell>{t('dms.history.fileSize')}</TableCell>
              <TableCell>{t('dms.history.uploaded')}</TableCell>
              <TableCell>{t('dms.history.lastModified')}</TableCell>
              <TableCell align='right'>{t('dms.common.actions')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {documents.map((document, index) => {
              const typeHint = [document.fileType, document.fileName, document.originalName].filter(Boolean).join(' ')
              const fileColor = getFileColor(typeHint)
              const fileIcon = getFileIcon(typeHint)

              return (
                <TableRow key={document.id || `doc-${index}`} hover>
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
                          {document.fileName}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {document.originalName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip label={document.academicYear} size='small' variant='tonal' color='primary' />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{document.department}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{formatFileSize(document.fileSize)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {formatDate(document.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {formatDate(document.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Tooltip title={t('dms.common.viewDetails')}>
                      <IconButton size='small' onClick={() => onViewDetails(document)}>
                        <Icon icon='tabler-eye' fontSize={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('dms.common.download')}>
                      <IconButton size='small' onClick={() => onDownload(document)}>
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

      <TablePagination
        component='div'
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  )
}

export default HistoryTable
