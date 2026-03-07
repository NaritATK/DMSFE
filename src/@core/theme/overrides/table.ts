// MUI Imports
import type { Theme } from '@mui/material/styles'

const table: Theme['components'] = {
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.typography.body1?.fontFamily || theme.typography.fontFamily
      }),
      head: ({ theme }) => ({
        fontFamily: theme.typography.body1?.fontFamily || theme.typography.fontFamily,
        fontWeight: 600
      })
    }
  }
}

export default table
