// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'
import { useDictionary } from '@/hooks/useDictionary'

const StepAccountDetails = ({ handleNext }: { handleNext: () => void }) => {
  const { t } = useDictionary()
  // States
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  const handleClickShowConfirmPassword = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown)
  }

  return (
    <>
      <div className='mbe-5'>
        <Typography variant='h4'>{t('dms.authTemplates.accountInfo')}</Typography>
        <Typography>{t('dms.authTemplates.enterAccountDetails')}</Typography>
      </div>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField fullWidth label={t('dms.register.username')} placeholder='johnDoe' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField fullWidth type='email' label={t('dms.common.email')} placeholder='john.deo@gmail.com' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            fullWidth
            label={t('dms.common.password')}
            placeholder='············'
            id='outlined-adornment-password'
            type={isPasswordShown ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                    >
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            fullWidth
            label={t('dms.authTemplates.confirmPassword')}
            placeholder='············'
            id='outlined-confirm-password'
            type={isConfirmPasswordShown ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle confirm password visibility'
                    >
                      <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CustomTextField fullWidth label={t('dms.authTemplates.profileLink')} placeholder='johndoe/profile' />
        </Grid>
        <Grid size={{ xs: 12 }} className='flex justify-between'>
          <Button
            disabled
            variant='tonal'
            color='secondary'
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

export default StepAccountDetails
