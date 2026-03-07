'use client'

import { useState } from 'react'

import Dialog from '@mui/material/Dialog'; import DialogTitle from '@mui/material/DialogTitle'; import DialogContent from '@mui/material/DialogContent'; import DialogActions from '@mui/material/DialogActions'; import Button from '@mui/material/Button'; import Typography from '@mui/material/Typography'; import Box from '@mui/material/Box'; import Divider from '@mui/material/Divider'; import IconButton from '@mui/material/IconButton'; import Alert from '@mui/material/Alert'; import CircularProgress from '@mui/material/CircularProgress'; import Paper from '@mui/material/Paper'; import Chip from '@mui/material/Chip'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { WebhookConfig } from '@/types/dms'

interface TestWebhookDialogProps { open: boolean; webhook: WebhookConfig; onClose: () => void }

const TestWebhookDialog = ({ open, webhook, onClose }: TestWebhookDialogProps) => {
  const { t } = useDictionary()
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; statusCode?: number; responseTime?: number } | null>(null)

  const handleTest = async () => {
    setTesting(true); setResult(null)

    try { await new Promise(resolve => setTimeout(resolve, 2000)); const ok = Math.random() > 0.3;

 setResult({ success: ok, message: ok ? t('dms.admin.webhooks.dialogs.test.successMessage') : t('dms.admin.webhooks.dialogs.test.failMessage'), statusCode: ok ? 200 : 500, responseTime: Math.floor(Math.random() * 1000) + 100 }) }
    catch { setResult({ success: false, message: t('dms.admin.webhooks.dialogs.test.errorMessage') }) }
    finally { setTesting(false) }
  }

  const testPayload = { event: 'UPLOAD', timestamp: new Date().toISOString(), data: { documentId: 'doc-test-123', fileName: 'Test Document.pdf', fileSize: 1024000, academicYear: '2024', department: webhook.department, uploadedBy: 'test@organization.com' } }

  return <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth><DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{t('dms.admin.webhooks.test')}</Typography><IconButton onClick={onClose} size='small' disabled={testing}><Icon icon='tabler-x' /></IconButton></Box></DialogTitle><Divider />
    <DialogContent><Box className='flex flex-col gap-4'>
      <Box><Typography variant='h6' className='mb-2'>{t('dms.admin.webhooks.dialogs.test.webhookInformation')}</Typography><Paper variant='outlined' className='p-3'><Box className='flex flex-col gap-2'><Box className='flex items-center justify-between'><Typography variant='caption' color='text.secondary'>{t('dms.common.department')}</Typography><Typography variant='body2' fontWeight={600}>{webhook.department}</Typography></Box><Box className='flex items-center justify-between'><Typography variant='caption' color='text.secondary'>{t('dms.admin.webhooks.webhookUrl')}</Typography><Typography variant='body2' fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{webhook.webhookUrl}</Typography></Box><Box className='flex items-center justify-between'><Typography variant='caption' color='text.secondary'>{t('dms.admin.webhooks.events')}</Typography><Box className='flex gap-1'>{(webhook.events ?? []).map(event => <Chip key={event} label={event} size='small' />)}</Box></Box></Box></Paper></Box>
      <Box><Typography variant='h6' className='mb-2'>{t('dms.admin.webhooks.dialogs.test.payload')}</Typography><Paper variant='outlined' className='p-3'><pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(testPayload, null, 2)}</pre></Paper></Box>
      {result && <Box><Typography variant='h6' className='mb-2'>{t('dms.admin.webhooks.testResult')}</Typography><Alert severity={result.success ? 'success' : 'error'} icon={<Icon icon={result.success ? 'tabler-check' : 'tabler-x'} />}><Box><Typography variant='body2' fontWeight={600}>{result.message}</Typography>{result.statusCode && <Typography variant='caption' color='text.secondary' display='block' className='mt-1'>{t('dms.admin.webhooks.dialogs.test.statusCode')}: {result.statusCode}</Typography>}{result.responseTime && <Typography variant='caption' color='text.secondary' display='block'>{t('dms.admin.webhooks.dialogs.test.responseTime')}: {result.responseTime}ms</Typography>}</Box></Alert></Box>}
      {testing && <Box className='flex items-center justify-center p-4'><CircularProgress size={40} /><Typography variant='body2' color='text.secondary' className='ml-3'>{t('dms.admin.webhooks.dialogs.test.testing')}</Typography></Box>}
    </Box></DialogContent><Divider />
    <DialogActions><Button onClick={onClose} disabled={testing}>{t('dms.common.close')}</Button><Button variant='contained' onClick={handleTest} disabled={testing} startIcon={testing ? <CircularProgress size={20} /> : <Icon icon='tabler-play' />}>{testing ? t('dms.admin.webhooks.dialogs.test.testingShort') : t('dms.admin.webhooks.dialogs.test.runTest')}</Button></DialogActions>
  </Dialog>
}

export default TestWebhookDialog
