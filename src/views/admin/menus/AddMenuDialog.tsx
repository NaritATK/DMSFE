'use client'

import { useState } from 'react'

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

interface AddMenuDialogProps {
  open: boolean
  parentMenu?: MenuNode | null
  onClose: () => void
  onAdd: (menu: Partial<MenuNode>) => Promise<void>
}

const AVAILABLE_ICONS = ['tabler-layout-dashboard','tabler-file','tabler-upload','tabler-edit','tabler-history','tabler-users','tabler-menu-2','tabler-file-text','tabler-webhook','tabler-shield-check','tabler-settings','tabler-chart-bar','tabler-folder','tabler-database','tabler-bell','tabler-mail','tabler-calendar','tabler-report']

const AddMenuDialog = ({ open, parentMenu, onClose, onAdd }: AddMenuDialogProps) => {
  const { t } = useDictionary()
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState<string>('')
  const [path, setPath] = useState('')
  const [order, setOrder] = useState<number>(999)
  const [visibleFor, setVisibleFor] = useState<Role[]>(['STAFF', 'ADMIN'])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    setError(null)
    if (!title.trim()) return setError(t('dms.admin.menus.dialogs.validation.titleRequired'))
    if (visibleFor.length === 0) return setError(t('dms.admin.menus.dialogs.validation.roleRequired'))

    setSaving(true)

    try {
      await onAdd({ title: title.trim(), icon: icon || undefined, path: path.trim() || undefined, order, visibleFor, parentId: parentMenu?.id })
      setTitle(''); setIcon(''); setPath(''); setOrder(999); setVisibleFor(['STAFF', 'ADMIN'])
    } catch (err) {
      console.error('Error adding menu:', err)
      setError(t('dms.admin.menus.dialogs.errors.addFailed'))
    } finally { setSaving(false) }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle><Box className='flex items-center justify-between'><Typography variant='h5'>{parentMenu ? `${t('dms.admin.menus.dialogs.addChildTitle')} "${parentMenu.title}"` : t('dms.admin.menus.addNew')}</Typography><IconButton onClick={onClose} size='small' disabled={saving}><Icon icon='tabler-x' /></IconButton></Box></DialogTitle>
      <Divider />
      <DialogContent>
        <Box className='flex flex-col gap-4'>
          {error && <Alert severity='error' onClose={() => setError(null)}>{error}</Alert>}
          {parentMenu && <Alert severity='info' icon={<Icon icon='tabler-info-circle' />}>{t('dms.admin.menus.dialogs.childInfo')} <strong>{parentMenu.title}</strong></Alert>}
          <TextField fullWidth label={t('dms.admin.menus.dialogs.fields.menuTitle')} placeholder={t('dms.admin.menus.dialogs.placeholders.menuTitle')} value={title} onChange={e => setTitle(e.target.value)} required disabled={saving} />
          <Autocomplete options={AVAILABLE_ICONS} value={icon} onChange={(_, value) => setIcon(value || '')} disabled={saving} renderInput={params => <TextField {...params} label={t('dms.admin.menus.dialogs.fields.iconOptional')} />} renderOption={(props, option) => <li {...props}><Box className='flex items-center gap-2'><Icon icon={option} fontSize={20} /><Typography variant='body2'>{option}</Typography></Box></li>} />
          {icon && <Box className='flex items-center gap-2 p-3 rounded bg-action-hover'><Icon icon={icon} fontSize={24} /><Typography variant='body2'>{t('dms.admin.menus.dialogs.preview')}</Typography></Box>}
          <TextField fullWidth label={t('dms.admin.menus.dialogs.fields.pathOptional')} placeholder={t('dms.admin.menus.dialogs.placeholders.path')} value={path} onChange={e => setPath(e.target.value)} disabled={saving} helperText={t('dms.admin.menus.dialogs.helpers.path')} />
          <TextField fullWidth type='number' label={t('dms.admin.menus.dialogs.fields.displayOrder')} value={order} onChange={e => setOrder(parseInt(e.target.value) || 999)} disabled={saving} helperText={t('dms.admin.menus.dialogs.helpers.displayOrder')} />
          <Divider />
          <FormControl component='fieldset'>
            <FormLabel component='legend'>{t('dms.admin.menus.dialogs.fields.visibleForRoles')}</FormLabel>
            <Box className='flex gap-2 mt-2'>
              <Chip label='STAFF' icon={<Icon icon='tabler-user' />} onClick={() => setVisibleFor(prev => prev.includes('STAFF') ? prev.filter(r => r !== 'STAFF') : [...prev, 'STAFF'])} color={visibleFor.includes('STAFF') ? 'primary' : 'default'} variant={visibleFor.includes('STAFF') ? 'filled' : 'outlined'} disabled={saving} />
              <Chip label='ADMIN' icon={<Icon icon='tabler-shield-check' />} onClick={() => setVisibleFor(prev => prev.includes('ADMIN') ? prev.filter(r => r !== 'ADMIN') : [...prev, 'ADMIN'])} color={visibleFor.includes('ADMIN') ? 'error' : 'default'} variant={visibleFor.includes('ADMIN') ? 'filled' : 'outlined'} disabled={saving} />
            </Box>
          </FormControl>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions><Button onClick={onClose} disabled={saving}>{t('dms.common.cancel')}</Button><Button variant='contained' onClick={handleAdd} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <Icon icon='tabler-check' />}>{saving ? t('dms.admin.menus.dialogs.actions.adding') : t('dms.admin.menus.dialogs.actions.addMenu')}</Button></DialogActions>
    </Dialog>
  )
}

export default AddMenuDialog
