'use client'

import { useState } from 'react'

import Dialog from '@mui/material/Dialog'; import DialogTitle from '@mui/material/DialogTitle'; import DialogContent from '@mui/material/DialogContent'; import DialogActions from '@mui/material/DialogActions'; import Button from '@mui/material/Button'; import TextField from '@mui/material/TextField'; import Typography from '@mui/material/Typography'; import Box from '@mui/material/Box'; import Divider from '@mui/material/Divider'; import IconButton from '@mui/material/IconButton'; import FormControl from '@mui/material/FormControl'; import FormLabel from '@mui/material/FormLabel'; import RadioGroup from '@mui/material/RadioGroup'; import FormControlLabel from '@mui/material/FormControlLabel'; import Radio from '@mui/material/Radio'; import FormGroup from '@mui/material/FormGroup'; import Checkbox from '@mui/material/Checkbox'; import Alert from '@mui/material/Alert'; import CircularProgress from '@mui/material/CircularProgress'; import Chip from '@mui/material/Chip'
import { Icon } from '@iconify/react'

import { useActivityLog } from '@/hooks/useActivityLog'
import { useDictionary } from '@/hooks/useDictionary'
import type { UserWithPermissions, Role } from '@/types/dms'

interface AddUserDialogProps { open: boolean; onClose: () => void; onAdd: (user: Partial<UserWithPermissions>) => Promise<void> }
const AVAILABLE_MENUS = [{ id: 'dashboard', label: 'Dashboard', icon: 'tabler-layout-dashboard' },{ id: 'upload', label: 'Upload', icon: 'tabler-upload' },{ id: 'edit', label: 'Edit', icon: 'tabler-edit' },{ id: 'history', label: 'History', icon: 'tabler-history' },{ id: 'users', label: 'Users', icon: 'tabler-users', adminOnly: true },{ id: 'menus', label: 'Menus', icon: 'tabler-menu-2', adminOnly: true },{ id: 'logs', label: 'Logs', icon: 'tabler-file-text', adminOnly: true },{ id: 'webhooks', label: 'Webhooks', icon: 'tabler-webhook', adminOnly: true }]

