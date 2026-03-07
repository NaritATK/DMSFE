'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { EligibilityPreviewRow } from '@/types/admin/review-queue'

type Props = {
  open: boolean
  loading: boolean
  saving: boolean
  title: string
  rows: EligibilityPreviewRow[]
  addedCount: number
  updatedCount: number
  removedCount: number
  error?: string | null
  onClose: () => void
  onAddRow: () => void
  onRemoveRow: (idx: number) => void
  onUpdateRow: (idx: number, patch: Partial<EligibilityPreviewRow>) => void
  onSave: () => void
}

export default function EligibilityEditorDialog({
  open,
  loading,
  saving,
  title,
  rows,
  addedCount,
  updatedCount,
  removedCount,
  error,
  onClose,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onSave,
}: Props) {
  const { t } = useDictionary()
  const dialogTitle = t('dms.admin.reviewQueue.editor.title').replace('{title}', title)
  const addedText = t('dms.admin.reviewQueue.editor.added').replace('{count}', String(addedCount))
  const updatedText = t('dms.admin.reviewQueue.editor.updated').replace('{count}', String(updatedCount))
  const removedText = t('dms.admin.reviewQueue.editor.removed').replace('{count}', String(removedCount))

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {!!error && <Alert severity='error' sx={{ mb: 1.5 }}>{error}</Alert>}
        {!loading && (
          <Stack direction='row' spacing={1} sx={{ mb: 1.5 }}>
            <Chip size='small' color='success' variant='outlined' label={addedText} />
            <Chip size='small' color='warning' variant='outlined' label={updatedText} />
            <Chip size='small' color='error' variant='outlined' label={removedText} />
          </Stack>
        )}

        {loading ? (
          <Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {rows.map((row, idx) => (
              <Stack key={idx} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems='center'>
                <TextField
                  size='small'
                  label={t('dms.admin.reviewQueue.editor.fields.code')}
                  value={row.programCode || ''}
                  onChange={e => onUpdateRow(idx, { programCode: e.target.value })}
                  sx={{ width: 110 }}
                />
                <TextField
                  size='small'
                  label={t('dms.admin.reviewQueue.editor.fields.faculty')}
                  value={row.facultyName || ''}
                  onChange={e => onUpdateRow(idx, { facultyName: e.target.value })}
                  sx={{ width: 220 }}
                />
                <TextField
                  size='small'
                  label={t('dms.admin.reviewQueue.editor.fields.programName')}
                  value={row.programName || ''}
                  onChange={e => onUpdateRow(idx, { programName: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size='small'
                  label={t('dms.admin.reviewQueue.editor.fields.minGpa')}
                  value={row.minGpa ?? ''}
                  onChange={e => onUpdateRow(idx, { minGpa: e.target.value === '' ? null : Number(e.target.value) })}
                  disabled={row.noMinGpa}
                  sx={{ width: 120 }}
                />
                <Stack direction='row' spacing={0.5} alignItems='center'>
                  <Typography variant='caption'>{t('dms.admin.reviewQueue.editor.fields.noMin')}</Typography>
                  <Switch
                    checked={Boolean(row.noMinGpa)}
                    onChange={e => onUpdateRow(idx, { noMinGpa: e.target.checked, minGpa: e.target.checked ? null : row.minGpa })}
                  />
                </Stack>
                <Button color='error' onClick={() => onRemoveRow(idx)}>
                  {t('dms.admin.reviewQueue.editor.remove')}
                </Button>
              </Stack>
            ))}
            <Box>
              <Button variant='outlined' startIcon={<Icon icon='tabler-plus' />} onClick={onAddRow}>
                {t('dms.admin.reviewQueue.editor.addRow')}
              </Button>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>{t('dms.common.cancel')}</Button>
        <Button onClick={onSave} variant='contained' disabled={saving || loading}>
          {saving ? t('dms.admin.common.saving') : t('dms.admin.reviewQueue.editor.saveResolve')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
