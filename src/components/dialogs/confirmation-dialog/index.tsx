import DeleteCustomerConfirmationDialog from './DeleteCustomerConfirmationDialog'
import DeleteOrderConfirmationDialog from './DeleteOrderConfirmationDialog'
import SuspendAccountConfirmationDialog from './SuspendAccountConfirmationDialog'
import UnsubscribeConfirmationDialog from './UnsubscribeConfirmationDialog'

type ConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  type?: string
}

const ConfirmationDialog = ({ type = 'suspend-account', ...props }: ConfirmationDialogProps) => {
  if (type === 'delete-customer') return <DeleteCustomerConfirmationDialog {...props} />
  if (type === 'delete-order') return <DeleteOrderConfirmationDialog {...props} />
  if (type === 'unsubscribe') return <UnsubscribeConfirmationDialog {...props} />

  return <SuspendAccountConfirmationDialog {...props} />
}

export default ConfirmationDialog

export { default as BaseConfirmationDialog } from './BaseConfirmationDialog'
export { default as DeleteAccountConfirmationDialog } from './DeleteAccountConfirmationDialog'
export { default as DeleteCustomerConfirmationDialog } from './DeleteCustomerConfirmationDialog'
export { default as DeleteOrderConfirmationDialog } from './DeleteOrderConfirmationDialog'
export { default as ResultDialog } from './ResultDialog'
export { default as SuspendAccountConfirmationDialog } from './SuspendAccountConfirmationDialog'
export { default as UnsubscribeConfirmationDialog } from './UnsubscribeConfirmationDialog'
