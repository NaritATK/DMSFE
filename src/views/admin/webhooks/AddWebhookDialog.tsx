'use client'

import { useState } from 'react'

import Dialog from '@mui/material/Dialog'; import DialogTitle from '@mui/material/DialogTitle'; import DialogContent from '@mui/material/DialogContent'; import DialogActions from '@mui/material/DialogActions'; import Button from '@mui/material/Button'; import TextField from '@mui/material/TextField'; import Typography from '@mui/material/Typography'; import Box from '@mui/material/Box'; import Divider from '@mui/material/Divider'; import IconButton from '@mui/material/IconButton'; import FormControl from '@mui/material/FormControl'; import FormLabel from '@mui/material/FormLabel'; import FormGroup from '@mui/material/FormGroup'; import FormControlLabel from '@mui/material/FormControlLabel'; import Checkbox from '@mui/material/Checkbox'; import Alert from '@mui/material/Alert'; import CircularProgress from '@mui/material/CircularProgress'; import Autocomplete from '@mui/material/Autocomplete'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { WebhookConfig } from '@/types/dms'

interface AddWebhookDialogProps { open: boolean; onClose: () => void; onAdd: (webhook: Partial<WebhookConfig>) => Promise<void> }
const AVAILABLE_EVENTS = ['UPLOAD', 'UPDATE', 'DELETE', 'CREATE', 'DOWNLOAD']
const DEPARTMENTS = ['IT Department','Finance Department','HR Department','Marketing Department','Sales Department','Operations Department','Legal Department','R&D Department']

const AddWebhookDialog = ({ open, onClose, onAdd }: AddWebhookDialogProps) => {
  const { t } = useDictionary()
  const [department, setDepartment] = useState(''); const [webhookUrl, setWebhookUrl] = useState(''); const [events, setEvents] = useState<string[]>(['UPLOAD']); const [headers, setHeaders] = useState<Record<string, string>>({ 'Content-Type': 'application/json' }); const [headerKey, setHeaderKey] = useState(''); const [headerValue, setHeaderValue] = useState(''); const [saving, setSaving] = useState(false); const [error, setError] = useState<string | null>(null)

  const validateUrl = (url: string) => { try { new URL(url); 

return true } catch { return false } }

  const handleAdd = async () => {
    setError(null)
    if (!department.trim()) return setError(t('dms.admin.webhooks.dialogs.validation.departmentRequired'))
    if (!webhookUrl.trim()) return setError(t('dms.admin.webhooks.dialogs.validation.urlRequired'))
    if (!validateUrl(webhookUrl)) return setError(t('dms.admin.webhooks.dialogs.validation.urlInvalid'))
    if (events.length === 0) return setError(t('dms.admin.webhooks.dialogs.validation.eventRequired'))
    setSaving(true)

    try { await onAdd({ department: department.trim(), webhookUrl: webhookUrl.trim(), enabled: true, events, headers }); setDepartment(''); setWebhookUrl(''); setEvents(['UPLOAD']); setHeaders({ 'Content-Type': 'application/json' }) }
    catch (err) { console.error('Error adding webhook:', err); setError(t('dms.admin.webhooks.dialogs.errors.addFailed')) }
    finally { setSaving(false) }
  }

  return <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth><DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{t('dms.admin.webhooks.addNew')}</Typography><IconButton onClick={onClose} size='small' disabled={saving}><Icon icon='tabler-x' /></IconButton></Box></DialogTitle><Divider />
    <DialogContent><Box className='flex flex-col gap-4'>
      {error && <Alert severity='error' onClose={() => setError(null)}>{error}</Alert>}
      <Autocomplete options={DEPARTMENTS} value={department} onChange={(_, value) => setDepartment(value || '')} disabled={saving} renderInput={params => <TextField {...params} label={t('dms.common.department')} required />} />
      <TextField fullWidth label={t('dms.admin.webhooks.webhookUrl')} placeholder={t('dms.admin.webhooks.placeholders.url')} value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} required disabled={saving} helperText={t('dms.admin.webhooks.dialogs.helpers.url')} />
      <Divider />
      <FormControl component='fieldset'><FormLabel component='legend'>{t('dms.admin.webhooks.dialogs.fields.eventsToTrigger')}</FormLabel><FormGroup>{AVAILABLE_EVENTS.map(event => <FormControlLabel key={event} control={<Checkbox checked={events.includes(event)} onChange={() => setEvents(prev => prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event])} disabled={saving} />} label={event} />)}</FormGroup></FormControl>
      <Divider />
      <Box><FormLabel component='legend' className='mb-3'>{t('dms.admin.webhooks.dialogs.fields.customHeaders')}</FormLabel><Box className='flex flex-col gap-2 mb-3'>{Object.entries(headers).map(([key, value]) => <Box key={key} className='flex items-center gap-2 p-2 rounded bg-action-hover'><Typography variant='body2' fontWeight={600} className='flex-1'>{key}</Typography><Typography variant='body2' color='text.secondary' className='flex-1'>{value}</Typography><IconButton size='small' onClick={() => setHeaders(prev => { const n = { ...prev };

 delete n[key]; 

return n })} disabled={saving}><Icon icon='tabler-x' fontSize={16} /></IconButton></Box>)}</Box><Box className='flex gap-2'><TextField size='small' placeholder={t('dms.admin.webhooks.dialogs.placeholders.headerKey')} value={headerKey} onChange={e => setHeaderKey(e.target.value)} disabled={saving} /><TextField size='small' placeholder={t('dms.admin.webhooks.dialogs.placeholders.headerValue')} value={headerValue} onChange={e => setHeaderValue(e.target.value)} disabled={saving} /><Button variant='outlined' onClick={() => { if (!headerKey.trim() || !headerValue.trim()) return; setHeaders(prev => ({ ...prev, [headerKey.trim()]: headerValue.trim() })); setHeaderKey(''); setHeaderValue('') }} disabled={saving || !headerKey.trim() || !headerValue.trim()}>{t('navigation.add')}</Button></Box></Box>
    </Box></DialogContent><Divider />
    <DialogActions><Button onClick={onClose} disabled={saving}>{t('dms.common.cancel')}</Button><Button variant='contained' onClick={handleAdd} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <Icon icon='tabler-check' />}>{saving ? t('dms.admin.webhooks.dialogs.actions.adding') : t('dms.admin.webhooks.add')}</Button></DialogActions>
  </Dialog>
}

export default AddWebhookDialog
