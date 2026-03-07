// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Component Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import CustomTextField from '@core/components/mui/TextField'
import { useDictionary } from '@/hooks/useDictionary'
import DirectionalIcon from '@components/DirectionalIcon'
import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Styled Components
const Content = styled(Typography, {
  name: 'MuiCustomInputVertical',
  slot: 'content'
})<TypographyProps>(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center'
}))

const StepBillingDetails = ({ handlePrev }: { handlePrev: () => void }) => {
  const { t } = useDictionary()

  const customInputData: CustomInputVerticalData[] = [
    {
      title: t('dms.authTemplates.planBasic'),
      value: 'basic',
      content: (
        <Content component='div' className='flex flex-col justify-center items-center bs-full gap-2'>
          <Typography>{t('dms.authTemplates.planBasicDescription')}</Typography>
          <div className='flex items-baseline'>
            <Typography component='sup' className='self-start' color='primary.main'>
              $
            </Typography>
            <Typography component='span' variant='h3' color='primary.main'>
              0
            </Typography>
            <Typography component='sub' className='self-baseline text-textDisabled'>
              {t('dms.authTemplates.perMonth')}
            </Typography>
          </div>
        </Content>
      )
    },
    {
      title: t('dms.authTemplates.planStandard'),
      value: 'standard',
      content: (
        <Content component='div' className='flex flex-col justify-center items-center bs-full gap-2'>
          <Typography>{t('dms.authTemplates.planStandardDescription')}</Typography>
          <div className='flex items-baseline'>
            <Typography component='sup' className='self-start' color='primary.main'>
              $
            </Typography>
            <Typography component='span' variant='h3' color='primary.main'>
              99
            </Typography>
            <Typography component='sub' className='self-baseline text-textDisabled'>
              {t('dms.authTemplates.perMonth')}
            </Typography>
          </div>
        </Content>
      ),
      isSelected: true
    },
    {
      title: t('dms.authTemplates.planEnterprise'),
      value: 'enterprise',
      content: (
        <Content component='div' className='flex flex-col justify-center items-center bs-full gap-2'>
          <Typography>{t('dms.authTemplates.planEnterpriseDescription')}</Typography>
          <div className='flex items-baseline'>
            <Typography component='sup' className='self-start' color='primary.main'>
              $
            </Typography>
            <Typography component='span' variant='h3' color='primary.main'>
              499
            </Typography>
            <Typography component='sub' className='self-baseline text-textDisabled'>
              {t('dms.authTemplates.perMonth')}
            </Typography>
          </div>
        </Content>
      )
    }
  ]

  const initialSelectedOption: string = customInputData.filter(item => item.isSelected)[
    customInputData.filter(item => item.isSelected).length - 1
  ].value

  // States
  const [selectedOption, setSelectedOption] = useState<string>(initialSelectedOption)

  const handleOptionChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelectedOption(prop)
    } else {
      setSelectedOption((prop.target as HTMLInputElement).value)
    }
  }

  return (
    <>
      <div className='mbe-5'>
        <Typography variant='h4'>{t('dms.authTemplates.selectPlan')}</Typography>
        <Typography>{t('dms.authTemplates.selectPlanRequirement')}</Typography>
      </div>
      <Grid container spacing={5}>
        {customInputData.map((item, index) => (
          <CustomInputVertical
            type='radio'
            key={index}
            data={item}
            gridProps={{ size: { xs: 12, sm: 4 } }}
            selected={selectedOption}
            name='custom-radios-basic'
            handleChange={handleOptionChange}
          />
        ))}
      </Grid>
      <div className='mbs-6 md:mbs-12 mbe-6'>
        <Typography variant='h4'>{t('dms.authTemplates.paymentInfo')}</Typography>
        <Typography>{t('dms.authTemplates.enterCardInfo')}</Typography>
      </div>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.cardNumber')} placeholder='1356 3215 6548 7898' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.nameOnCard')} placeholder='John Doe' />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.expiryDate')} placeholder='MM/YY' />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.cvvCode')} placeholder='654' />
        </Grid>
        <Grid size={{ xs: 12 }} className='flex justify-between'>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
          >
            {t('dms.authTemplates.previous')}
          </Button>
          <Button variant='contained' color='success' onClick={() => alert(t('dms.authTemplates.submitted'))}>
            {t('dms.authTemplates.submit')}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default StepBillingDetails
