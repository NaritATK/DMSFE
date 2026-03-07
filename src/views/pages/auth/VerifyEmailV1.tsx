'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Link from '@components/Link'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useDictionary } from '@/hooks/useDictionary'
import { formatI18n } from '@/utils/formatI18n'

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'

const VerifyEmailV1 = () => {
  // Hooks
  const { lang: locale } = useParams()
  const { t } = useDictionary()

  return (
    <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>{t('dms.authTemplates.verifyEmailTitle')}</Typography>
            <Typography>
              {formatI18n(t('dms.authTemplates.verifyEmailDesc'), { email: 'john.doe@email.com' })}
            </Typography>
          </div>
          <Button fullWidth variant='contained' type='submit' className='mbe-6'>
            {t('dms.authTemplates.skipForNow')}
          </Button>
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography>{t('dms.authTemplates.didntGetMail')}</Typography>
            <Typography color='primary.main' component={Link}>
              {t('dms.authTemplates.resend')}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  )
}

export default VerifyEmailV1
