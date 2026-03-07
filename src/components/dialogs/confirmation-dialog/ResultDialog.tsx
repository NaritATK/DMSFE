'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

type ResultDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  isSuccess: boolean
  title: string
  message: string
}

const ResultDialog = ({ open, setOpen, isSuccess, title, message }: ResultDialogProps) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} closeAfterTransition={false}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <i
          className={classnames('text-[88px] mbe-6', {
            'tabler-circle-check': isSuccess,
            'text-success': isSuccess,
            'tabler-circle-x': !isSuccess,
            'text-error': !isSuccess
          })}
        />
        <Typography variant='h4' className='mbe-2'>{title}</Typography>
        <Typography color='text.primary'>{message}</Typography>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' color='success' onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ResultDialog
