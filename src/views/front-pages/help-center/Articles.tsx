// React Imports
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
import Gift from '@assets/svg/front-pages/help-center/Gift'
import Rocket from '@assets/svg/front-pages/help-center/Rocket'
import File from '@assets/svg/front-pages/help-center/File'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Types
type popularArticlesType = {
  slug: string
  title: string
  svg: ReactNode
  subtitle: string
}

const Articles = () => {
  const { t } = useDictionary()

  const popularArticles: popularArticlesType[] = [
    {
      slug: 'getting-started',
      title: t('dms.frontPages.helpCenter.articles.items.0.title'),
      svg: <Rocket color='var(--mui-palette-text-secondary)' />,
      subtitle: t('dms.frontPages.helpCenter.articles.items.0.subtitle')
    },
    {
      slug: 'first-steps',
      title: t('dms.frontPages.helpCenter.articles.items.1.title'),
      svg: <Gift color='var(--mui-palette-text-secondary)' />,
      subtitle: t('dms.frontPages.helpCenter.articles.items.1.subtitle')
    },
    {
      slug: 'external-content',
      title: t('dms.frontPages.helpCenter.articles.items.2.title'),
      svg: <File color='var(--mui-palette-text-secondary)' />,
      subtitle: t('dms.frontPages.helpCenter.articles.items.2.subtitle')
    }
  ]

  return (
    <section className='md:plb-[100px] plb-[50px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Typography variant='h4' className='text-center mbe-6'>
          {t('dms.frontPages.helpCenter.articles.title')}
        </Typography>
        <Grid container spacing={6}>
          {popularArticles.map((article, index) => {
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

export default Articles
