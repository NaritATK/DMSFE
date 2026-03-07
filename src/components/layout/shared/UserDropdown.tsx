'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { alpha, styled, useTheme } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { signOut, useSession } from 'next-auth/react'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useRole } from '@/hooks/useAuth'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// API Imports
import apiClient from '@/libs/axios'
import { useDictionary } from '@/hooks/useDictionary'

// Component Imports
import UserAvatar from '@/components/UserAvatar'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [switchRoleOpen, setSwitchRoleOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [switching, setSwitching] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const { settings } = useSettings()
  const { lang: locale } = useParams()
  const theme = useTheme()
  const { t } = useDictionary()
  const { canBeAdmin } = useRole()

  // Sync sysUserId from session to localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user) {
      const sysUserId = (session.user as any)?.sysUserId

      if (sysUserId && !localStorage.getItem('sysUserId')) {
        localStorage.setItem('sysUserId', sysUserId)
        console.log('[UserDropdown] Synced sysUserId to localStorage:', sysUserId)
      }
    }
  }, [session])

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      // Clear backend token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('backendToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('sysUserId')
      }
      
      // Sign out from the app
      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
    } catch (error) {
      console.error(error)

      // Show above error in a toast like following
      // toastService.error((err as Error).message)
    }
  }

  const handleOpenSwitchRole = () => {
    setOpen(false)
    setSelectedRole(session?.user?.role === 'ADMIN' ? 'STAFF' : 'ADMIN')
    setSwitchRoleOpen(true)
  }

  const getSysUserId = (): string | null => {
    if (typeof window === 'undefined') return null
    
    // 1. Try localStorage first
    let sysUserId = localStorage.getItem('sysUserId')

    if (sysUserId) return sysUserId
    
    // 2. Try to get from session
    sysUserId = (session?.user as any)?.sysUserId

    if (sysUserId) {
      // Store in localStorage for next time
      localStorage.setItem('sysUserId', sysUserId)
      
return sysUserId
    }
    
    // 3. Try to decode from JWT token
    const backendToken = localStorage.getItem('backendToken')

    if (backendToken) {
      try {
        const base64Url = backendToken.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(window.atob(base64))

        if (payload.sysUserId) {
          localStorage.setItem('sysUserId', payload.sysUserId)
          
return payload.sysUserId
        }
      } catch (e) {
        console.error('Failed to decode token:', e)
      }
    }
    
    return null
  }

  const handleSwitchRole = async () => {
    if (!selectedRole) return
    
    setSwitching(true)

    try {
      // Get current user ID from multiple sources
      const sysUserId = getSysUserId()
      
      if (!sysUserId) {
        console.error('User ID not found')
        alert(t('dms.layout.user.userIdNotFound'))
        
return
      }

      // Get available roles from API (now accessible to all authenticated users)
      const rolesRes = await apiClient.get('/user-roles/roles')
      const roles = rolesRes.data
      const targetRole = roles.find((r: any) => r.code === selectedRole)
      
      if (!targetRole) {
        console.error('Role not found')
        alert(t('dms.layout.user.roleNotFound'))
        
return
      }

      // Call API to switch role
      const response = await apiClient.post('/user-roles/switch', {
        userId: sysUserId,
        newRoleId: targetRole.roleId
      })

      setSwitchRoleOpen(false)

      const newRoleCode = response?.data?.newRole?.code || selectedRole

      // Update local session and localStorage immediately (no re-login)
      await updateSession({
        role: newRoleCode,
        user: {
          ...(session?.user || {}),
          role: newRoleCode
        }
      } as any)

      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', newRoleCode)
      }

      alert(t('dms.layout.user.roleSwitched').replace('{role}', newRoleCode))
    } catch (error: any) {
      console.error('Error switching role:', error)
      alert(error.response?.data?.error || t('dms.layout.user.switchRoleFailed'))
    } finally {
      setSwitching(false)
    }
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <div ref={anchorRef} onClick={handleDropdownOpen}>
          <UserAvatar size={38} className='cursor-pointer' />
        </div>
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <UserAvatar size={40} />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {session?.user?.name || ''}
                      </Typography>
                      <Box className='flex items-center' sx={{ gap: 6 }}>
                        <Typography variant='caption'>{session?.user?.email || ''}</Typography>
                        <Chip 
                          label={session?.user?.role || 'STAFF'} 
                          size='small' 
                          color={session?.user?.role === 'ADMIN' ? 'error' : 'primary'}
                          variant='filled'
                          sx={{ 
                            height: 16, 
                            fontSize: '0.6rem', 
                            fontWeight: 700,
                            '& .MuiChip-label': { px: 0.75, py: 0 }
                          }}
                        />
                      </Box>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/user-profile')}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>{t('dms.layout.user.myProfile')}</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>{t('dms.layout.user.settings')}</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className='tabler-currency-dollar' />
                    <Typography color='text.primary'>{t('dms.layout.user.pricing')}</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className='tabler-help-circle' />
                    <Typography color='text.primary'>{t('dms.layout.user.faq')}</Typography>
                  </MenuItem>
                  <Divider className='mlb-1' />
                  {canBeAdmin && (
                    <MenuItem
                      className='mli-2 gap-3'
                      onClick={handleOpenSwitchRole}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        mt: 0.5,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12)
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.14)
                        }}
                      >
                        <i className='tabler-switch' />
                      </Box>
                      <Box className='flex items-center justify-between w-full'>
                        <Typography color='text.primary' fontWeight={600}>{t('dms.layout.user.switchRole')}</Typography>
                        <Chip
                          label={t('dms.layout.user.switchTo').replace('{role}', session?.user?.role === 'ADMIN' ? 'STAFF' : 'ADMIN')}
                          size='small'
                          color={session?.user?.role === 'ADMIN' ? 'primary' : 'error'}
                          variant='filled'
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                      </Box>
                    </MenuItem>
                  )}
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      {t('dms.layout.user.logout')}
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      
      {/* Switch Role Dialog - Only for ADMIN users */}
      {canBeAdmin && (
        <Dialog open={switchRoleOpen} onClose={() => setSwitchRoleOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box className="flex items-center gap-2">
            <i className='tabler-switch' />
            {t('dms.layout.user.switchRole')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" className="mb-4">
            {t('dms.layout.user.switchRoleWarning')}
          </Alert>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 4,
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.06)
            }}
          >
            <Avatar alt={session?.user?.name || ''} src={session?.user?.image || ''} />
            <Box>
              <Typography variant='body2' fontWeight={600}>
                {session?.user?.name || t('dms.layout.user.unknown')}
              </Typography>
              <Box className='flex items-center gap-2 mt-1'>
                <Typography variant='caption' color='text.secondary'>
                  {t('dms.layout.user.current')}:
                </Typography>
                <Chip
                  label={session?.user?.role || 'STAFF'}
                  size='small'
                  color={session?.user?.role === 'ADMIN' ? 'error' : 'primary'}
                />
              </Box>
            </Box>
          </Box>

          <FormControl fullWidth>
            <InputLabel id="role-select-label">{t('dms.layout.user.selectNewRole')}</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRole}
              label={t('dms.layout.user.selectNewRole')}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <MenuItem value='ADMIN'>
                <Box className='flex items-center gap-2'>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'error.main',
                      bgcolor: alpha(theme.palette.error.main, 0.12)
                    }}
                  >
                    <i className='tabler-shield-check' />
                  </Box>
                  <Box>
                    <Typography variant='body2' fontWeight={700}>ADMIN</Typography>
                    <Typography variant='caption' color='text.secondary'>{t('dms.layout.user.fullSystemAccess')}</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value='STAFF'>
                <Box className='flex items-center gap-2'>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }}
                  >
                    <i className='tabler-user' />
                  </Box>
                  <Box>
                    <Typography variant='body2' fontWeight={700}>STAFF</Typography>
                    <Typography variant='caption' color='text.secondary'>{t('dms.layout.user.standardUserAccess')}</Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwitchRoleOpen(false)} disabled={switching}>
            {t('dms.common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSwitchRole}
            disabled={!selectedRole || selectedRole === session?.user?.role || switching}
            startIcon={switching ? <i className='tabler-loader-2 animate-spin' /> : <i className='tabler-switch' />}
          >
            {switching ? t('dms.layout.user.switching') : t('dms.layout.user.switchRole')}
          </Button>
        </DialogActions>
      </Dialog>
      )}
    </>
  )
}

export default UserDropdown
