'use client'

import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

import { useAuth, useRole } from '@/hooks/useAuth'
import { useDictionary } from '@/hooks/useDictionary'

import type { Role } from '@/types/dms'
import type { Locale } from '@configs/i18n'

import { getLocalizedUrl } from '@/utils/i18n'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: Role
  requiredPermission?: string
  fallback?: React.ReactNode
}

const RoleGuard = ({ children, requiredRole, requiredPermission, fallback }: RoleGuardProps) => {
  const router = useRouter()
  const { lang } = useParams()
  const locale = (lang as Locale) || ('en' as Locale)
  const { t } = useDictionary()

  const loginUrl = getLocalizedUrl('/login', locale)
  const dashboardUrl = getLocalizedUrl('/manage', locale)

  const { isAuthenticated, isLoading } = useAuth()
  const { role, hasRole, hasPermission } = useRole()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push(loginUrl)
  }, [isLoading, isAuthenticated, router, loginUrl])

  if (isLoading) return <Box className='flex items-center justify-center min-h-screen'><CircularProgress /></Box>
  if (!isAuthenticated) return null

  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>

    return (
      <Box className='flex items-center justify-center min-h-screen p-6'>
        <Card sx={{ maxWidth: 500 }}>
          <CardContent className='flex flex-col items-center gap-4 text-center'>
            <Box className='text-6xl'>🚫</Box>
            <Typography variant='h5' color='text.primary'>{t('dms.auth.accessDenied')}</Typography>
            <Typography variant='body1' color='text.secondary'>
              {t('dms.auth.noPermissionPage')}<br />
              {t('dms.auth.requiredRole')}: <strong>{requiredRole}</strong><br />
              {t('dms.auth.yourRole')}: <strong>{role}</strong>
            </Typography>
            <Button variant='contained' onClick={() => router.push(dashboardUrl)}>{t('dms.auth.goToDashboard')}</Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>

    return (
      <Box className='flex items-center justify-center min-h-screen p-6'>
        <Card sx={{ maxWidth: 500 }}>
          <CardContent className='flex flex-col items-center gap-4 text-center'>
            <Box className='text-6xl'>🔒</Box>
            <Typography variant='h5' color='text.primary'>{t('dms.auth.permissionRequired')}</Typography>
            <Typography variant='body1' color='text.secondary'>
              {t('dms.auth.noPermissionFeature')}<br />{t('dms.auth.contactAdmin')}
            </Typography>
            <Button variant='contained' onClick={() => router.push(dashboardUrl)}>{t('dms.auth.goToDashboard')}</Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return <>{children}</>
}

export default RoleGuard
