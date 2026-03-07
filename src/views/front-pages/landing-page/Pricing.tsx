// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Hook Imports
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

const pricingPlans = [
  {
    titleKey: 'dms.frontPages.landing.pricing.plans.basic.title',
    img: '/images/front-pages/landing-page/pricing-basic.png',
    monthlyPay: 19,
    annualPay: 14,
    perYearPay: 168,
    featureKeys: [
      'dms.frontPages.landing.pricing.features.timeline',
      'dms.frontPages.landing.pricing.features.basicSearch',
      'dms.frontPages.landing.pricing.features.liveChatWidget',
      'dms.frontPages.landing.pricing.features.emailMarketing',
      'dms.frontPages.landing.pricing.features.customForms',
      'dms.frontPages.landing.pricing.features.trafficAnalytics'
    ],
    current: false
  },
  {
    titleKey: 'dms.frontPages.landing.pricing.plans.team.title',
    img: '/images/front-pages/landing-page/pricing-team.png',
    monthlyPay: 29,
    annualPay: 22,
    perYearPay: 264,
    featureKeys: [
      'dms.frontPages.landing.pricing.features.everythingInBasic',
      'dms.frontPages.landing.pricing.features.timelineWithDatabase',
      'dms.frontPages.landing.pricing.features.advancedSearch',
      'dms.frontPages.landing.pricing.features.marketingAutomation',
      'dms.frontPages.landing.pricing.features.advancedChatbot',
      'dms.frontPages.landing.pricing.features.campaignManagement'
    ],
    current: true
  },
  {
    titleKey: 'dms.frontPages.landing.pricing.plans.enterprise.title',
    img: '/images/front-pages/landing-page/pricing-enterprise.png',
    monthlyPay: 49,
    annualPay: 37,
    perYearPay: 444,
    featureKeys: [
      'dms.frontPages.landing.pricing.features.campaignManagement',
      'dms.frontPages.landing.pricing.features.timelineWithDatabase',
      'dms.frontPages.landing.pricing.features.fuzzySearch',
      'dms.frontPages.landing.pricing.features.abTestingSandbox',
      'dms.frontPages.landing.pricing.features.customPermissions',
      'dms.frontPages.landing.pricing.features.socialMediaAutomation'
    ],
    current: false
  }
]

const PricingPlan = () => {
  // States
  const [pricingPlan, setPricingPlan] = useState<'monthly' | 'annually'>('annually')

  // Hooks
  const { t } = useDictionary()

  const handleChange = (e: ChangeEvent<{ checked: boolean }>) => {
    if (e.target.checked) {
      setPricingPlan('annually')
    } else {
      setPricingPlan('monthly')
    }
  }

  return (
    <section
      id='pricing-plans'
      className={classnames(
        'flex flex-col gap-8 lg:gap-12 plb-[100px] bg-backgroundDefault rounded-[60px]',
        styles.sectionStartRadius
      )}
    >
      <div className={classnames('is-full', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip size='small' variant='tonal' color='primary' label={t('dms.frontPages.landing.pricing.chip')} />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography color='text.primary' variant='h4' className='text-center'>
                <span className='relative z-[1] font-extrabold'>
                  {t('dms.frontPages.landing.pricing.titleHighlight')}
                  <img
                    src='/images/front-pages/landing-page/bg-shape.png'
                    alt={t('dms.frontPages.landing.shared.bgShapeAlt')}
                    className='absolute block-end-0 z-[1] bs-[40%] is-[125%] sm:is-[132%] -inline-start-[10%] sm:inline-start-[-19%] block-start-[17px]'
                  />
                </span>{' '}
                {t('dms.frontPages.landing.pricing.titleSuffix')}
              </Typography>
            </div>
            <Typography className='text-center'>
              {t('dms.frontPages.landing.pricing.subtitleLine1')}
              <br />
              {t('dms.frontPages.landing.pricing.subtitleLine2')}
            </Typography>
          </div>
        </div>
        <div className='flex justify-center items-center max-sm:mlb-3 mbe-6'>
          <InputLabel htmlFor='pricing-switch' className='cursor-pointer'>
            {t('dms.frontPages.landing.pricing.payMonthly')}
          </InputLabel>
          <Switch id='pricing-switch' onChange={handleChange} checked={pricingPlan === 'annually'} />
          <InputLabel htmlFor='pricing-switch' className='cursor-pointer'>
            {t('dms.frontPages.landing.pricing.payAnnually')}
          </InputLabel>
          <div className='flex gap-x-1 items-start max-sm:hidden mis-2 mbe-5'>
            <img src='/images/front-pages/landing-page/pricing-arrow.png' width='50' alt={t('dms.frontPages.landing.pricing.saveArrowAlt')} />
            <Typography className='font-medium'>{t('dms.frontPages.landing.pricing.save')}</Typography>
          </div>
        </div>
        <Grid container spacing={6}>
          {pricingPlans.map((plan, index) => (
            <Grid key={index} size={{ xs: 12, lg: 4 }}>
              <Card className={`${plan.current && 'border-2 border-[var(--mui-palette-primary-main)] shadow-xl'}`}>
                <CardContent className='flex flex-col gap-8 p-8'>
                  <div className='is-full flex flex-col items-center gap-3'>
                    <img src={plan.img} alt={t(plan.titleKey)} height='88' width='86' className='text-center' />
                  </div>
                  <div className='flex flex-col items-center gap-y-[2px] relative'>
                    <Typography className='text-center' variant='h4'>
                      {t(plan.titleKey)}
                    </Typography>
                    <div className='flex items-baseline gap-x-1'>
                      <Typography variant='h2' color='primary.main' className='font-extrabold'>
                        ${pricingPlan === 'monthly' ? plan.monthlyPay : plan.annualPay}
                      </Typography>
                      <Typography color='text.disabled' className='font-medium'>
                        {t('dms.frontPages.landing.pricing.perMonth')}
                      </Typography>
                    </div>
                    {pricingPlan === 'annually' && (
                      <Typography color='text.disabled' className='absolute block-start-[100%]'>
                        ${plan.perYearPay} {t('dms.frontPages.landing.pricing.perYear')}
                      </Typography>
                    )}
                  </div>
                  <div>
                    <div className='flex flex-col gap-3 mbs-3'>
                      {plan.featureKeys.map((featureKey, featureIndex) => (
                        <div key={featureIndex} className='flex items-center gap-[12px]'>
                          <CustomAvatar color='primary' skin={plan.current ? 'filled' : 'light'} size={20}>
                            <i className='tabler-check text-sm' />
                          </CustomAvatar>
                          <Typography variant='h6'>{t(featureKey)}</Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button component={Link} href='/front-pages/payment' variant={plan.current ? 'contained' : 'tonal'}>
                    {t('dms.frontPages.landing.pricing.getStarted')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default PricingPlan
