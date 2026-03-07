'use client'

import { useState, useEffect, useMemo } from 'react'

import Dialog from '@mui/material/Dialog'; import DialogTitle from '@mui/material/DialogTitle'; import DialogContent from '@mui/material/DialogContent'; import DialogActions from '@mui/material/DialogActions'; import Button from '@mui/material/Button'; import TextField from '@mui/material/TextField'; import Typography from '@mui/material/Typography'; import Box from '@mui/material/Box'; import Divider from '@mui/material/Divider'; import IconButton from '@mui/material/IconButton'; import FormControl from '@mui/material/FormControl'; import FormLabel from '@mui/material/FormLabel'; import FormGroup from '@mui/material/FormGroup'; import FormControlLabel from '@mui/material/FormControlLabel'; import Checkbox from '@mui/material/Checkbox'; import Alert from '@mui/material/Alert'; import CircularProgress from '@mui/material/CircularProgress'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { WebhookConfig } from '@/types/dms'

interface EditWebhookDialogProps { open: boolean; webhook: WebhookConfig; onClose: () => void; onUpdate: (webhook: WebhookConfig) => Promise<void> }
const AVAILABLE_EVENTS = ['UPLOAD', 'UPDATE', 'DELETE', 'CREATE', 'DOWNLOAD']

const EditWebhookDialog = ({ open, webhook, onClose, onUpdate }: EditWebhookDialogProps) => {
  const { t } = useDictionary()

  const normalizedWebhook: WebhookConfig = useMemo(
    () => ({ ...webhook, events: webhook.events ?? [], headers: webhook.headers ?? {} }),
    [webhook]
  )

  const [formData, setFormData] = useState<WebhookConfig>(normalizedWebhook)
  const [headerKey, setHeaderKey] = useState(''); const [headerValue, setHeaderValue] = useState(''); const [saving, setSaving] = useState(false); const [error, setError] = useState<string | null>(null)

  useEffect(() => { setFormData(normalizedWebhook); setError(null) }, [normalizedWebhook])

  const validateUrl = (url: string) => { try { new URL(url); 

return true } catch { return false } }

  const handleUpdate = async () => { setError(null); if (!formData.webhookUrl.trim()) return setError(t('dms.admin.webhooks.dialogs.validation.urlRequired')); if (!validateUrl(formData.webhookUrl)) return setError(t('dms.admin.webhooks.dialogs.validation.urlInvalid')); if ((formData.events ?? []).length === 0) return setError(t('dms.admin.webhooks.dialogs.validation.eventRequired')); setSaving(true); try { await onUpdate(formData) } catch (err) { console.error('Error updating webhook:', err); setError(t('dms.admin.webhooks.dialogs.errors.updateFailed')) } finally { setSaving(false) } }

  return <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth><DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{t('dms.admin.webhooks.edit')}</Typography><IconButton onClick={onClose} size='small' disabled={saving}><Icon icon='tabler-x' /></IconButton></Box></DialogTitle><Divider />
    <DialogContent><Box className='flex flex-col gap-4'>
      {error && <Alert severity='error' onClose={() => setError(null)}>{error}</Alert>}
      <TextField fullWidth label={t('dms.common.department')} value={formData.department} disabled helperText={t('dms.admin.webhooks.departmentFixed')} />
      <TextField fullWidth label={t('dms.admin.webhooks.webhookUrl')} value={formData.webhookUrl} onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })} required disabled={saving} />
      <Divider />
      <FormControl component='fieldset'><FormLabel component='legend'>{t('dms.admin.webhooks.dialogs.fields.eventsToTrigger')}</FormLabel><FormGroup>{AVAILABLE_EVENTS.map(event => <FormControlLabel key={event} control={<Checkbox checked={(formData.events ?? []).includes(event)} onChange={() => setFormData(prev => ({ ...prev, events: (prev.events ?? []).includes(event) ? (prev.events ?? []).filter(e => e !== event) : [...(prev.events ?? []), event] }))} disabled={saving} />} label={event} />)}</FormGroup></FormControl>
      <Divider />
      <Box><FormLabel component='legend' className='mb-3'>{t('dms.admin.webhooks.dialogs.fields.customHeaders')}</FormLabel><Box className='flex flex-col gap-2 mb-3'>{Object.entries(formData.headers ?? {}).map(([key, value]) => <Box key={key} className='flex items-center gap-2 p-2 rounded bg-action-hover'><Typography variant='body2' fontWeight={600} className='flex-1'>{key}</Typography><Typography variant='body2' color='text.secondary' className='flex-1'>{value}</Typography><IconButton size='small' onClick={() => setFormData(prev => { const h = { ...(prev.headers ?? {}) };

 delete h[key]; 

return { ...prev, headers: h } })} disabled={saving}><Icon icon='tabler-x' fontSize={16} /></IconButton></Box>)}</Box><Box className='flex gap-2'><TextField size='small' placeholder={t('dms.admin.webhooks.dialogs.placeholders.headerKey')} value={headerKey} onChange={e => setHeaderKey(e.target.value)} disabled={saving} /><TextField size='small' placeholder={t('dms.admin.webhooks.dialogs.placeholders.headerValue')} value={headerValue} onChange={e => setHeaderValue(e.target.value)} disabled={saving} /><Button variant='outlined' onClick={() => { if (!headerKey.trim() || !headerValue.trim()) return; setFormData(prev => ({ ...prev, headers: { ...(prev.headers ?? {}), [headerKey.trim()]: headerValue.trim() } })); setHeaderKey(''); setHeaderValue('') }} disabled={saving || !headerKey.trim() || !headerValue.trim()}>{t('navigation.add')}</Button></Box></Box>
    </Box></DialogContent><Divider />
    <DialogActions><Button onClick={onClose} disabled={saving}>{t('dms.common.cancel')}</Button><Button variant='contained' onClick={handleUpdate} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <Icon icon='tabler-check' />}>{saving ? t('dms.admin.webhooks.dialogs.actions.updating') : t('dms.admin.webhooks.dialogs.actions.updateWebhook')}</Button></DialogActions>
  </Dialog>
}

export default EditWebhookDialog
