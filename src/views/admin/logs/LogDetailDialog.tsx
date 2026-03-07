'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { ActivityLogExtended } from '@/types/dms'

interface LogDetailDialogProps { open: boolean; log: ActivityLogExtended; onClose: () => void }

const LogDetailDialog = ({ open, log, onClose }: LogDetailDialogProps) => {
  const { t, locale } = useDictionary()
  const formatTimestamp = (date: Date) => new Date(date).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })
  const getActionColor = (action: string) => ({ CREATE: 'success', UPDATE: 'warning', DELETE: 'error', UPLOAD: 'info', DOWNLOAD: 'primary' }[action] || 'default') as any
  const getActionIcon = (action: string) => ({ CREATE: 'tabler-plus', UPDATE: 'tabler-edit', DELETE: 'tabler-trash', UPLOAD: 'tabler-upload', DOWNLOAD: 'tabler-download' }[action] || 'tabler-point')

  return <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
    <DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{t('dms.admin.logs.dialogs.detailTitle')}</Typography><IconButton onClick={onClose} size='small'><Icon icon='tabler-x' /></IconButton></Box></DialogTitle>
    <Divider />
    <DialogContent><Box className='flex flex-col gap-6'>
      <Box className='flex items-center gap-3'><Chip label={log.action} size='medium' color={getActionColor(log.action)} icon={<Icon icon={getActionIcon(log.action)} />} /><Icon icon='tabler-arrow-right' fontSize={20} className='text-text-secondary' /><Chip label={log.resource} size='medium' variant='tonal' color='primary' /></Box>
      <Box><Typography variant='h6' className='mb-3'>{t('dms.admin.logs.dialogs.userInformation')}</Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}><Typography variant='caption' color='text.secondary'>{t('dms.common.name')}</Typography><Typography variant='body2' fontWeight={600} className='mt-1'>{log.userName}</Typography></Box>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}><Typography variant='caption' color='text.secondary'>{t('dms.common.email')}</Typography><Typography variant='body2' fontWeight={600} className='mt-1'>{log.userEmail}</Typography></Box>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}><Typography variant='caption' color='text.secondary'>{t('dms.admin.logs.ipAddress')}</Typography><Typography variant='body2' fontWeight={600} className='mt-1'>{log.ipAddress}</Typography></Box>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}><Typography variant='caption' color='text.secondary'>{t('dms.admin.logs.timestamp')}</Typography><Typography variant='body2' fontWeight={600} className='mt-1'>{log.timestamp ? formatTimestamp(log.timestamp) : '-'}</Typography></Box>
      </Box></Box>
      <Divider />
      <Box><Typography variant='h6' className='mb-3'>{t('dms.admin.logs.dialogs.resourceInformation')}</Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}><Typography variant='caption' color='text.secondary'>{t('dms.admin.logs.dialogs.resourceType')}</Typography><Typography variant='body2' fontWeight={600} className='mt-1'>{log.resource}</Typography></Box>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}><Typography variant='caption' color='text.secondary'>{t('dms.admin.logs.resourceId')}</Typography><Typography variant='body2' fontWeight={600} className='mt-1'>{log.resourceId || t('dms.admin.logs.dialogs.notAvailable')}</Typography></Box>
      </Box></Box>
      <Divider />
      <Box><Typography variant='h6' className='mb-3'>{t('dms.admin.logs.details')}</Typography><Paper variant='outlined' className='p-4'><pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(log.details, null, 2)}</pre></Paper></Box>
      <Box><Typography variant='h6' className='mb-2'>{t('dms.admin.logs.dialogs.userAgent')}</Typography><Paper variant='outlined' className='p-3'><Typography variant='body2' color='text.secondary' style={{ wordBreak: 'break-all' }}>{log.userAgent}</Typography></Paper></Box>
    </Box></DialogContent>
    <Divider />
    <DialogActions><Button onClick={onClose}>{t('dms.common.close')}</Button></DialogActions>
  </Dialog>
}

export default LogDetailDialog
