'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import classnames from 'classnames'

import type { SystemMode } from '@core/types'
import type { Locale } from '@/configs/i18n'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { getLocalizedUrl } from '@/utils/i18n'
import { useDictionary } from '@/hooks/useDictionary'

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const NotAuthorized = ({ mode }: { mode: SystemMode }) => {
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'
  const theme = useTheme()
  const { lang: locale } = useParams()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const miscBackground = useImageVariant(mode, lightImg, darkImg)
  const { t } = useDictionary()

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
          <Typography className='font-medium text-8xl' color='text.primary'>401</Typography>
          <Typography variant='h4'>{t('dms.notAuthorized.title')}</Typography>
          <Typography>{t('dms.notAuthorized.description')}</Typography>
        </div>
        <Button href={getLocalizedUrl('/', locale as Locale)} component={Link} variant='contained'>
          {t('dms.common.backToHome')}
        </Button>
        <img alt='error-401-illustration' src='/images/illustrations/characters/3.png' className='object-cover bs-[400px] md:bs-[450px] lg:bs-[500px] mbs-10 md:mbs-14 lg:mbs-20' />
      </div>
      {!hidden && <MaskImg alt='mask' src={miscBackground} className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })} />}
    </div>
  )
}

export default NotAuthorized
