'use client'

import { useCallback, useEffect, useState } from 'react'

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
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import RoleGuard from '@/components/auth/RoleGuard'
import { useDictionary } from '@/hooks/useDictionary'
import { menuService, type CreateMenuDto, type Menu } from '@/services/menu.service'

const initialForm: CreateMenuDto = {
  label: '',
  icon: '',
  href: '',
  parentId: undefined,
  order: 0,
  isActive: true,
  requiredRole: undefined,
}

type MenuDialogProps = {
  open: boolean
  title: string
  formData: CreateMenuDto
  menus: Menu[]
  onClose: () => void
  onSave: () => void
  onChange: (next: CreateMenuDto) => void
}

function MenuDialog({ open, title, formData, menus, onClose, onSave, onChange }: MenuDialogProps) {
  const { t } = useDictionary()

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label={t('dms.admin.menus.fields.label')}
            value={formData.label}
            onChange={e => onChange({ ...formData, label: e.target.value })}
            required
          />
          <TextField
            label={t('dms.admin.menus.fields.icon')}
            value={formData.icon}
            onChange={e => onChange({ ...formData, icon: e.target.value })}
            placeholder={t('dms.admin.menus.placeholders.icon')}
          />
          <TextField
            label={t('dms.admin.menus.fields.path')}
            value={formData.href}
            onChange={e => onChange({ ...formData, href: e.target.value })}
            placeholder={t('dms.admin.menus.placeholders.path')}
          />
          <FormControl>
            <InputLabel>{t('dms.admin.menus.fields.parent')}</InputLabel>
            <Select
              value={formData.parentId || ''}
              onChange={e => onChange({ ...formData, parentId: (e.target.value as string) || undefined })}
            >
              <MenuItem value=''>{t('dms.admin.menus.root')}</MenuItem>
              {menus.map(menu => (
                <MenuItem key={menu.menuId} value={menu.menuId}>
                  {menu.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('dms.admin.menus.fields.order')}
            type='number'
            value={formData.order}
            onChange={e => onChange({ ...formData, order: Number.parseInt(e.target.value || '0', 10) })}
          />
          <TextField
            label={t('dms.admin.menus.fields.requiredRole')}
            value={formData.requiredRole || ''}
            onChange={e => onChange({ ...formData, requiredRole: e.target.value || undefined })}
            placeholder={t('dms.admin.menus.placeholders.requiredRole')}
          />
          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={e => onChange({ ...formData, isActive: e.target.checked })} />}
            label={t('dms.admin.common.active')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('dms.common.cancel')}</Button>
        <Button onClick={onSave} variant='contained' disabled={!formData.label}>
          {t('dms.common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function MenusPage() {
  const { t } = useDictionary()

  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [formData, setFormData] = useState<CreateMenuDto>(initialForm)

  const fetchMenus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setMenus(await menuService.getMenus())
    } catch (err: any) {
      console.error('Error fetching menus:', err)
      setError(err.response?.data?.error || err.message || t('dms.admin.menus.errors.fetch'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  const resetForm = () => {
    setFormData(initialForm)
    setSelectedMenu(null)
  }

  const openEditDialog = (menu: Menu) => {
    setSelectedMenu(menu)
    setFormData({
      label: menu.label,
      icon: menu.icon,
      href: menu.href,
      parentId: menu.parentId,
      order: menu.order,
      isActive: menu.isActive,
      requiredRole: menu.requiredRole,
    })
    setEditDialogOpen(true)
  }

  const handleAddMenu = async () => {
    try {
      await menuService.createMenu(formData)
      setAddDialogOpen(false)
      resetForm()
      await fetchMenus()
    } catch (err: any) {
      setError(err.response?.data?.error || t('dms.admin.menus.errors.create'))
    }
  }

  const handleEditMenu = async () => {
    try {
      if (!selectedMenu) return
      await menuService.updateMenu(selectedMenu.menuId, formData)
      setEditDialogOpen(false)
      resetForm()
      await fetchMenus()
    } catch (err: any) {
      setError(err.response?.data?.error || t('dms.admin.menus.errors.update'))
    }
  }

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm(t('dms.admin.menus.confirmDelete'))) return

    try {
      await menuService.deleteMenu(menuId)
      await fetchMenus()
    } catch (err: any) {
      setError(err.response?.data?.error || t('dms.admin.menus.errors.delete'))
    }
  }

  const renderMenuTree = (items: Menu[], level = 0) =>
    items.map(menu => (
      <Box key={menu.menuId} sx={{ ml: level * 4, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          {menu.icon && <Icon icon={menu.icon} fontSize={24} />}

          <Box sx={{ flex: 1 }}>
            <Typography variant='subtitle1'>{menu.label}</Typography>
            {menu.href && <Typography variant='caption' color='text.secondary'>{menu.href}</Typography>}
          </Box>

          <Chip
            label={menu.isActive ? t('dms.admin.common.active') : t('dms.admin.common.inactive')}
            size='small'
            color={menu.isActive ? 'success' : 'default'}
          />
          {menu.requiredRole && <Chip label={menu.requiredRole} size='small' color='primary' />}

          <IconButton size='small' onClick={() => openEditDialog(menu)}>
            <Icon icon='tabler-edit' />
          </IconButton>
          <IconButton size='small' color='error' onClick={() => handleDeleteMenu(menu.menuId)}>
            <Icon icon='tabler-trash' />
          </IconButton>
        </Box>

        {(menu.children?.length ?? 0) > 0 && renderMenuTree(menu.children!, level + 1)}
      </Box>
    ))

  return (
    <RoleGuard requiredRole='ADMIN'>
      <Card>
        <CardHeader
          title={t('dms.admin.menus.title')}
          subheader={t('dms.admin.menus.subheader')}
          action={
            <Button
              variant='contained'
              startIcon={<Icon icon='tabler-plus' />}
              onClick={() => {
                resetForm()
                setAddDialogOpen(true)
              }}
            >
              {t('dms.admin.menus.add')}
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
          ) : menus.length === 0 ? (
            <Alert severity='info'>{t('dms.admin.menus.empty')}</Alert>
          ) : (
            renderMenuTree(menus)
          )}
        </CardContent>
      </Card>

      <MenuDialog
        open={addDialogOpen}
        title={t('dms.admin.menus.addNew')}
        formData={formData}
        menus={menus}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddMenu}
        onChange={setFormData}
      />

      <MenuDialog
        open={editDialogOpen}
        title={t('dms.admin.menus.edit')}
        formData={formData}
        menus={menus}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditMenu}
        onChange={setFormData}
      />
    </RoleGuard>
  )
}
