'use client'

import { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { Icon } from '@iconify/react'

import type { Document } from '@/services/document.service'
import { academicYearService } from '@/services/academic-year.service'
import { useDictionary } from '@/hooks/useDictionary'

interface DocumentEditDialogProps {
  open: boolean
  document: Document
  onClose: () => void
  onSave: (id: string, data: {
    title?: string
    description?: string
    departmentUnitId?: string
    academicYearId?: string
    changeNote: string
    file?: File
  }) => Promise<void>
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const DocumentEditDialog = ({ open, document, onClose, onSave }: DocumentEditDialogProps) => {
  const { t, locale } = useDictionary()
  const [tabValue, setTabValue] = useState(0)

  const [formData, setFormData] = useState({
    title: document.title,
    description: document.description || '',
    department: document.department,
    academicYear: document.academicYear
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [changeNote, setChangeNote] = useState('')
  const [previewing, setPreviewing] = useState(false)

  const [departments, setDepartments] = useState<string[]>([])
  const [academicYears, setAcademicYears] = useState<string[]>([])

  useEffect(() => {
    setFormData({
      title: document.title,
      description: document.description || '',
      department: document.department,
      academicYear: document.academicYear
    })
    setNewFile(null)
    setChangeNote('')
    setError(null)
    setTabValue(0)
  }, [document])

  useEffect(() => {
    setDepartments([
      'IT Department',
      'HR Department',
      'Finance Department',
      'Operations Department',
      'Marketing Department',
      'Sales Department',
      'Legal Department',
      'R&D Department'
    ])

    const loadAcademicYears = async () => {
      try {
        const years = await academicYearService.getAll()

        setAcademicYears(years.map(y => y.year))
      } catch (err) {
        console.error('Failed to load academic years:', err)
        setAcademicYears([])
      }
    }

    void loadAcademicYears()
  }, [])

  const handleSave = async () => {
    if (!changeNote.trim()) {
      setError(t('dms.edit.dialog.validation.changeNoteRequired'))
      
return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave(document.documentId, {
        title: formData.title,
        description: formData.description,
        changeNote,
        file: newFile || undefined
      })
    } catch (err) {
      console.error('Error saving document:', err)
      setError(t('dms.edit.dialog.errors.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    if (!document.documentId) return

    setPreviewing(true)

    try {
      const response = await fetch(`/api/documents/${document.documentId}/presign`)

      if (!response.ok) {
        console.error('Failed to get presigned URL')
        
return
      }

      const data = await response.json()

      if (data?.url) {
        window.open(data.url, '_blank')
      }
    } finally {
      setPreviewing(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > 52428800) {
        setError(t('dms.edit.dialog.validation.fileSize'))
        
return
      }

      setNewFile(file)
      setError(null)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.includes('pdf')) return 'tabler-file-type-pdf'
    if (mimeType?.includes('word') || mimeType?.includes('document')) return 'tabler-file-type-doc'
    if (mimeType?.includes('sheet') || mimeType?.includes('excel')) return 'tabler-file-type-xls'
    if (mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) return 'tabler-file-type-ppt'
    if (mimeType?.includes('image')) return 'tabler-photo'

    return 'tabler-file'
  }

  const getFileColor = (mimeType: string) => {
    if (mimeType?.includes('pdf')) return 'error'
    if (mimeType?.includes('word') || mimeType?.includes('document')) return 'info'
    if (mimeType?.includes('sheet') || mimeType?.includes('excel')) return 'success'
    if (mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) return 'warning'

    return 'default'
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box className='flex items-center justify-between'>
          <Typography variant='h5'>{t('dms.edit.dialog.title')}</Typography>
          <IconButton onClick={onClose} size='small'>
            <Icon icon='tabler-x' />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={t('dms.edit.dialog.tabs.editInfo')} icon={<Icon icon='tabler-edit' />} iconPosition='start' />
          <Tab label={t('dms.edit.dialog.tabs.replaceFile')} icon={<Icon icon='tabler-file-upload' />} iconPosition='start' />
          <Tab label={t('dms.edit.dialog.tabs.versionHistory')} icon={<Icon icon='tabler-history' />} iconPosition='start' />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box className='flex flex-col gap-4'>
            <Box className='p-4 rounded bg-action-hover'>
              <Box className='flex items-center gap-3'>
                <Avatar
                  variant='rounded'
                  sx={{
                    bgcolor: `var(--mui-palette-${getFileColor(document.mimeType)}-lightOpacity)`,
                    color: `var(--mui-palette-${getFileColor(document.mimeType)}-main)`
                  }}
                >
                  <Icon icon={getFileIcon(document.mimeType)} fontSize={24} />
                </Avatar>
                <Box className='flex-1'>
                  <Typography variant='body2' fontWeight={600}>
                    {document.fileName}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {formatFileSize(document.fileSize)} • {t('dms.edit.dialog.editedTimes').replace('{count}', String(document.editCount || 0))}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <TextField
              fullWidth
              label={t('dms.edit.dialog.fields.title')}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Autocomplete
              options={academicYears}
              value={formData.academicYear}
              onChange={(_, value) => setFormData({ ...formData, academicYear: value || '' })}
              renderInput={params => <TextField {...params} label={t('dms.common.academicYear')} required />}
            />

            <Autocomplete
              options={departments}
              value={formData.department}
              onChange={(_, value) => setFormData({ ...formData, department: value || '' })}
              renderInput={params => <TextField {...params} label={t('dms.common.department')} required />}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('dms.common.description')}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label={t('dms.edit.dialog.fields.changeNote')}
              placeholder={t('dms.edit.dialog.placeholders.changeNote')}
              value={changeNote}
              onChange={e => setChangeNote(e.target.value)}
              required
              helperText={t('dms.edit.dialog.helpers.changeNoteRequired')}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box className='flex flex-col gap-4'>
            <Alert severity='warning'>{t('dms.edit.dialog.replaceWarning')}</Alert>

            <Box>
              <Typography variant='body2' fontWeight={600} className='mb-2'>
                {t('dms.edit.dialog.currentFile')}
              </Typography>
              <Box className='p-4 rounded border border-divider'>
                <Box className='flex items-center gap-3'>
                  <Avatar
                    variant='rounded'
                    sx={{
                      bgcolor: `var(--mui-palette-${getFileColor(document.mimeType)}-lightOpacity)`,
                      color: `var(--mui-palette-${getFileColor(document.mimeType)}-main)`
                    }}
                  >
                    <Icon icon={getFileIcon(document.mimeType)} fontSize={24} />
                  </Avatar>
                  <Box>
                    <Typography variant='body2' fontWeight={600}>
                      {document.fileName}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formatFileSize(document.fileSize)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant='body2' fontWeight={600} className='mb-2'>
                {t('dms.edit.dialog.newFile')}
              </Typography>
              <input type='file' id='file-upload' style={{ display: 'none' }} onChange={handleFileSelect} />
              <label htmlFor='file-upload'>
                <Button component='span' variant='outlined' startIcon={<Icon icon='tabler-upload' />} fullWidth>
                  {t('dms.edit.dialog.chooseFile')}
                </Button>
              </label>

              {newFile && (
                <Box className='mt-3 p-4 rounded border border-divider'>
                  <Box className='flex items-center gap-3'>
                    <Avatar
                      variant='rounded'
                      sx={{
                        bgcolor: `var(--mui-palette-${getFileColor(newFile.type)}-lightOpacity)`,
                        color: `var(--mui-palette-${getFileColor(newFile.type)}-main)`
                      }}
                    >
                      <Icon icon={getFileIcon(newFile.type)} fontSize={24} />
                    </Avatar>
                    <Box className='flex-1'>
                      <Typography variant='body2' fontWeight={600}>
                        {newFile.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {formatFileSize(newFile.size)}
                      </Typography>
                    </Box>
                    <IconButton size='small' onClick={() => setNewFile(null)}>
                      <Icon icon='tabler-x' />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              multiline
              rows={2}
              label={t('dms.edit.dialog.fields.replaceReason')}
              placeholder={t('dms.edit.dialog.placeholders.replaceReason')}
              value={changeNote}
              onChange={e => setChangeNote(e.target.value)}
              required
              helperText={t('dms.edit.dialog.helpers.replaceReasonRequired')}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box className='flex flex-col gap-3'>
            <Alert severity='info'>{t('dms.edit.dialog.versionHistoryInfo')}</Alert>

            <Box className='p-4 rounded border border-divider'>
              <Box className='flex items-center gap-3'>
                <Chip label={t('dms.edit.dialog.currentVersion')} size='small' color='primary' />
                <Box className='flex-1'>
                  <Typography variant='body2' fontWeight={600}>
                    {t('dms.edit.dialog.versionLabel').replace('{version}', String((document.editCount || 0) + 1))}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {new Date(document.updatedAt).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {Array.from({ length: document.editCount || 0 }).map((_, index) => (
              <Box key={index} className='p-4 rounded border border-divider'>
                <Box className='flex items-center gap-3'>
                  <Chip label={`v${(document.editCount || 0) - index}`} size='small' variant='outlined' />
                  <Box className='flex-1'>
                    <Typography variant='body2' fontWeight={600}>
                      {t('dms.edit.dialog.versionLabel').replace('{version}', String((document.editCount || 0) - index))}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(document.uploadedAt).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US')}
                    </Typography>
                  </Box>
                  <IconButton size='small'>
                    <Icon icon='tabler-download' fontSize={20} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </TabPanel>

        {error && (
          <Alert severity='error' className='mt-4'>
            {error}
          </Alert>
        )}
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          {t('dms.common.cancel')}
        </Button>
        <Button
          variant='outlined'
          startIcon={<Icon icon='tabler-eye' />}
          onClick={handlePreview}
          disabled={previewing || !document.documentId}
        >
          {previewing ? t('dms.edit.dialog.opening') : t('dms.common.preview')}
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={saving || !changeNote.trim()}
          startIcon={saving ? <CircularProgress size={20} /> : <Icon icon='tabler-check' />}
        >
          {saving ? t('dms.edit.dialog.saving') : t('dms.edit.dialog.saveChanges')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentEditDialog
