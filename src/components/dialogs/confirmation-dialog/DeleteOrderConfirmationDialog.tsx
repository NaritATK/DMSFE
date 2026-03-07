'use client'

// React Imports
import { useState } from 'react'

// Component Imports
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import BaseConfirmationDialog from './BaseConfirmationDialog'
import ResultDialog from './ResultDialog'

// MUI Imports

type DeleteOrderConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DeleteOrderConfirmationDialog = ({ open, setOpen }: DeleteOrderConfirmationDialogProps) => {
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
              Yes, Delete Order!
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => handleConfirmation(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <Typography color='text.primary'>You won&#39;t be able to revert order!</Typography>
      </BaseConfirmationDialog>
      <ResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        isSuccess={isSuccess}
        title={isSuccess ? 'Deleted' : 'Cancelled'}
        message={isSuccess ? 'Your order deleted successfully.' : 'Order Deletion Cancelled'}
      />
    </>
  )
}

export default DeleteOrderConfirmationDialog
