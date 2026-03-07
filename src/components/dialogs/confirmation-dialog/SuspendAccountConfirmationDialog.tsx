'use client'

// React Imports
import { useState } from 'react'

// Component Imports
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import BaseConfirmationDialog from './BaseConfirmationDialog'
import ResultDialog from './ResultDialog'

// MUI Imports

type SuspendAccountConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SuspendAccountConfirmationDialog = ({ open, setOpen }: SuspendAccountConfirmationDialogProps) => {
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
        title='Are you sure?'
        actions={
          <>
            <Button variant='contained' onClick={() => handleConfirmation(true)}>
              Yes, Suspend User!
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => handleConfirmation(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <Typography color='text.primary'>You won&#39;t be able to revert user!</Typography>
      </BaseConfirmationDialog>
      <ResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        isSuccess={isSuccess}
        title={isSuccess ? 'Suspended!' : 'Cancelled'}
        message={isSuccess ? 'User has been suspended.' : 'Cancelled Suspension :)'}
      />
    </>
  )
}

export default SuspendAccountConfirmationDialog
