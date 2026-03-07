'use client'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
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
  lastLoginAt: string | null
  createdAt: string
  sysUserRole: UserRole[]
}

interface UserTableProps {
  users: User[]
  onSwitchRole: (user: User) => void
}

const UserTable = ({ users, onSwitchRole }: UserTableProps) => {
  const { t, locale } = useDictionary()
  const theme = useTheme()

  const formatDate = (date: string | null): string => {
    if (!date) return t('dms.admin.common.never')

    return new Date(date).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      const parts = name.split(' ').filter(Boolean)

      if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()

      return parts[0].substring(0, 2).toUpperCase()
    }

    return email ? email.substring(0, 2).toUpperCase() : '??'
  }

  const getRoleStyle = (role?: string) => {
    if (role === 'ADMIN') {
      return {
        color: theme.palette.error.main,
        bg: alpha(theme.palette.error.main, 0.1),
        icon: 'tabler-shield-check'
      }
    }

    return {
      color: theme.palette.primary.main,
      bg: alpha(theme.palette.primary.main, 0.1),
      icon: 'tabler-user'
    }
  }

  if (users.length === 0) {
    return (
      <Box className='flex flex-col items-center justify-center p-8'>
        <Icon icon='tabler-users-off' fontSize={64} className='text-text-secondary mb-4' />
        <Typography variant='h6' color='text.secondary'>
          {t('dms.admin.users.empty')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('dms.admin.users.adjustSearch')}
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('dms.common.user')}</TableCell>
            <TableCell>{t('dms.common.department')}</TableCell>
            <TableCell>{t('dms.admin.users.currentRole')}</TableCell>
            <TableCell>{t('dms.common.status')}</TableCell>
            <TableCell>{t('dms.admin.users.lastLogin')}</TableCell>
            <TableCell align='right'>{t('dms.common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => {
            const currentRole = user.sysUserRole.find(ur => ur.isActive)
            const currentRoleCode = currentRole?.roleCode || currentRole?.sysRole?.code
            const roleStyle = getRoleStyle(currentRoleCode)

            return (
              <TableRow key={user.sysUserId} hover>
                <TableCell>
                  <Box className='flex items-center gap-3'>
                    <Avatar
                      sx={{
                        bgcolor: roleStyle.color,
                        color: theme.palette.common.white,
                        fontWeight: 700
                      }}
                    >
                      {getInitials(user.displayName, user.email)}
                    </Avatar>
                    <Box>
                      <Typography variant='body2' fontWeight={600}>
                        {user.displayName || t('dms.admin.common.unknown')}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant='body2' color='text.secondary'>
                    {user.department || '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  {currentRole ? (
                    <Chip
                      label={currentRoleCode}
                      size='small'
                      icon={<Icon icon={roleStyle.icon} />}
                      sx={{
                        bgcolor: roleStyle.bg,
                        color: roleStyle.color,
                        '& .MuiChip-icon': { color: roleStyle.color }
                      }}
                    />
                  ) : (
                    <Chip label={t('dms.admin.users.noRole')} size='small' variant='outlined' color='default' />
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.isActive ? t('dms.admin.common.active') : t('dms.admin.common.inactive')}
                    size='small'
                    color={user.isActive ? 'success' : 'default'}
                    variant={user.isActive ? 'filled' : 'outlined'}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant='body2' color='text.secondary'>
                    {formatDate(user.lastLoginAt)}
                  </Typography>
                </TableCell>

                <TableCell align='right'>
                  <Tooltip title={t('dms.admin.users.switchRole')}>
                    <Button
                      size='small'
                      variant='contained'
                      startIcon={<Icon icon='tabler-switch' fontSize={18} />}
                      onClick={() => onSwitchRole(user)}
                      sx={{
                        mr: 1,
                        borderRadius: 2,
                        boxShadow: 'none'
                      }}
                    >
                      {t('dms.admin.users.switchRole')}
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserTable
