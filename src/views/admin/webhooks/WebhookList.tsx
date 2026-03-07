'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { WebhookConfig } from '@/types/dms'

interface WebhookListProps { webhooks: WebhookConfig[]; onEdit: (webhook: WebhookConfig) => void; onToggle: (webhookId: string) => void; onTest: (webhook: WebhookConfig) => void; onDelete: (webhookId: string) => void }

const WebhookList = ({ webhooks, onEdit, onToggle, onTest, onDelete }: WebhookListProps) => {
  const { t, locale } = useDictionary()
  const formatDate = (date: Date | string | null | undefined) => !date ? t('dms.admin.common.never') : new Date(date).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (webhooks.length === 0) return <Box className='flex flex-col items-center justify-center p-8'><Icon icon='tabler-webhook-off' fontSize={64} className='text-text-secondary mb-4' /><Typography variant='h6' color='text.secondary'>{t('dms.admin.webhooks.dialogs.empty.title')}</Typography><Typography variant='body2' color='text.secondary'>{t('dms.admin.webhooks.dialogs.empty.subtitle')}</Typography></Box>

  return <Box className='flex flex-col gap-4'>{webhooks.map(webhook => <Paper key={webhook.id} variant='outlined' className='p-4'><Grid container spacing={3} alignItems='center'>
    <Grid><Box><Box className='flex items-center gap-2 mb-1'><Typography variant='h6'>{webhook.department}</Typography><Chip label={webhook.enabled ? t('dms.admin.webhooks.enabled') : t('dms.admin.webhooks.dialogs.status.disabled')} size='small' color={webhook.enabled ? 'success' : 'default'} /></Box><Typography variant='caption' color='text.secondary'>{t('dms.admin.webhooks.lastTriggered')}: {formatDate(webhook.lastTriggered)}</Typography></Box></Grid>
    <Grid><Box><Typography variant='caption' color='text.secondary'>{t('dms.admin.webhooks.webhookUrl')}</Typography><Typography variant='body2' fontWeight={600} className='mt-1' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{webhook.webhookUrl}</Typography></Box></Grid>
    <Grid><Box><Typography variant='caption' color='text.secondary' className='mb-2'>{t('dms.admin.webhooks.events')} ({(webhook.events ?? []).length})</Typography><Box className='flex flex-wrap gap-1 mt-1'>{(webhook.events ?? []).map(event => <Chip key={event} label={event} size='small' variant='tonal' />)}</Box></Box></Grid>
    <Grid><Box className='flex items-center justify-end gap-1'><Tooltip title={webhook.enabled ? t('dms.admin.webhooks.dialogs.actions.disable') : t('dms.admin.webhooks.enabled')}><Switch checked={webhook.enabled} onChange={() => onToggle(webhook.id)} size='small' /></Tooltip><Tooltip title={t('dms.admin.webhooks.test')}><IconButton size='small' onClick={() => onTest(webhook)} disabled={!webhook.enabled}><Icon icon='tabler-play' fontSize={18} /></IconButton></Tooltip><Tooltip title={t('dms.common.edit')}><IconButton size='small' onClick={() => onEdit(webhook)}><Icon icon='tabler-edit' fontSize={18} /></IconButton></Tooltip><Tooltip title={t('dms.common.delete')}><IconButton size='small' onClick={() => onDelete(webhook.id)}><Icon icon='tabler-trash' fontSize={18} /></IconButton></Tooltip></Box></Grid>
  </Grid></Paper>)}</Box>
}

export default WebhookList
