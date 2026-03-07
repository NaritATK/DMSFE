// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

type PopularArticlesType = {
  title: string
  icon: string
  articles: { title: string }[]
}

const KnowledgeBase = () => {
  const { t } = useDictionary()

  const allArticles: PopularArticlesType[] = [
    {
      title: t('dms.frontPages.helpCenter.knowledgeBase.categories.0.title'),
      icon: 'tabler-shopping-cart',
      articles: [
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.0.articles.0') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.0.articles.1') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.0.articles.2') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.0.articles.3') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.0.articles.4') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.0.articles.5') }
      ]
    },
    {
      title: t('dms.frontPages.helpCenter.knowledgeBase.categories.1.title'),
      icon: 'tabler-help',
      articles: [
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.1.articles.0') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.1.articles.1') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.1.articles.2') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.1.articles.3') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.1.articles.4') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.1.articles.5') }
      ]
    },
    {
      title: t('dms.frontPages.helpCenter.knowledgeBase.categories.2.title'),
      icon: 'tabler-currency-dollar',
      articles: [
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.2.articles.0') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.2.articles.1') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.2.articles.2') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.2.articles.3') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.2.articles.4') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.2.articles.5') }
      ]
    },
    {
      title: t('dms.frontPages.helpCenter.knowledgeBase.categories.3.title'),
      icon: 'tabler-color-swatch',
      articles: [
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.3.articles.0') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.3.articles.1') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.3.articles.2') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.3.articles.3') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.3.articles.4') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.3.articles.5') }
      ]
    },
    {
      title: t('dms.frontPages.helpCenter.knowledgeBase.categories.4.title'),
      icon: 'tabler-lock-open',
      articles: [
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.4.articles.0') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.4.articles.1') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.4.articles.2') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.4.articles.3') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.4.articles.4') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.4.articles.5') }
      ]
    },
    {
      title: t('dms.frontPages.helpCenter.knowledgeBase.categories.5.title'),
      icon: 'tabler-user',
      articles: [
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.5.articles.0') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.5.articles.1') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.5.articles.2') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.5.articles.3') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.5.articles.4') },
        { title: t('dms.frontPages.helpCenter.knowledgeBase.categories.5.articles.5') }
      ]
    }
  ]

  return (
    <section className={classnames('flex flex-col gap-6 md:plb-[100px] plb-[50px]', frontCommonStyles.layoutSpacing)}>
      <Typography variant='h4' className='text-center'>
        {t('dms.frontPages.helpCenter.knowledgeBase.title')}
      </Typography>
      <Grid container spacing={6}>
        {allArticles.map((article, index) => {
          return (
            <Grid size={{ xs: 12, lg: 4 }} key={index}>
              <Card>
                <CardContent className='flex flex-col items-start gap-6 text-center'>
                  <div className='flex gap-3 items-center'>
                    <CustomAvatar skin='light' variant='rounded' color='primary' size={32}>
                      <i className={classnames('text-xl', article.icon)} />
                    </CustomAvatar>
                    <Typography variant='h5'>{article.title}</Typography>
                  </div>
                  <div className='flex flex-col gap-2 is-full'>
                    {article.articles.map((data, articleIndex) => {
                      return (
                        <div key={articleIndex} className='flex justify-between items-center gap-2'>
                          <Typography
                            color='text.primary'
                            component={Link}
                            href='/front-pages/help-center/article/how-to-add-product-in-cart'
                            className='truncate'
                          >
                            {data.title}
                          </Typography>
                          <DirectionalIcon
                            ltrIconClass='tabler-chevron-right text-textDisabled text-xl'
                            rtlIconClass='tabler-chevron-left text-textDisabled text-xl'
                          />
                        </div>
                      )
                    })}
                  </div>
                  <Link
                    href='/front-pages/help-center/article/how-to-add-product-in-cart'
                    className='flex items-center gap-x-2 text-primary'
                  >
                    <span className='font-medium'>{t('dms.frontPages.helpCenter.knowledgeBase.seeAllArticles')}</span>
                    <DirectionalIcon
                      className='text-lg'
                      ltrIconClass='tabler-arrow-right'
                      rtlIconClass='tabler-arrow-left'
                    />
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </section>
  )
}

export default KnowledgeBase
