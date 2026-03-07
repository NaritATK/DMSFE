// MUI Imports
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Questions = () => {
  const { t } = useDictionary()

  const articleList = [
    t('dms.frontPages.helpCenter.article.sidebarArticles.0'),
    t('dms.frontPages.helpCenter.article.sidebarArticles.1'),
    t('dms.frontPages.helpCenter.article.sidebarArticles.2'),
    t('dms.frontPages.helpCenter.article.sidebarArticles.3'),
    t('dms.frontPages.helpCenter.article.sidebarArticles.4'),
    t('dms.frontPages.helpCenter.article.sidebarArticles.5')
  ]

  return (
    <section className='flex flex-col justify-center items-center gap-4 md:plb-[100px] plb-[50px] pbs-[70px] -mbs-[70px] bg-backgroundPaper'>
      <div className={classnames('pbs-10 md:pbs-16', frontCommonStyles.layoutSpacing)}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <div className='flex flex-col gap-2'>
              <Breadcrumbs aria-label='breadcrumb'>
                <Link className='hover:text-primary' href='/front-pages/help-center'>
                  {t('dms.frontPages.helpCenter.article.breadcrumbHome')}
                </Link>
                <Typography className='text-textPrimary'>{t('dms.frontPages.helpCenter.article.breadcrumbCurrent')}</Typography>
              </Breadcrumbs>
              <Typography variant='h4'>{t('dms.frontPages.helpCenter.article.title')}</Typography>
              <Typography>{t('dms.frontPages.helpCenter.article.updatedAt')}</Typography>
            </div>
            <Divider className='mlb-6' />
            <div className='flex flex-col gap-6'>
              <div>
                <Typography className='mbe-4'>{t('dms.frontPages.helpCenter.article.content.0')}</Typography>
                <Typography>{t('dms.frontPages.helpCenter.article.content.1')}</Typography>
              </div>
              <img src='/images/front-pages/product.png' alt={t('dms.frontPages.helpCenter.article.productImageAlt')} className='rounded is-full max-is-auto' />
              <Typography>{t('dms.frontPages.helpCenter.article.content.2')}</Typography>
              <img
                src='/images/front-pages/checkout.png'
                alt={t('dms.frontPages.helpCenter.article.checkoutImageAlt')}
                className='rounded is-full max-is-auto'
              />
            </div>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }} className='flex flex-col gap-6'>
            <CustomTextField
              placeholder={t('dms.frontPages.helpCenter.article.searchPlaceholder')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search' />
                    </InputAdornment>
                  )
                }
              }}
            />
            <div className='flex flex-col gap-4'>
              <div className='pli-5 plb-2 bg-actionHover rounded'>
                <Typography variant='h5'>{t('dms.frontPages.helpCenter.article.sectionTitle')}</Typography>
              </div>
              <div className='flex flex-col gap-4'>
                {articleList.map((article, index) => (
                  <Typography key={index} component={Link} className='flex gap-2 justify-between hover:text-primary'>
                    <Typography color='inherit'>{article}</Typography>
                    <DirectionalIcon
                      ltrIconClass='tabler-chevron-right text-textDisabled text-xl'
                      rtlIconClass='tabler-chevron-left text-textDisabled text-xl'
                      className='text-textDisabled'
                    />
                  </Typography>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default Questions
