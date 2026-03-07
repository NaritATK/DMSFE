'use client'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

type Props = {
  ltrIconClass: string
  rtlIconClass: string
  className?: string
}

const DirectionalIcon = ({ ltrIconClass, rtlIconClass, className }: Props) => {
  const theme = useTheme()

  return (
    <i
      className={classnames(
        {
          [ltrIconClass]: theme.direction === 'ltr',
          [rtlIconClass]: theme.direction === 'rtl'
        },
        className
      )}
    />
  )
}

export default DirectionalIcon
