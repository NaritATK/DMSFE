'use client'

// MUI Imports
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

// Icon Imports
import { Icon } from '@iconify/react'

// Type Imports
import type { Document } from '@/services/document.service'
import { useDictionary } from '@/hooks/useDictionary'

interface DocumentListTableProps {
  documents: Document[]
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onEdit: (document: Document) => void
  onDelete: (document: Document) => void
}

const DocumentListTable = ({
  documents,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete
}: DocumentListTableProps) => {
  const { t, locale } = useDictionary()

  const openPresignedUrl = async (documentId: string) => {
    const response = await fetch(`/api/documents/${documentId}/presign`)

    if (!response.ok) {
      console.error('Failed to get presigned URL')

      return
    }

    const data = await response.json()

    if (data?.url) {
      window.open(data.url, '_blank')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const normalizeType = (value: string) => (value || '').toLowerCase().trim()

  const getFileIcon = (fileTypeOrMime: string) => {
    const v = normalizeType(fileTypeOrMime)

    if (v.includes('pdf') || v.endsWith('.pdf')) return 'tabler-file-type-pdf'
    if (v.includes('word') || v.includes('document') || v.endsWith('.doc') || v.endsWith('.docx')) return 'tabler-file-type-doc'
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
    if (v.includes('sheet') || v.includes('excel') || v.endsWith('.xls') || v.endsWith('.xlsx') || v.endsWith('.csv')) return 'success'
    if (v.includes('presentation') || v.includes('powerpoint') || v.endsWith('.ppt') || v.endsWith('.pptx')) return 'warning'

    return 'default'
  }

  if (documents.length === 0) {
    return (
      <Box className='flex flex-col items-center justify-center p-8'>
        <Icon icon='tabler-file-off' fontSize={64} className='text-text-secondary mb-4' />
        <Typography variant='h6' color='text.secondary'>
          {t('dms.edit.noDocuments')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('dms.edit.adjustSearch')}
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
              <TableCell>{t('dms.edit.table.document')}</TableCell>
              <TableCell>{t('dms.common.academicYear')}</TableCell>
              <TableCell>{t('dms.common.department')}</TableCell>
              <TableCell>{t('dms.edit.table.size')}</TableCell>
              <TableCell>{t('dms.edit.table.edits')}</TableCell>
              <TableCell>{t('dms.edit.table.lastModified')}</TableCell>
              <TableCell align='right'>{t('dms.common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map(document => (
              <TableRow key={document.documentId} hover>
              <TableCell>
                <Box className='flex items-center gap-3'>
                  {(() => {
                    const typeHint = [document.mimeType, document.fileName, document.fileExtension].filter(Boolean).join(' ')
                    const fileColor = getFileColor(typeHint)
                    const fileIcon = getFileIcon(typeHint)

                    return (
                      <Avatar
                        variant='rounded'
                        sx={{
                          bgcolor: `var(--mui-palette-${fileColor}-lightOpacity)`,
                          color: `var(--mui-palette-${fileColor}-main)`
                        }}
                      >
                        <Icon icon={fileIcon} fontSize={24} />
                      </Avatar>
                    )
                  })()}
                  <Box>
                    <Typography variant='body2' fontWeight={600}>
                      {document.title}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {document.fileName}
                    </Typography>
                    {document.description && (
                      <Typography variant='caption' color='text.secondary' display='block'>
                        {document.description.length > 30
                          ? `${document.description.substring(0, 30)}...`
                          : document.description}
                      </Typography>
                    )}
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
                <Tooltip
                  title={t('dms.edit.editsMade')
                    .replace('{count}', String(document.editCount || 0))
                    .replace('{count}', String(document.editCount || 0))}
                >
                  <Chip
                    icon={<Icon icon='tabler-edit' fontSize={14} />}
                    label={t('dms.edit.editCount').replace('{count}', String(document.editCount || 0))}
                    size='small'
                    color={document.editCount && document.editCount > 0 ? 'warning' : 'default'}
                    variant={document.editCount && document.editCount > 0 ? 'filled' : 'outlined'}
                  />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Typography variant='body2' color='text.secondary'>
                  {formatDate(document.updatedAt)}
                </Typography>
              </TableCell>
              <TableCell align='right'>
                <Tooltip title={t('dms.common.edit')}>
                  <IconButton size='small' onClick={() => onEdit(document)}>
                    <Icon icon='tabler-edit' fontSize={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('dms.common.preview')}>
                  <IconButton size='small' onClick={() => openPresignedUrl(document.documentId)}>
                    <Icon icon='tabler-external-link' fontSize={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('dms.common.download')}>
                  <IconButton size='small' onClick={() => openPresignedUrl(document.documentId)}>
                    <Icon icon='tabler-download' fontSize={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('dms.common.delete')}>
                  <IconButton size='small' color='error' onClick={() => onDelete(document)}>
                    <Icon icon='tabler-trash' fontSize={20} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
            ))}
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

export default DocumentListTable
