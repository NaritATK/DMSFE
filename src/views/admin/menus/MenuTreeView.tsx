'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { MenuNode } from '@/types/dms'

interface MenuTreeViewProps { menus: MenuNode[]; onEdit: (menu: MenuNode) => void; onDelete: (menuId: string) => void; onAddChild: (parent: MenuNode) => void; onReorder: (menus: MenuNode[]) => void }
interface MenuItemProps { menu: MenuNode; level: number; onEdit: (menu: MenuNode) => void; onDelete: (menuId: string) => void; onAddChild: (parent: MenuNode) => void }

const MenuItem = ({ menu, level, onEdit, onDelete, onAddChild }: MenuItemProps) => {
  const { t } = useDictionary()

  
return <Box><Paper variant='outlined' className='p-4 mb-2 hover:bg-action-hover transition-colors' sx={{ marginLeft: `${level * 32}px` }}><Box className='flex items-center justify-between'><Box className='flex items-center gap-3 flex-1'><Icon icon='tabler-grip-vertical' fontSize={20} className='text-text-secondary cursor-move' />{menu.icon && <Box className='p-2 rounded bg-primary-lightOpacity'><Icon icon={menu.icon} fontSize={20} className='text-primary-main' /></Box>}<Box className='flex-1'><Typography variant='body1' fontWeight={600}>{menu.title}</Typography>{menu.path && <Typography variant='caption' color='text.secondary'>{menu.path}</Typography>}</Box><Box className='flex gap-1'>{menu.visibleFor?.map(role => <Chip key={role} label={role} size='small' color={role === 'ADMIN' ? 'error' : 'primary'} variant='tonal' />)}</Box></Box><Box className='flex items-center gap-1'><Tooltip title={t('dms.admin.menus.dialogs.actions.addChild')}><IconButton size='small' onClick={() => onAddChild(menu)}><Icon icon='tabler-plus' fontSize={18} /></IconButton></Tooltip><Tooltip title={t('dms.common.edit')}><IconButton size='small' onClick={() => onEdit(menu)}><Icon icon='tabler-edit' fontSize={18} /></IconButton></Tooltip><Tooltip title={t('dms.common.delete')}><IconButton size='small' onClick={() => onDelete(menu.id)}><Icon icon='tabler-trash' fontSize={18} /></IconButton></Tooltip></Box></Box></Paper>{menu.children && menu.children.length > 0 && <Box>{menu.children.map(child => <MenuItem key={child.id} menu={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} />)}</Box>}</Box>
}

const MenuTreeView = ({ menus, onEdit, onDelete, onAddChild }: MenuTreeViewProps) => {
  const { t } = useDictionary()

  if (menus.length === 0) return <Box className='flex flex-col items-center justify-center p-8'><Icon icon='tabler-menu-off' fontSize={64} className='text-text-secondary mb-4' /><Typography variant='h6' color='text.secondary'>{t('dms.admin.menus.dialogs.empty.title')}</Typography><Typography variant='body2' color='text.secondary'>{t('dms.admin.menus.dialogs.empty.subtitle')}</Typography></Box>
  
return <Box>{menus.map(menu => <MenuItem key={menu.id} menu={menu} level={0} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} />)}</Box>
}

export default MenuTreeView
