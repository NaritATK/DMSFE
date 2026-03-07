'use client'

// React Imports
import { useState } from 'react'

// Component Imports
import Button from '@mui/material/Button'

import BaseConfirmationDialog from './BaseConfirmationDialog'
import ResultDialog from './ResultDialog'

// MUI Imports

type UnsubscribeConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const UnsubscribeConfirmationDialog = ({ open, setOpen }: UnsubscribeConfirmationDialogProps) => {
  // States
  const [resultDialogOpen, setResultDialogOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleConfirmation = (value: boolean) => {
    setOpen(false)
    setIsSuccess(value)
    setResultDialogOpen(true)
  }

  return (
    <>
      <BaseConfirmationDialog
        open={open}
        setOpen={setOpen}
        title='Are you sure to cancel your subscription?'
        actions={
          <>
            <Button variant='contained' onClick={() => handleConfirmation(true)}>
              Yes
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => handleConfirmation(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <></>
      </BaseConfirmationDialog>
      <ResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        isSuccess={isSuccess}
        title={isSuccess ? 'Unsubscribed' : 'Cancelled'}
        message={
          isSuccess
            ? 'Your subscription cancelled successfully.'
            : 'Unsubscription Cancelled!!'
        }
      />
    </>
  )
}

export default UnsubscribeConfirmationDialog
