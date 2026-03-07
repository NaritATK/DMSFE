'use client'

import { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { MenuNode, Role } from '@/types/dms'

interface EditMenuDialogProps { open: boolean; menu: MenuNode; onClose: () => void; onUpdate: (menu: MenuNode) => Promise<void> }
const AVAILABLE_ICONS = ['tabler-layout-dashboard','tabler-file','tabler-upload','tabler-edit','tabler-history','tabler-users','tabler-menu-2','tabler-file-text','tabler-webhook','tabler-shield-check','tabler-settings','tabler-chart-bar','tabler-folder','tabler-database','tabler-bell','tabler-mail','tabler-calendar','tabler-report']

const EditMenuDialog = ({ open, menu, onClose, onUpdate }: EditMenuDialogProps) => {
  const { t } = useDictionary()
  const [formData, setFormData] = useState(menu)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setFormData(menu); setError(null) }, [menu])

  const handleUpdate = async () => {
    setError(null)
    if (!formData.title?.trim()) return setError(t('dms.admin.menus.dialogs.validation.titleRequired'))
    if (formData.visibleFor?.length === 0) return setError(t('dms.admin.menus.dialogs.validation.roleRequired'))
    setSaving(true)
    try { await onUpdate(formData) } catch (err) { console.error('Error updating menu:', err); setError(t('dms.admin.menus.dialogs.errors.updateFailed')) } finally { setSaving(false) }
  }

  const toggleRole = (role: Role) => setFormData(prev => ({ ...prev, visibleFor: prev.visibleFor?.includes(role) ? prev.visibleFor.filter(r => r !== role) : [...(prev.visibleFor || []), role] }))

  return <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
    <DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{t('dms.admin.menus.edit')}</Typography><IconButton onClick={onClose} size='small' disabled={saving}><Icon icon='tabler-x' /></IconButton></Box></DialogTitle>
    <Divider />
    <DialogContent><Box className='flex flex-col gap-4'>
      {error && <Alert severity='error' onClose={() => setError(null)}>{error}</Alert>}
      <TextField fullWidth label={t('dms.admin.menus.dialogs.fields.menuTitle')} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required disabled={saving} />
      <Autocomplete options={AVAILABLE_ICONS} value={formData.icon || ''} onChange={(_, value) => setFormData({ ...formData, icon: value || undefined })} disabled={saving} renderInput={params => <TextField {...params} label={t('dms.admin.menus.dialogs.fields.iconOptional')} />} renderOption={(props, option) => <li {...props}><Box className='flex items-center gap-2'><Icon icon={option} fontSize={20} /><Typography variant='body2'>{option}</Typography></Box></li>} />
      {formData.icon && <Box className='flex items-center gap-2 p-3 rounded bg-action-hover'><Icon icon={formData.icon} fontSize={24} /><Typography variant='body2'>{t('dms.admin.menus.dialogs.preview')}</Typography></Box>}
      <TextField fullWidth label={t('dms.admin.menus.dialogs.fields.pathOptional')} value={formData.path || ''} onChange={e => setFormData({ ...formData, path: e.target.value || undefined })} disabled={saving} helperText={t('dms.admin.menus.dialogs.helpers.path')} />
      <TextField fullWidth type='number' label={t('dms.admin.menus.dialogs.fields.displayOrder')} value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 999 })} disabled={saving} helperText={t('dms.admin.menus.dialogs.helpers.displayOrder')} />
      <Divider />
      <FormControl component='fieldset'><FormLabel component='legend'>{t('dms.admin.menus.dialogs.fields.visibleForRoles')}</FormLabel><Box className='flex gap-2 mt-2'><Chip label='STAFF' icon={<Icon icon='tabler-user' />} onClick={() => toggleRole('STAFF')} color={formData.visibleFor?.includes('STAFF') ? 'primary' : 'default'} variant={formData.visibleFor?.includes('STAFF') ? 'filled' : 'outlined'} disabled={saving} /><Chip label='ADMIN' icon={<Icon icon='tabler-shield-check' />} onClick={() => toggleRole('ADMIN')} color={formData.visibleFor?.includes('ADMIN') ? 'error' : 'default'} variant={formData.visibleFor?.includes('ADMIN') ? 'filled' : 'outlined'} disabled={saving} /></Box></FormControl>
    </Box></DialogContent>
    <Divider />
    <DialogActions><Button onClick={onClose} disabled={saving}>{t('dms.common.cancel')}</Button><Button variant='contained' onClick={handleUpdate} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <Icon icon='tabler-check' />}>{saving ? t('dms.admin.menus.dialogs.actions.updating') : t('dms.admin.menus.dialogs.actions.updateMenu')}</Button></DialogActions>
  </Dialog>
}

export default EditMenuDialog
