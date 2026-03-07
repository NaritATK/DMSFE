'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import RoleGuard from '@/components/auth/RoleGuard'
import { useDictionary } from '@/hooks/useDictionary'
import { webhookService, type CreateWebhookDto, type Webhook } from '@/services/webhook.service'

const initialForm: CreateWebhookDto = {
  department: '',
  webhookUrl: '',
  events: [],
  headers: {},
  description: '',
  enabled: true,
}

export default function WebhooksPage() {
  const { t, locale } = useDictionary()
  const { data: session } = useSession()

  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [formData, setFormData] = useState<CreateWebhookDto>(initialForm)

  const token = (session as any)?.backendToken || (session as any)?.accessToken || ''

  const fetchWebhooks = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!session?.user?.email) throw new Error('No session')
      setWebhooks(await webhookService.getWebhooks(token))
    } catch (err: any) {
      console.error('Error fetching webhooks:', err)
      setError(err.response?.data?.error || err.message || t('dms.admin.webhooks.errors.fetch'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWebhooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email])

  const resetForm = () => {
    setFormData(initialForm)
    setSelectedWebhook(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (webhook: Webhook) => {
    setSelectedWebhook(webhook)
    setFormData({
      department: webhook.department,
      webhookUrl: webhook.webhookUrl,
      events: webhook.events || [],
      headers: webhook.headers || {},
      description: webhook.description,
      enabled: webhook.enabled,
    })
    setDialogOpen(true)
  }

  const handleSaveWebhook = async () => {
    try {
      if (!session?.user?.email) return

      if (selectedWebhook) {
        await webhookService.updateWebhook(token, selectedWebhook.webhookId, formData)
      } else {
        await webhookService.createWebhook(token, formData)
      }

      setDialogOpen(false)
      resetForm()
      await fetchWebhooks()
    } catch (err: any) {
      setError(err.response?.data?.error || t('dms.admin.webhooks.errors.save'))
    }
  }

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm(t('dms.admin.webhooks.confirmDelete'))) return

    try {
      if (!session?.user?.email) return
      await webhookService.deleteWebhook(token, id)
      await fetchWebhooks()
    } catch (err: any) {
      setError(err.response?.data?.error || t('dms.admin.webhooks.errors.delete'))
    }
  }

  const handleTestWebhook = async (id: string) => {
    try {
      if (!session?.user?.email) return
      const result = await webhookService.testWebhook(token, id)

      alert(
        `${t('dms.admin.webhooks.testResult')} ${result.success ? t('dms.admin.common.succeeded') : t('dms.admin.common.failed')}\n` +
        `${t('dms.admin.webhooks.status')}: ${result.status} ${result.statusText}`
      )
    } catch (err: any) {
      setError(err.response?.data?.error || t('dms.admin.webhooks.errors.test'))
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('dms.admin.common.never')

    return new Date(dateString).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <RoleGuard requiredRole='ADMIN'>
      <Card>
        <CardHeader
          title={t('dms.admin.webhooks.title')}
          subheader={t('dms.admin.webhooks.subheader')}
          avatar={<Icon icon='tabler-webhook' fontSize={24} />}
          action={
            <Button variant='contained' startIcon={<Icon icon='tabler-plus' />} onClick={openCreateDialog}>
              {t('dms.admin.webhooks.add')}
            </Button>
          }
        />

        <CardContent>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : webhooks.length === 0 ? (
            <Alert severity='info'>{t('dms.admin.webhooks.empty')}</Alert>
          ) : (
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('dms.common.department')}</TableCell>
                    <TableCell>{t('dms.admin.webhooks.webhookUrl')}</TableCell>
                    <TableCell>{t('dms.common.status')}</TableCell>
                    <TableCell>{t('dms.admin.webhooks.lastTriggered')}</TableCell>
                    <TableCell align='right'>{t('dms.common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {webhooks.map(webhook => (
                    <TableRow key={webhook.webhookId} hover>
                      <TableCell>
                        <Typography variant='subtitle2'>{webhook.department}</Typography>
                        {webhook.description && (
                          <Typography variant='caption' color='text.secondary'>
                            {webhook.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {webhook.webhookUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={webhook.enabled && webhook.isActive ? t('dms.admin.common.active') : t('dms.admin.common.inactive')}
                          size='small'
                          color={webhook.enabled && webhook.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{formatDate(webhook.lastTriggered)}</TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' onClick={() => handleTestWebhook(webhook.webhookId)} title={t('dms.admin.webhooks.test')}>
                          <Icon icon='tabler-send' />
                        </IconButton>
                        <IconButton size='small' onClick={() => openEditDialog(webhook)} title={t('dms.common.edit')}>
                          <Icon icon='tabler-edit' />
                        </IconButton>
                        <IconButton size='small' color='error' onClick={() => handleDeleteWebhook(webhook.webhookId)} title={t('dms.common.delete')}>
                          <Icon icon='tabler-trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>{selectedWebhook ? t('dms.admin.webhooks.edit') : t('dms.admin.webhooks.addNew')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('dms.common.department')}
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              required
              disabled={!!selectedWebhook}
              helperText={selectedWebhook ? t('dms.admin.webhooks.departmentFixed') : t('dms.admin.webhooks.departmentUnique')}
            />
            <TextField
              label={t('dms.admin.webhooks.webhookUrl')}
              value={formData.webhookUrl}
              onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })}
              required
              placeholder={t('dms.admin.webhooks.placeholders.url')}
            />
            <TextField
              label={t('dms.common.description')}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
            />
            <TextField
              label={t('dms.admin.webhooks.events')}
              value={Array.isArray(formData.events) ? formData.events.join(', ') : ''}
              onChange={e => setFormData({
                ...formData,
                events: e.target.value
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
              })}
              placeholder={t('dms.admin.webhooks.placeholders.events')}
              helperText={t('dms.admin.webhooks.eventsHelp')}
            />
            <FormControlLabel
              control={<Switch checked={formData.enabled} onChange={e => setFormData({ ...formData, enabled: e.target.checked })} />}
              label={t('dms.admin.webhooks.enabled')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('dms.common.cancel')}</Button>
          <Button onClick={handleSaveWebhook} variant='contained' disabled={!formData.department || !formData.webhookUrl}>
            {t('dms.common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </RoleGuard>
  )
}
