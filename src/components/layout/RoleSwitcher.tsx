'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Icon Imports
import { Icon } from '@iconify/react'

// Hook Imports
import { useAuth, useRole } from '@/hooks/useAuth'
import { useActivityLog } from '@/hooks/useActivityLog'

// Type Imports
import type { Role } from '@/types/dms'

const RoleSwitcher = () => {
  const { user, updateSession } = useAuth()
  const { role, actualRole, canBeAdmin } = useRole()
  const { logActivity } = useActivityLog()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [switching, setSwitching] = useState(false)

  // Only show for users who actually have ADMIN role in backend
  if (!canBeAdmin || !user) {
    return null
  }

  const currentRole = role || 'STAFF'
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSwitchRole = async (targetRole: Role) => {
    if (targetRole === currentRole || switching) return

    setSwitching(true)
    handleClose()

    try {
      // Update session with new role
      await updateSession({ role: targetRole })

      // Log the role switch
      await logActivity({
        action: 'ROLE_SWITCH',
        resource: 'AUTH',
        details: {
          from: currentRole,
          to: targetRole
        }
      })

      // Reload to apply new role
      window.location.reload()
    } catch (error) {
      console.error('Error switching role:', error)
      setSwitching(false)
    }
  }

  const getRoleColor = (role: Role) => {
    return role === 'ADMIN' ? 'error' : 'primary'
  }

  const getRoleIcon = (role: Role) => {
    return role === 'ADMIN' ? 'tabler-shield-check' : 'tabler-user'
  }

  return (
    <>
      <Chip
        label={
          <Box className='flex items-center gap-2'>
            <Icon icon={getRoleIcon(currentRole)} fontSize={16} />
            <Typography variant='body2' fontWeight={600}>
              {currentRole}
            </Typography>
          </Box>
        }
        color={getRoleColor(currentRole)}
        onClick={handleClick}
        sx={{ cursor: 'pointer' }}
        disabled={switching}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box className='px-4 py-2'>
          <Typography variant='caption' color='text.secondary'>
            Switch Role
          </Typography>
        </Box>
        <Divider />

        <MenuItem
          onClick={() => handleSwitchRole('ADMIN')}
          selected={currentRole === 'ADMIN'}
          disabled={currentRole === 'ADMIN' || switching}
        >
          <ListItemIcon>
            <Icon icon='tabler-shield-check' fontSize={20} />
          </ListItemIcon>
          <ListItemText
            primary='ADMIN'
            secondary='Full administrative access'
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleSwitchRole('STAFF')}
          selected={currentRole === 'STAFF'}
          disabled={currentRole === 'STAFF' || switching}
        >
          <ListItemIcon>
            <Icon icon='tabler-user' fontSize={20} />
          </ListItemIcon>
          <ListItemText
            primary='STAFF'
            secondary='Standard user access'
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>

        <Divider />

        <Box className='px-4 py-2'>
          <Typography variant='caption' color='text.secondary'>
            Current: <strong>{currentRole}</strong>
          </Typography>
        </Box>
      </Menu>
    </>
  )
}

export default RoleSwitcher
