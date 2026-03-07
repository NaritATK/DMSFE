'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hooks Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useDictionary } from '@/hooks/useDictionary'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Footer = ({ mode }: { mode: Mode }) => {
  // Vars
  const footerImageLight = '/images/front-pages/footer-bg-light.png'
  const footerImageDark = '/images/front-pages/footer-bg-dark.png'

  // Hooks
  const { t } = useDictionary()
  const dashboardImage = useImageVariant(mode, footerImageLight, footerImageDark)

  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative'>
        <img src={dashboardImage} alt={t('dms.frontPagesShared.footer.backgroundAlt')} className='absolute inset-0 is-full bs-full object-cover -z-[1]' />
        <div className={classnames('plb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <div className='flex flex-col items-start gap-6'>
                <Link href='/front-pages/landing-page'>
                  <Logo variant='header' color='var(--mui-palette-common-white)' />
                </Link>
                <Typography color='white' className='md:max-is-[390px] opacity-[0.78]'>
                  {t('dms.frontPagesShared.footer.description')}
                </Typography>
                <div className='flex items-end'>
                  <CustomTextField
                    size='small'
                    className={styles.inputBorder}
                    label={t('dms.frontPagesShared.footer.subscribeLabel')}
                    placeholder={t('dms.frontPagesShared.footer.emailPlaceholder')}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderStartEndRadius: '0 !important',
                        borderEndEndRadius: '0 !important',
                        '&:not(.Mui-focused)': {
                          borderColor: 'rgb(var(--mui-mainColorChannels-dark) / 0.22)'
                        },
                        '&.MuiFilledInput-root:not(.Mui-focused):not(.Mui-disabled):hover': {
                          borderColor: 'rgba(255 255 255 / 0.6) !important'
                        }
                      }
                    }}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{
                      borderStartStartRadius: 0,
                      borderEndStartRadius: 0
                    }}
                  >
                    {t('dms.frontPagesShared.footer.subscribe')}
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 2 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                {t('dms.frontPagesShared.footer.pagesTitle')}
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/front-pages/pricing' color='white' className='opacity-[0.78]'>
                  {t('dms.frontPagesShared.footer.pricing')}
                </Typography>
                <Link href='/front-pages/payment' className='flex items-center gap-[10px]'>
                  <Typography color='white' className='opacity-[0.78]'>
                    {t('dms.frontPagesShared.footer.payment')}
                  </Typography>
                  <Chip label={t('dms.frontPagesShared.footer.new')} color='primary' size='small' />
                </Link>
                <Typography
                  component={Link}
                  href='/pages/misc/under-maintenance'
                  color='white'
                  className='opacity-[0.78]'
                >
                  {t('dms.frontPagesShared.footer.maintenance')}
                </Typography>
                <Typography component={Link} href='/pages/misc/coming-soon' color='white' className='opacity-[0.78]'>
                  {t('dms.frontPagesShared.footer.comingSoon')}
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 2 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                {t('dms.frontPagesShared.footer.productsTitle')}
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  {t('dms.frontPagesShared.footer.pageBuilder')}
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  {t('dms.frontPagesShared.footer.adminDashboards')}
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  {t('dms.frontPagesShared.footer.uiKits')}
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  {t('dms.frontPagesShared.footer.illustrations')}
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                {t('dms.frontPagesShared.footer.downloadApp')}
              </Typography>
              <div className='flex flex-col gap-4'>
                <Link className='bg-[#282C3E] bs-[56px] is-[211px] rounded'>
                  <div className='flex items-center pli-5 plb-[7px] gap-6'>
                    <img src='/images/front-pages/apple-icon.png' alt={t('dms.frontPagesShared.footer.appleStoreAlt')} className='bs-[34px]' />
                    <div className='flex flex-col items-start'>
                      <Typography variant='body2' color='white' className='opacity-75'>
                        {t('dms.frontPagesShared.footer.downloadOnThe')}
                      </Typography>
                      <Typography color='white' className='font-medium opacity-[0.92]'>
                        {t('dms.frontPagesShared.footer.appStore')}
                      </Typography>
                    </div>
                  </div>
                </Link>
                <Link className='bg-[#282C3E] bs-[56px] is-[211px] rounded'>
                  <div className='flex items-center pli-5 plb-[7px] gap-6'>
                    <img src='/images/front-pages/google-play-icon.png' alt={t('dms.frontPagesShared.footer.googlePlayAlt')} className='bs-[34px]' />
                    <div className='flex flex-col items-start'>
                      <Typography variant='body2' color='white' className='opacity-75'>
                        {t('dms.frontPagesShared.footer.downloadOnThe')}
                      </Typography>
                      <Typography color='white' className='font-medium opacity-[0.92]'>
                        {t('dms.frontPagesShared.footer.googlePlay')}
                      </Typography>
                    </div>
                  </div>
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className='bg-[#211B2C]'>
        <div
          className={classnames(
            'flex flex-wrap items-center justify-center sm:justify-between gap-4 plb-[15px]',
            frontCommonStyles.layoutSpacing
          )}
        >
          <Typography className='text-white' variant='body2'>
            <span>{`© ${new Date().getFullYear()}, ${t('dms.frontPagesShared.footer.madeWith')}`}</span>
            <span>{` ❤️ `}</span>
            <span>{`${t('dms.frontPagesShared.footer.by')} `}</span>
            <Link href='https://pixinvent.com/' target='_blank' className='font-medium text-white'>
              Pixinvent
            </Link>
          </Typography>
          <div className='flex gap-1.5 items-center'>
            <IconButton component={Link} size='small' href='https://github.com/pixinvent' target='_blank'>
              <i className='tabler-brand-github-filled text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='https://www.facebook.com/pixinvents/' target='_blank'>
              <i className='tabler-brand-facebook-filled text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='https://x.com/pixinvents' target='_blank'>
              <i className='tabler-brand-twitter-filled text-white text-lg' />
            </IconButton>
            <IconButton
              component={Link}
              size='small'
              href='https://www.youtube.com/channel/UClOcB3o1goJ293ri_Hxpklg'
              target='_blank'
            >
              <i className='tabler-brand-youtube-filled text-white text-lg' />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