const AddUserDialog = ({ open, onClose, onAdd }: AddUserDialogProps) => {
  const { t } = useDictionary(); const { logActivity } = useActivityLog()
  const [email, setEmail] = useState(''); const [name, setName] = useState(''); const [role, setRole] = useState<Role>('STAFF'); const [permissions, setPermissions] = useState({ canUpload: true, canEdit: false, canDelete: false, canViewLogs: false, canManageUsers: false, canManageMenus: false, canConfigureWebhooks: false }); const [menuAccess, setMenuAccess] = useState<string[]>(['dashboard']); const [saving, setSaving] = useState(false); const [error, setError] = useState<string | null>(null)
  const menuLabel = (id: string) => t(`dms.admin.users.dialogs.menus.${id}`)

  const handleRoleChange = (newRole: Role) => { setRole(newRole); if (newRole === 'ADMIN') { setPermissions({ canUpload: true, canEdit: true, canDelete: true, canViewLogs: true, canManageUsers: true, canManageMenus: true, canConfigureWebhooks: true }); setMenuAccess(AVAILABLE_MENUS.map(m => m.id)) } else { setPermissions({ canUpload: true, canEdit: false, canDelete: false, canViewLogs: false, canManageUsers: false, canManageMenus: false, canConfigureWebhooks: false }); setMenuAccess(['dashboard', 'upload']) } }
  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleAdd = async () => {
    setError(null)
    if (!email.trim()) return setError(t('dms.admin.users.dialogs.validation.emailRequired'))
    if (!validateEmail(email)) return setError(t('dms.admin.users.dialogs.validation.emailInvalid'))
    if (!name.trim()) return setError(t('dms.admin.users.dialogs.validation.nameRequired'))
    if (menuAccess.length === 0) return setError(t('dms.admin.users.dialogs.validation.menuRequired'))
    setSaving(true)

    try { await onAdd({ email: email.trim(), name: name.trim(), role, permissions, menuAccess }); await logActivity({ action: 'CREATE', resource: 'USER', details: { email: email.trim(), role, menuAccess: menuAccess.length } }); setEmail(''); setName(''); setRole('STAFF'); setPermissions({ canUpload: true, canEdit: false, canDelete: false, canViewLogs: false, canManageUsers: false, canManageMenus: false, canConfigureWebhooks: false }); setMenuAccess(['dashboard']) }
    catch (err) { console.error('Error adding user:', err); setError(t('dms.admin.users.dialogs.errors.addFailed')) }
    finally { setSaving(false) }
  }

  const availableMenus = AVAILABLE_MENUS.filter(menu => !menu.adminOnly || role === 'ADMIN')

  return <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth><DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{t('dms.admin.users.dialogs.addTitle')}</Typography><IconButton onClick={onClose} size='small' disabled={saving}><Icon icon='tabler-x' /></IconButton></Box></DialogTitle><Divider />
    <DialogContent><Box className='flex flex-col gap-6'>
      {error && <Alert severity='error' onClose={() => setError(null)}>{error}</Alert>}
      <TextField fullWidth label={t('dms.admin.users.dialogs.fields.emailAddress')} placeholder={t('dms.admin.users.dialogs.placeholders.emailExample')} value={email} onChange={e => setEmail(e.target.value)} required disabled={saving} helperText={t('dms.admin.users.dialogs.helpers.signInEmail')} />
      <TextField fullWidth label={t('dms.admin.users.dialogs.fields.fullName')} placeholder={t('dms.admin.users.dialogs.placeholders.fullNameExample')} value={name} onChange={e => setName(e.target.value)} required disabled={saving} />
      <FormControl component='fieldset'><FormLabel component='legend'>{t('dms.admin.users.role')}</FormLabel><RadioGroup value={role} onChange={e => handleRoleChange(e.target.value as Role)}><FormControlLabel value='STAFF' control={<Radio />} label={<Box><Typography variant='body2' fontWeight={600}>STAFF</Typography><Typography variant='caption' color='text.secondary'>{t('dms.admin.users.standardUserAccess')}</Typography></Box>} disabled={saving} /><FormControlLabel value='ADMIN' control={<Radio />} label={<Box><Typography variant='body2' fontWeight={600}>ADMIN</Typography><Typography variant='caption' color='text.secondary'>{t('dms.admin.users.fullSystemAccess')}</Typography></Box>} disabled={saving} /></RadioGroup></FormControl>
      <Divider />
      <FormControl component='fieldset'><FormLabel component='legend'>{t('dms.admin.users.dialogs.fields.permissions')}</FormLabel><FormGroup>
        {(['canUpload','canEdit','canDelete','canViewLogs'] as const).map(p => <FormControlLabel key={p} control={<Checkbox checked={permissions[p]} onChange={() => setPermissions(prev => ({ ...prev, [p]: !prev[p] }))} disabled={saving} />} label={t(`dms.admin.users.dialogs.permissions.${p}`)} />)}
        {role === 'ADMIN' && (['canManageUsers','canManageMenus','canConfigureWebhooks'] as const).map(p => <FormControlLabel key={p} control={<Checkbox checked={permissions[p]} onChange={() => setPermissions(prev => ({ ...prev, [p]: !prev[p] }))} disabled={saving} />} label={t(`dms.admin.users.dialogs.permissions.${p}`)} />)}
      </FormGroup></FormControl>
      <Divider />
      <Box><FormLabel component='legend' className='mb-3'>{t('dms.admin.users.dialogs.fields.menuAccess')}</FormLabel><Box className='flex flex-wrap gap-2'>{availableMenus.map(menu => <Chip key={menu.id} icon={<Icon icon={menu.icon} />} label={menuLabel(menu.id)} onClick={() => setMenuAccess(prev => prev.includes(menu.id) ? prev.filter(id => id !== menu.id) : [...prev, menu.id])} color={menuAccess.includes(menu.id) ? 'primary' : 'default'} variant={menuAccess.includes(menu.id) ? 'filled' : 'outlined'} disabled={saving} />)}</Box></Box>
    </Box></DialogContent><Divider />
    <DialogActions><Button onClick={onClose} disabled={saving}>{t('dms.common.cancel')}</Button><Button variant='contained' onClick={handleAdd} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <Icon icon='tabler-check' />}>{saving ? t('dms.admin.users.dialogs.actions.adding') : t('dms.admin.users.dialogs.actions.addUser')}</Button></DialogActions>
  </Dialog>
}

export default AddUserDialog
