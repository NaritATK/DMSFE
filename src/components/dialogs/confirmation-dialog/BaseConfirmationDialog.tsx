'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'

type BaseConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  children: ReactNode
  actions: ReactNode
}

const BaseConfirmationDialog = ({ open, setOpen, title, children, actions }: BaseConfirmationDialogProps) => {
  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={() => setOpen(false)} closeAfterTransition={false}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
        <Typography variant='h4'>{title}</Typography>
        {children}
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        {actions}
      </DialogActions>
    </Dialog>
  )
}

export default BaseConfirmationDialog
