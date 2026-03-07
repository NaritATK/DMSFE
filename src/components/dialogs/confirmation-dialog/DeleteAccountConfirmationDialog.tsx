'use client'

// React Imports
import { useState } from 'react'

// Component Imports
import Button from '@mui/material/Button'

import BaseConfirmationDialog from './BaseConfirmationDialog'
import ResultDialog from './ResultDialog'

// MUI Imports

type DeleteAccountConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DeleteAccountConfirmationDialog = ({ open, setOpen }: DeleteAccountConfirmationDialogProps) => {
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
        title='Are you sure you want to deactivate your account?'
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
        title={isSuccess ? 'Deactivated' : 'Cancelled'}
        message={
          isSuccess
            ? 'Your account has been deactivated successfully.'
            : 'Account Deactivation Cancelled!'
        }
      />
    </>
  )
}

export default DeleteAccountConfirmationDialog
