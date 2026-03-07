// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Plans = () => {
  const { t } = useDictionary()

  const features = [
    {
      feature: t('dms.frontPages.pricing.plans.features.0'),
      starter: true,
      pro: true,
      enterprise: true,
      addOnAvailable: { starter: false, pro: false, enterprise: false }
    },
    {
      feature: t('dms.frontPages.pricing.plans.features.1'),
      starter: false,
      pro: false,
      enterprise: true,
      addOnAvailable: { starter: false, pro: false, enterprise: false }
    },
    {
      feature: t('dms.frontPages.pricing.plans.features.2'),
      starter: false,
      pro: true,
      enterprise: true,
      addOnAvailable: { starter: false, pro: false, enterprise: false }
    },
    {
      feature: t('dms.frontPages.pricing.plans.features.3'),
      starter: false,
      pro: false,
      enterprise: true,
      addOnAvailable: { starter: false, pro: true, enterprise: false }
    },
    {
      feature: t('dms.frontPages.pricing.plans.features.4'),
      starter: false,
      pro: true,
      enterprise: true,
      addOnAvailable: { starter: false, pro: false, enterprise: false }
    },
    {
      feature: t('dms.frontPages.pricing.plans.features.5'),
      starter: false,
      pro: false,
      enterprise: true,
      addOnAvailable: { starter: false, pro: true, enterprise: false }
    },
    {
      feature: t('dms.frontPages.pricing.plans.features.6'),
      starter: false,
      pro: false,
      enterprise: true,
      addOnAvailable: { starter: false, pro: false, enterprise: false }
    },
    {
      feature: t('dms.frontPages.pricing.plans.features.7'),
      starter: false,
      pro: false,
      enterprise: true,
      addOnAvailable: { starter: false, pro: false, enterprise: false }
    }
  ]

  const plans = [
    { variant: 'tonal' as const, label: t('dms.frontPages.pricing.plans.choosePlan'), plan: 'starter' },
    { variant: 'contained' as const, label: t('dms.frontPages.pricing.plans.choosePlan'), plan: 'pro' },
    { variant: 'tonal' as const, label: t('dms.frontPages.pricing.plans.choosePlan'), plan: 'enterprise' }
  ]

  return (
    <section className='md:plb-[100px] plb-[50px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <div className='flex flex-col text-center gap-2 mbe-6'>
          <Typography variant='h3'>{t('dms.frontPages.pricing.plans.title')}</Typography>
          <Typography>{t('dms.frontPages.pricing.plans.subtitle')}</Typography>
        </div>
        <div className='overflow-x-auto border-x border-be rounded'>
          <table className={tableStyles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>
                  <>{t('dms.frontPages.pricing.plans.table.featuresLabel')}</>
                  <Typography variant='body2' className='capitalize'>
                    {t('dms.frontPages.pricing.plans.table.featuresSubLabel')}
                  </Typography>
                </th>
                <th>
                  <>{t('dms.frontPages.pricing.plans.table.starterLabel')}</>
                  <Typography variant='body2' className='capitalize'>
                    {t('dms.frontPages.pricing.plans.table.starterPrice')}
                  </Typography>
                </th>
                <th>
                  <div className='flex justify-center gap-x-2'>
                    <>{t('dms.frontPages.pricing.plans.table.proLabel')}</>
                    <CustomAvatar size={20} color='primary'>
                      <i className='tabler-star text-[14px]' />
                    </CustomAvatar>
                  </div>
                  <Typography variant='body2' className='capitalize'>
                    {t('dms.frontPages.pricing.plans.table.proPrice')}
                  </Typography>
                </th>
                <th>
                  <>{t('dms.frontPages.pricing.plans.table.enterpriseLabel')}</>
                  <Typography variant='body2' className='capitalize'>
                    {t('dms.frontPages.pricing.plans.table.enterprisePrice')}
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody className={classnames('border-be', styles.tableBody)}>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td>
                    <Typography color='text.primary'>{feature.feature}</Typography>
                  </td>
                  <td className='flex items-center justify-center'>
                    {feature.starter ? (
                      <CustomAvatar skin='light' color='primary' size={20}>
                        <i className='tabler-check text-primary text-[14px]' />
                      </CustomAvatar>
                    ) : (
                      <CustomAvatar skin='light' color='secondary' size={20}>
                        <i className='tabler-x text-[14px]' />
                      </CustomAvatar>
                    )}
                  </td>
                  <td>
                    <div className='flex items-center justify-center'>
                      {feature.pro ? (
                        <CustomAvatar skin='light' color='primary' size={20}>
                          <i className='tabler-check text-primary text-[14px]' />
                        </CustomAvatar>
                      ) : feature.addOnAvailable.pro && !feature.pro ? (
                        <Chip variant='tonal' size='small' color='primary' label={t('dms.frontPages.pricing.plans.addOnAvailable')} />
                      ) : (
                        <CustomAvatar skin='light' color='secondary' size={20}>
                          <i className='tabler-x text-[14px]' />
                        </CustomAvatar>
                      )}
                    </div>
                  </td>
                  <td className='flex items-center justify-center'>
                    {feature.enterprise ? (
                      <CustomAvatar skin='light' color='primary' size={20}>
                        <i className='tabler-check text-primary text-[14px]' />
                      </CustomAvatar>
                    ) : (
                      <CustomAvatar skin='light' color='secondary' size={20}>
                        <i className='tabler-x text-[14px]' />
                      </CustomAvatar>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                {plans.map((plan, index) => (
                  <td key={index} className='text-center plb-[9px]'>
                    <Button component={Link} href='/front-pages/payment' variant={plan.variant}>
                      {plan.label}
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Plans
