'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import FileDropzone from '@/components/documents/FileDropzone'
import { useDictionary } from '@/hooks/useDictionary'
import type { UploadFormData } from '@/types/dms'
import DocumentMetadataForm from '@/views/upload/DocumentMetadataForm'
import { useUploadPage } from './_hooks/useUploadPage'

export default function UploadPage() {
  const { t } = useDictionary()
  const { state, actions } = useUploadPage(
    t('dms.upload.errors.selectAcademicYearDepartment'),
    t('dms.common.uploadFailed')
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box className='flex items-center justify-between'>
        <Box>
          <Typography variant='h4' className='mb-1'>{t('dms.upload.title')}</Typography>
          <Typography variant='body2' color='text.secondary'>{t('dms.upload.subtitle')}</Typography>
        </Box>
      </Box>

      {state.metadataError && (
        <Alert severity='error' onClose={() => actions.setMetadataError(null)}>
          {state.metadataError}
        </Alert>
      )}

      {state.uploadSummary && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert
            severity={state.uploadSummary.failed > 0 ? 'warning' : 'success'}
            onClose={() => actions.setUploadSummary(null)}
          >
            {t('dms.upload.summary', `${state.uploadSummary.success}/${state.uploadSummary.total}`)
              .replace('{success}', String(state.uploadSummary.success))
              .replace('{total}', String(state.uploadSummary.total))
              .replace('{failed}', String(state.uploadSummary.failed))}
          </Alert>

          {state.uploadSummary.failed > 0 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant='contained' size='small' onClick={actions.handleUpload} disabled={state.uploading}>
                {t('dms.upload.retryFailed')}
              </Button>
              <Button variant='outlined' size='small' onClick={actions.clearFailedFiles} disabled={state.uploading}>
                {t('dms.upload.clearFailed')}
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 6 }}>
        <Card>
          <CardHeader title={t('dms.upload.selectFiles')} />
          <CardContent>
            <FileDropzone
              files={state.files}
              onFilesSelected={actions.handleFilesSelected}
              onRemoveFile={actions.handleRemoveFile}
              onRenameFile={actions.handleRenameFile}
              maxFiles={30}
              maxSize={209715200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title={t('dms.upload.documentInfo')} />
          <CardContent>
            <DocumentMetadataForm
              formData={state.formData as Partial<UploadFormData>}
              onChange={actions.handleFormChange}
              disabled={state.uploading}
            />
            <Button
              fullWidth
              variant='contained'
              size='large'
              onClick={actions.handleUpload}
              disabled={!state.canUpload}
              sx={{ mt: 4 }}
            >
              {state.uploading
                ? t('dms.upload.uploading')
                : `${t('dms.upload.upload')} ${state.files.length} ${t('dms.common.file')}${state.files.length !== 1 ? 's' : ''}`}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
