'use client'

// React Imports
import { useEffect } from 'react'

// Third-party Imports
import classnames from 'classnames'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useSettings } from '@core/hooks/useSettings'

// Styles Imports
import frontCommonStyles from './styles.module.css'

const CheckoutPage = () => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={classnames('md:plb-[100px] plb-6', frontCommonStyles.layoutSpacing)}>
      <Box className='flex flex-col items-center justify-center p-8'>
        <Typography variant='h4'>Checkout</Typography>
        <Typography variant='body2' color='text.secondary'>
          This page is under construction.
        </Typography>
      </Box>
    </section>
  )
}

export default CheckoutPage
