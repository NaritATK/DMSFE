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

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useDictionary } from '@/hooks/useDictionary'

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'

const RegisterV1 = () => {
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
            <Typography variant='h4'>{t('dms.register.title')}</Typography>
            <Typography>{t('dms.register.subtitle')}</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
            <CustomTextField autoFocus fullWidth label={t('dms.register.username')} placeholder={t('dms.register.enterUsername')} />
            <CustomTextField fullWidth label={t('dms.common.email')} placeholder={t('dms.common.enterEmail')} />
            <CustomTextField
              fullWidth
              label={t('dms.common.password')}
              placeholder='············'
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
            <FormControlLabel
              control={<Checkbox />}
              label={
                <>
                  <span>{t('dms.register.agreeTo')}</span>
                  <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                    {t('dms.register.privacyTerms')}
                  </Link>
                </>
              }
            />
            <Button fullWidth variant='contained' type='submit'>
              {t('dms.register.signUp')}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>{t('dms.register.alreadyHaveAccount')}</Typography>
              <Typography
                component={Link}
                href={getLocalizedUrl('/pages/auth/login-v1', locale as Locale)}
                color='primary.main'
              >
                {t('dms.register.signInInstead')}
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

export default RegisterV1
