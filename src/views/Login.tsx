'use client'

import { useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { signIn } from 'next-auth/react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

import { Icon } from '@iconify/react'

import Logo from '@components/layout/shared/Logo'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useDictionary } from '@/hooks/useDictionary'

import type { SystemMode } from '@core/types'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

interface LoginProps {
  mode: SystemMode
}

const Login = ({ mode }: LoginProps) => {
  const searchParams = useSearchParams()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useDictionary()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const errorParam = searchParams.get('error')

  const handleMicrosoftLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // Priority: redirectTo from URL param > callbackUrl from URL > /manage default
      const redirectTo = searchParams.get('redirectTo') || searchParams.get('callbackUrl') || '/manage'
      
      console.log('[Login] Redirecting to:', redirectTo)

      const result = await signIn('azure-ad', {
        callbackUrl: redirectTo,
        redirect: true
      })

      if (result?.error) {
        setError(t('dms.login.errors.signInMicrosoft'))
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(t('dms.login.errors.unexpected'))
      setLoading(false)
    }
  }

  const getErrorMessage = (err: string) => t(`dms.login.oauthErrors.${err}`, t('dms.login.oauthErrors.default'))
  const isPermissionDeniedError = errorParam === 'NON_STAFF_USER' || errorParam === 'NO_ACTIVE_ROLE'
  const isSessionExpiredError = errorParam === 'session_expired'

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden'>
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <Card className='flex flex-col sm:is-[450px]' elevation={0}>
          <CardContent className='p-6 sm:!p-12'>
            <Box className='flex flex-col gap-6'>
              <Box className='flex flex-col gap-1'>
                <Typography variant='h4' fontWeight={700}>
                  {t('dms.login.title')}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {t('dms.login.subtitle')}
                </Typography>
              </Box>

              {(error || errorParam) && (
                isPermissionDeniedError ? (
                  <Alert
                    severity='warning'
                    icon={<Icon icon='tabler-shield-x' fontSize={20} />}
                    sx={{
                      border: theme => `1px solid ${theme.palette.warning.main}`,
                      '& .MuiAlert-message': { width: '100%' }
                    }}
                    onClose={() => setError(null)}
                  >
                    <Typography variant='subtitle2' fontWeight={700}>
                      {t('dms.login.permissionDeniedTitle')}
                    </Typography>
                    <Typography variant='body2' sx={{ mt: 0.5 }}>
                      {t('dms.login.permissionDeniedDescription')}
                    </Typography>
                  </Alert>
                ) : isSessionExpiredError ? (
                  <Alert
                    severity='info'
                    icon={<Icon icon='tabler-clock' fontSize={20} />}
                    sx={{
                      border: theme => `1px solid ${theme.palette.info.main}`,
                      '& .MuiAlert-message': { width: '100%' }
                    }}
                    onClose={() => setError(null)}
                  >
                    <Typography variant='subtitle2' fontWeight={700}>
                      {t('dms.login.sessionExpiredTitle', 'Session Expired')}
                    </Typography>
                    <Typography variant='body2' sx={{ mt: 0.5 }}>
                      {getErrorMessage(errorParam!)}
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity='error' onClose={() => setError(null)}>
                    {error || getErrorMessage(errorParam!)}
                  </Alert>
                )
              )}

              <Button
                fullWidth
                variant='contained'
                size='large'
                startIcon={loading ? <CircularProgress size={20} color='inherit' /> : <Icon icon='mdi:microsoft' fontSize={24} />}
                onClick={handleMicrosoftLogin}
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
              >
                {loading ? t('dms.login.signingIn') : t('dms.login.signInButton')}
              </Button>

              <Divider>
                <Typography variant='body2' color='text.secondary'>
                  {t('dms.login.secureAuthentication')}
                </Typography>
              </Divider>

              <Box className='p-4 rounded bg-primary-lightOpacity'>
                <Box className='flex items-start gap-3'>
                  <Icon icon='tabler-info-circle' fontSize={24} className='text-primary-main' />
                  <Box>
                    <Typography variant='body2' fontWeight={600} color='primary'>
                      {t('dms.login.authRequired')}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' className='mt-1'>
                      {t('dms.login.authDescription')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
