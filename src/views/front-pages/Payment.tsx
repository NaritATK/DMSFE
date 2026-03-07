'use client'

// React Imports
import type { ChangeEvent } from 'react'
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import type { ButtonProps } from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { CustomInputHorizontalData } from '@core/components/custom-inputs/types'
import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import PricingDialog from '@components/dialogs/pricing'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import DirectionalIcon from '@components/DirectionalIcon'
import { useSettings } from '@core/hooks/useSettings'
import CustomTextField from '@core/components/mui/TextField'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Payment = ({ data }: { data: PricingPlanType[] }) => {
  const { t } = useDictionary()

  // Vars
  const buttonProps: ButtonProps = {
    variant: 'tonal',
    children: t('dms.frontPages.payment.orderSummary.changePlan')
  }

  const cardData: CustomInputHorizontalData[] = [
    {
      title: (
        <div className='flex items-center gap-4'>
          <Avatar
            variant='rounded'
            className='is-[58px] bs-[34px]'
            sx={theme => ({
              backgroundColor: 'var(--mui-palette-action-hover)',
              ...theme.applyStyles('dark', {
                backgroundColor: 'var(--mui-palette-common-white)'
              })
            })}
          >
            <img src='/images/logos/visa.png' alt={t('dms.frontPages.payment.methods.creditCardAlt')} className='bs-3' />
          </Avatar>
          <Typography color='text.primary' className='font-medium'>
            {t('dms.frontPages.payment.methods.creditCard')}
          </Typography>
        </div>
      ),
      value: 'credit-card',
      isSelected: true
    },
    {
      title: (
        <div className='flex items-center gap-4'>
          <Avatar
            variant='rounded'
            className='is-[58px] bs-[34px]'
            sx={theme => ({
              backgroundColor: 'var(--mui-palette-action-hover)',
              ...theme.applyStyles('dark', {
                backgroundColor: 'var(--mui-palette-common-white)'
              })
            })}
          >
            <img src='/images/logos/paypal.png' alt={t('dms.frontPages.payment.methods.paypalAlt')} className='bs-5' />
          </Avatar>
          <Typography color='text.primary' className='font-medium'>
            {t('dms.frontPages.payment.methods.paypal')}
          </Typography>
        </div>
      ),
      value: 'paypal'
    }
  ]

  const countries = [
    t('dms.frontPages.payment.countries.australia'),
    t('dms.frontPages.payment.countries.brazil'),
    t('dms.frontPages.payment.countries.canada'),
    t('dms.frontPages.payment.countries.india'),
    t('dms.frontPages.payment.countries.unitedArabEmirates'),
    t('dms.frontPages.payment.countries.unitedKingdom'),
    t('dms.frontPages.payment.countries.unitedStates')
  ]

  const initialSelected = cardData.find(item => item.isSelected)?.value ?? cardData[0].value

  // States
  const [selectCountry, setSelectCountry] = useState(t('dms.frontPages.payment.countries.brazil'))
  const [selectInput, setSelectInput] = useState<string>(initialSelected)

  // Hooks
  const { updatePageSettings } = useSettings()

  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectCountry(event.target.value)
  }

  const handlePaymentChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelectInput(prop)
    } else {
      setSelectInput((prop.target as HTMLInputElement).value)
    }
  }

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={classnames('md:plb-[100px] plb-6', frontCommonStyles.layoutSpacing)}>
      <Card>
        <Grid container>
          <Grid size={{ md: 12, lg: 7 }}>
            <CardContent className='flex flex-col max-sm:gap-y-5 gap-y-8 sm:p-8 border-be lg:border-be-0 lg:border-e bs-full'>
              <div className='flex flex-col gap-2'>
                <Typography variant='h4'>{t('dms.frontPages.payment.checkout.title')}</Typography>
                <Typography>{t('dms.frontPages.payment.checkout.subtitle')}</Typography>
              </div>
              <Grid container spacing={4}>
                {cardData.map(item => (
                  <CustomInputHorizontal
                    key={item.value}
                    type='radio'
                    name='payment-method'
                    data={item}
                    selected={selectInput}
                    handleChange={handlePaymentChange}
                    gridProps={{ size: { xs: 12, sm: 6 } }}
                  />
                ))}
              </Grid>
              <div>
                <Typography variant='h4' className='mbe-6'>
                  {t('dms.frontPages.payment.billingDetails.title')}
                </Typography>
                <Grid container spacing={5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField fullWidth label={t('dms.frontPages.payment.billingDetails.emailLabel')} placeholder={t('dms.frontPages.payment.billingDetails.emailPlaceholder')} type='email' />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      fullWidth
                      type='password'
                      id='password-input'
                      label={t('dms.frontPages.payment.billingDetails.passwordLabel')}
                      placeholder={t('dms.frontPages.payment.billingDetails.passwordPlaceholder')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      select
                      fullWidth
                      label={t('dms.frontPages.payment.billingDetails.countryLabel')}
                      name='country'
                      variant='outlined'
                      value={selectCountry}
                      onChange={handleCountryChange}
                    >
                      {countries.map(country => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label={t('dms.frontPages.payment.billingDetails.zipLabel')}
                      id='postal-code-input'
                      placeholder={t('dms.frontPages.payment.billingDetails.zipPlaceholder')}
                      fullWidth
                      type='number'
                    />
                  </Grid>
                </Grid>
              </div>
              {selectInput === 'credit-card' && (
                <div>
                  <Typography variant='h4' className='mbe-6'>
                    {t('dms.frontPages.payment.cardInfo.title')}
                  </Typography>
                  <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                      <CustomTextField
                        fullWidth
                        id='card-number-input'
                        placeholder={t('dms.frontPages.payment.cardInfo.cardNumberPlaceholder')}
                        label={t('dms.frontPages.payment.cardInfo.cardNumberLabel')}
                        type='number'
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField fullWidth id='card-holder-name' placeholder={t('dms.frontPages.payment.cardInfo.cardHolderPlaceholder')} label={t('dms.frontPages.payment.cardInfo.cardHolderLabel')} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <CustomTextField
                        fullWidth
                        id='expiry-date'
                        placeholder={t('dms.frontPages.payment.cardInfo.expDatePlaceholder')}
                        label={t('dms.frontPages.payment.cardInfo.expDateLabel')}
                        type='number'
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <CustomTextField fullWidth id='cvv' placeholder={t('dms.frontPages.payment.cardInfo.cvvPlaceholder')} label={t('dms.frontPages.payment.cardInfo.cvvLabel')} type='number' />
                    </Grid>
                  </Grid>
                </div>
              )}
            </CardContent>
          </Grid>
          <Grid size={{ md: 12, lg: 5 }}>
            <CardContent className='flex flex-col gap-8 sm:p-8'>
              <div className='flex flex-col gap-2'>
                <Typography variant='h4'>{t('dms.frontPages.payment.orderSummary.title')}</Typography>
                <Typography>{t('dms.frontPages.payment.orderSummary.subtitle')}</Typography>
              </div>
              <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-4 p-6 bg-actionHover rounded-sm'>
                  <Typography>{t('dms.frontPages.payment.orderSummary.planName')}</Typography>
                  <div className='flex items-baseline'>
                    <Typography variant='h1'>$59.99</Typography>
                    <Typography component='sub'>{t('dms.frontPages.payment.orderSummary.perMonth')}</Typography>
                  </div>
                  <OpenDialogOnElementClick
                    element={Button}
                    elementProps={buttonProps}
                    dialog={PricingDialog}
                    dialogProps={{ data }}
                  />
                </div>
                <div>
                  <div className='flex gap-2 items-center justify-between mbe-2'>
                    <Typography>{t('dms.frontPages.payment.orderSummary.subscription')}</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      $85.99
                    </Typography>
                  </div>
                  <div className='flex gap-2 items-center justify-between'>
                    <Typography>{t('dms.frontPages.payment.orderSummary.tax')}</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      $4.99
                    </Typography>
                  </div>
                  <Divider className='mlb-4' />
                  <div className='flex gap-2 items-center justify-between'>
                    <Typography>{t('dms.frontPages.payment.orderSummary.total')}</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      $90.98
                    </Typography>
                  </div>
                </div>
                <Button
                  variant='contained'
                  color='success'
                  endIcon={<DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />}
                >
                  {t('dms.frontPages.payment.orderSummary.proceed')}
                </Button>
              </div>
              <Typography>{t('dms.frontPages.payment.footerNote')}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </section>
  )
}

export default Payment
