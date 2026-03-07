'use client'

// React Imports
import { useCallback, useState } from 'react'

import { useDropzone } from 'react-dropzone'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'

// Icon Imports

// Type Imports
import type { FileUploadState } from '@/types/dms'

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void
  files: FileUploadState[]
  onRemoveFile: (fileId: string) => void
  onRenameFile: (fileId: string, newName: string) => void
  maxFiles?: number
  maxSize?: number
}

const FileDropzone = ({
  onFilesSelected,
  files,
  onRemoveFile,
  onRenameFile,
  maxFiles = 10,
  maxSize = 52428800 // 50MB default
}: FileDropzoneProps) => {
  const theme = useTheme()
  const { t } = useDictionary()
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      const availableSlots = Math.max(maxFiles - files.length, 0)
      const filesToAdd = acceptedFiles.slice(0, availableSlots)

      const rejectionMessages = rejectedFiles.map(file => {
        const fileName = file?.file?.name || t('dms.upload.dropzone.unknownFile')
        const reason = file?.errors?.map((err: any) => err.message).join(', ') || t('dms.upload.dropzone.rejected')

        return `${fileName}: ${reason}`
      })

      if (acceptedFiles.length > filesToAdd.length) {
        rejectionMessages.push(t('dms.upload.maxFilesError').replace('{maxFiles}', String(maxFiles)))
      }

      // Debug visibility: show exactly which files were rejected and why.
      if (rejectionMessages.length > 0) {
        setError(rejectionMessages.join('\n'))
      }

      console.info('[FileDropzone] onDrop', {
        accepted: acceptedFiles.length,
        added: filesToAdd.length,
        rejected: rejectedFiles.length,
        maxFiles,
        existing: files.length,
        maxSize
      })

      if (filesToAdd.length > 0) {
        onFilesSelected(filesToAdd)
      }
    },
    [files.length, maxFiles, maxSize, onFilesSelected, t]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize
  })

  const formatFileSize = (bytes: number): string => {
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

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()

    switch (ext) {
      case 'pdf':
        return 'tabler-file-type-pdf'
      case 'doc':
      case 'docx':
        return 'tabler-file-type-doc'
      case 'xls':
      case 'xlsx':
        return 'tabler-file-type-xls'
      case 'ppt':
      case 'pptx':
        return 'tabler-file-type-ppt'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'tabler-photo'
      case 'zip':
      case 'rar':
        return 'tabler-file-zip'
      default:
        return 'tabler-file'
    }
  }

  const getFileColor = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()

    switch (ext) {
      case 'pdf':
        return 'error'
      case 'doc':
      case 'docx':
        return 'info'
      case 'xls':
      case 'xlsx':
        return 'success'
      case 'ppt':
      case 'pptx':
        return 'warning'
      default:
        return 'default'
    }
  }

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file)

    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const canPreview = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt', 'html', 'json']

    
return previewableTypes.includes(ext || '')
  }

  return (
    <Box className='flex flex-col gap-4'>
      {/* Dropzone */}
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 2,
          padding: 6,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover
          }
        }}
      >
        <input {...getInputProps()} />
        <Box className='flex flex-col items-center gap-4'>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              backgroundColor: theme.palette.primary.lightOpacity
            }}
          >
            <Icon icon='tabler-upload' fontSize={32} className='text-primary-main' />
          </Avatar>
          <Box>
            <Typography variant='h6' color='text.primary'>
              {isDragActive ? t('dms.upload.dropHere') : t('dms.upload.dragDropHere')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('dms.upload.orClickBrowse')}
            </Typography>
          </Box>
          <Button variant='outlined' size='small'>
            {t('dms.upload.browseFiles')}
          </Button>
          <Typography variant='caption' color='text.secondary'>
            {t('dms.upload.maximumFiles').replace('{maxFiles}', String(maxFiles))}
          </Typography>
        </Box>
      </Box>

      {/* Error Message */}
      {error && (
        <Box className='p-3 rounded bg-error-lightOpacity'>
          <Typography variant='body2' color='error.main' sx={{ whiteSpace: 'pre-wrap' }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Box>
          <Typography variant='h6' className='mb-3'>
            {t('dms.upload.selectedFiles')} ({files.length})
          </Typography>
          <List>
            {files.map(fileState => (
              <ListItem
                key={fileState.id}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <ListItemIcon>
                  <Avatar
                    variant='rounded'
                    sx={{
                      bgcolor: `var(--mui-palette-${getFileColor(fileState.file.name)}-lightOpacity)`,
                      color: `var(--mui-palette-${getFileColor(fileState.file.name)}-main)`
                    }}
                  >
                    <Icon icon={getFileIcon(fileState.file.name)} fontSize={24} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <TextField
                      variant='outlined'
                      size='small'
                      fullWidth
                      value={fileState.displayName}
                      onChange={e => onRenameFile(fileState.id, e.target.value)}
                      disabled={fileState.status === 'uploading'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'transparent'
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main'
                          }
                        }
                      }}
                    />
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {formatFileSize(fileState.file.size)}
                      {fileState.status === 'error' && ` - ${fileState.error}`}
                    </Box>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
                {fileState.status === 'uploading' && (
                  <Box sx={{ position: 'absolute', bottom: 8, left: 72, right: 100 }}>
                    <LinearProgress variant='determinate' value={fileState.progress} />
                  </Box>
                )}
                <ListItemSecondaryAction>
                  <Box className='flex items-center gap-2'>
                    {canPreview(fileState.file.name) && (
                      <Tooltip title={t('dms.common.preview')}>
                        <IconButton
                          size='small'
                          onClick={() => handlePreview(fileState.file)}
                          disabled={fileState.status === 'uploading'}
                          color='primary'
                        >
                          <Icon icon='tabler-eye' fontSize={20} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t('dms.common.remove')}>
                      <IconButton
                        edge='end'
                        size='small'
                        onClick={() => onRemoveFile(fileState.id)}
                        disabled={fileState.status === 'uploading'}
                        color='error'
                      >
                        <Icon icon='tabler-trash' fontSize={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}

export default FileDropzone
