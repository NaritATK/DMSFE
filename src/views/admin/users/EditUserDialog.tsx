'use client'

import { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'; import DialogTitle from '@mui/material/DialogTitle'; import DialogContent from '@mui/material/DialogContent'; import DialogActions from '@mui/material/DialogActions'; import Button from '@mui/material/Button'; import TextField from '@mui/material/TextField'; import Typography from '@mui/material/Typography'; import Box from '@mui/material/Box'; import Divider from '@mui/material/Divider'; import IconButton from '@mui/material/IconButton'; import FormControl from '@mui/material/FormControl'; import FormLabel from '@mui/material/FormLabel'; import RadioGroup from '@mui/material/RadioGroup'; import FormControlLabel from '@mui/material/FormControlLabel'; import Radio from '@mui/material/Radio'; import FormGroup from '@mui/material/FormGroup'; import Checkbox from '@mui/material/Checkbox'; import Alert from '@mui/material/Alert'; import CircularProgress from '@mui/material/CircularProgress'; import Chip from '@mui/material/Chip'
import { Icon } from '@iconify/react'

import { useActivityLog } from '@/hooks/useActivityLog'
import { useDictionary } from '@/hooks/useDictionary'
import type { UserWithPermissions, Role } from '@/types/dms'

interface EditUserDialogProps { open: boolean; user: UserWithPermissions; onClose: () => void; onUpdate: (user: UserWithPermissions) => Promise<void> }
const AVAILABLE_MENUS = [{ id: 'dashboard', label: 'Dashboard', icon: 'tabler-layout-dashboard' },{ id: 'upload', label: 'Upload', icon: 'tabler-upload' },{ id: 'edit', label: 'Edit', icon: 'tabler-edit' },{ id: 'history', label: 'History', icon: 'tabler-history' },{ id: 'users', label: 'Users', icon: 'tabler-users', adminOnly: true },{ id: 'menus', label: 'Menus', icon: 'tabler-menu-2', adminOnly: true },{ id: 'logs', label: 'Logs', icon: 'tabler-file-text', adminOnly: true },{ id: 'webhooks', label: 'Webhooks', icon: 'tabler-webhook', adminOnly: true }]

const EditUserDialog = ({ open, user, onClose, onUpdate }: EditUserDialogProps) => {
  const { t } = useDictionary(); const { logActivity } = useActivityLog()
  const [formData, setFormData] = useState(user); const [saving, setSaving] = useState(false); const [error, setError] = useState<string | null>(null)

  useEffect(() => { setFormData(user); setError(null) }, [user])
  const menuLabel = (id: string) => t(`dms.admin.users.dialogs.menus.${id}`)

  const handleRoleChange = (newRole: Role) => { const updated = { ...formData, role: newRole };

 if (newRole === 'ADMIN') { updated.permissions = { canUpload: true, canEdit: true, canDelete: true, canViewLogs: true, canManageUsers: true, canManageMenus: true, canConfigureWebhooks: true }; updated.menuAccess = AVAILABLE_MENUS.map(m => m.id) } setFormData(updated) }

  const handleUpdate = async () => {
    setError(null)
    if (!formData.name?.trim()) return setError(t('dms.admin.users.dialogs.validation.nameRequired'))
    if (formData.menuAccess?.length === 0) return setError(t('dms.admin.users.dialogs.validation.menuRequired'))
    setSaving(true)

    try { await onUpdate(formData); await logActivity({ action: 'UPDATE', resource: 'USER', resourceId: user.id, details: { email: user.email, changes: { role: formData.role !== user.role, permissions: JSON.stringify(formData.permissions) !== JSON.stringify(user.permissions), menuAccess: JSON.stringify(formData.menuAccess) !== JSON.stringify(user.menuAccess) } } }) }
    catch (err) { console.error('Error updating user:', err); setError(t('dms.admin.users.dialogs.errors.updateFailed')) }
    finally { setSaving(false) }
  }

  const availableMenus = AVAILABLE_MENUS.filter(menu => !menu.adminOnly || formData.role === 'ADMIN')

  return <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth><DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{t('dms.admin.users.dialogs.editTitle')}</Typography><IconButton onClick={onClose} size='small' disabled={saving}><Icon icon='tabler-x' /></IconButton></Box></DialogTitle><Divider />
    <DialogContent><Box className='flex flex-col gap-6'>
      {error && <Alert severity='error' onClose={() => setError(null)}>{error}</Alert>}
      <TextField fullWidth label={t('dms.admin.users.dialogs.fields.emailAddress')} value={formData.email} disabled helperText={t('dms.admin.users.dialogs.helpers.emailReadonly')} />
      <TextField fullWidth label={t('dms.admin.users.dialogs.fields.fullName')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required disabled={saving} />
      <FormControl component='fieldset'><FormLabel component='legend'>{t('dms.admin.users.role')}</FormLabel><RadioGroup value={formData.role} onChange={e => handleRoleChange(e.target.value as Role)}><FormControlLabel value='STAFF' control={<Radio />} label={<Box><Typography variant='body2' fontWeight={600}>STAFF</Typography><Typography variant='caption' color='text.secondary'>{t('dms.admin.users.standardUserAccess')}</Typography></Box>} disabled={saving} /><FormControlLabel value='ADMIN' control={<Radio />} label={<Box><Typography variant='body2' fontWeight={600}>ADMIN</Typography><Typography variant='caption' color='text.secondary'>{t('dms.admin.users.fullSystemAccess')}</Typography></Box>} disabled={saving} /></RadioGroup></FormControl>
      <Divider />
      <FormControl component='fieldset'><FormLabel component='legend'>{t('dms.admin.users.dialogs.fields.permissions')}</FormLabel><FormGroup>
        {(['canUpload','canEdit','canDelete','canViewLogs'] as const).map(p => <FormControlLabel key={p} control={<Checkbox checked={!!formData.permissions?.[p]} onChange={() => setFormData(prev => ({ ...prev, permissions: { ...prev.permissions, [p]: !(prev.permissions?.[p] as boolean) } }))} disabled={saving} />} label={t(`dms.admin.users.dialogs.permissions.${p}`)} />)}
        {formData.role === 'ADMIN' && (['canManageUsers','canManageMenus','canConfigureWebhooks'] as const).map(p => <FormControlLabel key={p} control={<Checkbox checked={!!formData.permissions?.[p]} onChange={() => setFormData(prev => ({ ...prev, permissions: { ...prev.permissions, [p]: !(prev.permissions?.[p] as boolean) } }))} disabled={saving} />} label={t(`dms.admin.users.dialogs.permissions.${p}`)} />)}
      </FormGroup></FormControl>
      <Divider />
      <Box><FormLabel component='legend' className='mb-3'>{t('dms.admin.users.dialogs.fields.menuAccess')}</FormLabel><Box className='flex flex-wrap gap-2'>{availableMenus.map(menu => <Chip key={menu.id} icon={<Icon icon={menu.icon} />} label={menuLabel(menu.id)} onClick={() => setFormData(prev => ({ ...prev, menuAccess: prev.menuAccess?.includes(menu.id) ? prev.menuAccess.filter(id => id !== menu.id) : [...(prev.menuAccess || []), menu.id] }))} color={formData.menuAccess?.includes(menu.id) ? 'primary' : 'default'} variant={formData.menuAccess?.includes(menu.id) ? 'filled' : 'outlined'} disabled={saving} />)}</Box></Box>
    </Box></DialogContent><Divider />
    <DialogActions><Button onClick={onClose} disabled={saving}>{t('dms.common.cancel')}</Button><Button variant='contained' onClick={handleUpdate} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <Icon icon='tabler-check' />}>{saving ? t('dms.admin.users.dialogs.actions.updating') : t('dms.admin.users.dialogs.actions.updateUser')}</Button></DialogActions>
  </Dialog>
}

export default EditUserDialog
