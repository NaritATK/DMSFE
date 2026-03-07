// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'
import { useDictionary } from '@/hooks/useDictionary'

const StepPersonalInfo = ({ handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }) => {
  const { t } = useDictionary()

  return (
    <>
      <div className='mbe-5'>
        <Typography variant='h4'>{t('dms.authTemplates.personalInfo')}</Typography>
        <Typography>{t('dms.authTemplates.enterPersonalInfo')}</Typography>
      </div>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.firstName')} placeholder='John' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.lastName')} placeholder='Doe' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            fullWidth
            type='number'
            label={t('dms.authTemplates.mobile')}
            placeholder='202 555 0111'
            slotProps={{
              input: {
                startAdornment: <InputAdornment position='start'>{t('dms.authTemplates.countryCodeUS')}</InputAdornment>
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField fullWidth type='number' label={t('dms.authTemplates.pinCode')} placeholder='689421' />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.address')} placeholder='1456, Liberty Street' />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.landmark')} placeholder='Nr. Wall Street' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.city')} placeholder='Miami' />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomTextField select fullWidth label={t('dms.authTemplates.state')} defaultValue='new-york'>
            <MenuItem value='new-york'>{t('dms.authTemplates.stateNewYork')}</MenuItem>
            <MenuItem value='california'>{t('dms.authTemplates.stateCalifornia')}</MenuItem>
            <MenuItem value='texas'>{t('dms.authTemplates.stateTexas')}</MenuItem>
            <MenuItem value='florida'>{t('dms.authTemplates.stateFlorida')}</MenuItem>
            <MenuItem value='washington'>{t('dms.authTemplates.stateWashington')}</MenuItem>
          </CustomTextField>
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
          <Button
            variant='contained'
            onClick={handleNext}
            endIcon={<DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />}
          >
            {t('dms.authTemplates.next')}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default StepPersonalInfo
