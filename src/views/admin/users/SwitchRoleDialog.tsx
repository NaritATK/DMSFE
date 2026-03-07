'use client'

import { useEffect, useMemo, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { alpha, useTheme } from '@mui/material/styles'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'

interface UserRole {
  userRoleId: string
  roleId: string
  roleCode: string
  roleName: string
  isActive: boolean
  sysRole?: {
    code?: string
    name?: string
  }
}

interface User {
  sysUserId: string
  email: string
  displayName: string | null
  department: string | null
  isActive: boolean
  sysUserRole: UserRole[]
}

interface SwitchRoleDialogProps {
  open: boolean
  user: User
  roles: { roleId: string; code: string; name: string }[]
  onClose: () => void
  onSwitch: (userId: string, newRoleId: string) => void
}

const SwitchRoleDialog = ({ open, user, roles, onClose, onSwitch }: SwitchRoleDialogProps) => {
  const { t } = useDictionary()
  const theme = useTheme()

  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const currentRole = user.sysUserRole.find(ur => ur.isActive)
  const currentRoleCode = currentRole?.roleCode || currentRole?.sysRole?.code
  const selectedRole = roles.find(role => role.roleId === selectedRoleId)

  useEffect(() => {
    if (!open) return

    setSelectedRoleId('')
  }, [open, user.sysUserId])

  const rolePalette = useMemo(
    () => ({
      ADMIN: {
        color: theme.palette.error.main,
        bg: alpha(theme.palette.error.main, 0.08),
        icon: 'tabler-shield-check'
      },
      STAFF: {
        color: theme.palette.primary.main,
        bg: alpha(theme.palette.primary.main, 0.08),
        icon: 'tabler-user'
      },
      DEFAULT: {
        color: theme.palette.text.primary,
        bg: alpha(theme.palette.text.primary, 0.08),
        icon: 'tabler-user-circle'
      }
    }),
    [theme.palette.error.main, theme.palette.primary.main, theme.palette.text.primary]
  )

  const currentRoleTheme = currentRoleCode
    ? rolePalette[currentRoleCode as 'ADMIN' | 'STAFF'] || rolePalette.DEFAULT
    : rolePalette.DEFAULT
  const nextRoleTheme = selectedRole?.code ? rolePalette[selectedRole.code as 'ADMIN' | 'STAFF'] || rolePalette.DEFAULT : rolePalette.DEFAULT

  const getInitials = (name?: string | null, email?: string): string => {
    if (name) {
      const parts = name.split(' ').filter(Boolean)

      if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()

      return parts[0].substring(0, 2).toUpperCase()
    }

    return email ? email.substring(0, 2).toUpperCase() : '??'
  }

  const handleSwitch = async () => {
    if (!selectedRoleId) return

    setLoading(true)

    try {
      await onSwitch(user.sysUserId, selectedRoleId)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Box className='flex items-center gap-2'>
          <Icon icon='tabler-switch' fontSize={24} color={theme.palette.primary.main} />
          {t('dms.admin.users.switchUserRole')}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4,
            p: 3,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.background.paper, 0.9)})`
          }}
        >
          <Avatar
            sx={{
              bgcolor: currentRoleTheme.color,
              width: 54,
              height: 54,
              fontWeight: 700
            }}
          >
            {getInitials(user.displayName, user.email)}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant='h6' fontWeight={700}>
              {user.displayName || t('dms.admin.common.unknown')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {user.email}
            </Typography>

            <Box className='flex items-center gap-2 mt-2'>
              <Typography variant='caption' color='text.secondary'>
                {t('dms.admin.users.currentRole')}:
              </Typography>
              <Chip
                label={currentRoleCode || t('dms.admin.users.noRole')}
                size='small'
                icon={<Icon icon={currentRoleTheme.icon} />}
                sx={{
                  bgcolor: currentRoleTheme.bg,
                  color: currentRoleTheme.color,
                  '& .MuiChip-icon': { color: currentRoleTheme.color }
                }}
              />
            </Box>
          </Box>
        </Box>

        <Alert severity='warning' className='mb-4'>
          {t('dms.admin.users.switchWarning')}
        </Alert>

        <FormControl fullWidth>
          <InputLabel id='role-select-label'>{t('dms.admin.users.selectNewRole')}</InputLabel>
          <Select
            labelId='role-select-label'
            value={selectedRoleId}
            label={t('dms.admin.users.selectNewRole')}
            onChange={e => setSelectedRoleId(e.target.value)}
          >
            {roles.map(role => {
              const palette = rolePalette[role.code as 'ADMIN' | 'STAFF'] || rolePalette.DEFAULT

              return (
                <MenuItem key={role.roleId} value={role.roleId} disabled={role.roleId === currentRole?.roleId}>
                  <Box className='flex items-center gap-2'>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: palette.bg,
                        color: palette.color
                      }}
                    >
                      <Icon icon={palette.icon} fontSize={18} />
                    </Box>
                    <Box>
                      <Typography variant='body2' fontWeight={600}>
                        {role.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {role.code === 'ADMIN' ? t('dms.admin.users.fullSystemAccess') : t('dms.admin.users.standardUserAccess')}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        {selectedRole && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px dashed ${alpha(nextRoleTheme.color, 0.35)}`,
                bgcolor: nextRoleTheme.bg
              }}
            >
              <Typography variant='caption' color='text.secondary'>
                {t('dms.admin.users.selectNewRole')}
              </Typography>
              <Box className='flex items-center gap-2 mt-1'>
                <Icon icon={nextRoleTheme.icon} color={nextRoleTheme.color} fontSize={18} />
                <Typography variant='body2' fontWeight={700} sx={{ color: nextRoleTheme.color }}>
                  {selectedRole.name}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('dms.common.cancel')}
        </Button>
        <Button
          variant='contained'
          onClick={handleSwitch}
          disabled={!selectedRoleId || selectedRoleId === currentRole?.roleId || loading}
          startIcon={loading ? <Icon icon='tabler-loader-2' className='animate-spin' /> : <Icon icon='tabler-switch' />}
        >
          {loading ? t('dms.admin.users.switching') : t('dms.admin.users.switchRole')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SwitchRoleDialog
