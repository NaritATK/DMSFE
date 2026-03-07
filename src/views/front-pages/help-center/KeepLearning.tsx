import type { ReactNode } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// SVG Imports
import Laptop from '@assets/svg/front-pages/help-center/Laptop'
import Bulb from '@assets/svg/front-pages/help-center/Bulb'
import Discord from '@assets/svg/front-pages/help-center/Discord'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Types
type keepLearningType = {
  slug: string
  title: string
  svg: ReactNode
  subtitle: string
}

const KeepLearning = () => {
  const { t } = useDictionary()

  const keepLearning: keepLearningType[] = [
    {
      slug: 'blogging',
      title: t('dms.frontPages.helpCenter.keepLearning.items.0.title'),
      svg: <Laptop color='var(--mui-palette-text-secondary)' />,
      subtitle: t('dms.frontPages.helpCenter.keepLearning.items.0.subtitle')
    },
    {
      slug: 'inspiration-center',
      title: t('dms.frontPages.helpCenter.keepLearning.items.1.title'),
      svg: <Bulb color='var(--mui-palette-text-secondary)' />,
      subtitle: t('dms.frontPages.helpCenter.keepLearning.items.1.subtitle')
    },
    {
      slug: 'community',
      title: t('dms.frontPages.helpCenter.keepLearning.items.2.title'),
      svg: <Discord color='var(--mui-palette-text-secondary)' />,
      subtitle: t('dms.frontPages.helpCenter.keepLearning.items.2.subtitle')
    }
  ]

  return (
    <section className='flex flex-col md:plb-[100px] plb-[50px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Typography variant='h4' className='text-center mbe-6'>
          {t('dms.frontPages.helpCenter.keepLearning.title')}
        </Typography>
        <Grid container spacing={6}>
          {keepLearning.map((article, index) => {
            return (
              <Grid size={{ xs: 12, lg: 4 }} key={index}>
                <Card variant='outlined'>
                  <CardContent className='flex flex-col items-center justify-center gap-3 text-center'>
                    {article.svg}
                    <Typography variant='h5'>{article.title}</Typography>
                    <Typography>{article.subtitle}</Typography>
                    <Button
                      component={Link}
                      href='/front-pages/help-center/article/how-to-add-product-in-cart'
                      variant='tonal'
                      size='small'
                    >
                      {t('dms.frontPages.helpCenter.readMore')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
    </section>
  )
}

export default KeepLearning
