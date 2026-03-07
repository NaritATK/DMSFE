'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import AuthSocialButtons from './AuthSocialButtons'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useDictionary } from '@/hooks/useDictionary'
import { formatI18n } from '@/utils/formatI18n'

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'

const LoginV1 = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Hooks
  const { lang: locale } = useParams()
  const { t } = useDictionary()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>{formatI18n(t('dms.authTemplates.welcome'), { name: themeConfig.templateName })}</Typography>
            <Typography>{t('dms.authTemplates.signInAdventure')}</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
            <CustomTextField autoFocus fullWidth label={t('dms.authTemplates.emailOrUsername')} placeholder={t('dms.authTemplates.enterEmailOrUsername')} />
            <CustomTextField
              fullWidth
              label={t('dms.common.password')}
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox />} label={t('dms.authTemplates.rememberMe')} />
              <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={getLocalizedUrl('/pages/auth/forgot-password-v1', locale as Locale)}
              >
                {t('dms.authTemplates.forgotPasswordQ')}
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit'>
              {t('dms.authTemplates.login')}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>{t('dms.authTemplates.newOnPlatform')}</Typography>
              <Typography
                component={Link}
                href={getLocalizedUrl('/pages/auth/register-v1', locale as Locale)}
                color='primary.main'
              >
                {t('dms.authTemplates.createAccount')}
              </Typography>
            </div>
            <Divider className='gap-2 text-textPrimary'>{t('dms.common.or')}</Divider>
            <AuthSocialButtons />
          </form>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  )
}

export default LoginV1
