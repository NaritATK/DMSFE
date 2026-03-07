import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'

type Props = {
  usernameInput: string
  username: string
  canChat: boolean
  onChangeUsernameInput: (value: string) => void
  onSaveUsername: () => void
}

const inputTextSx = {
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    lineHeight: 1.7,
  },
}

export default function UsernameCard({ usernameInput, username, canChat, onChangeUsernameInput, onSaveUsername }: Props) {
  const { t } = useDictionary()
  const activeAsText = t('dms.chat.username.activeAs').replace('{username}', username)

  return (
    <Card>
      <CardHeader
        title={t('dms.chat.username.title')}
        subheader={t('dms.chat.username.subtitle')}
        titleTypographyProps={{ fontSize: '1.125rem', fontWeight: 600 }}
        subheaderTypographyProps={{ fontSize: '0.95rem' }}
      />
      <CardContent>
        <Stack direction='row' spacing={2} alignItems='center'>
          <TextField
            fullWidth
            label={t('dms.chat.username.label')}
            value={usernameInput}
            onChange={event => onChangeUsernameInput(event.target.value)}
            placeholder={t('dms.chat.username.placeholder')}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                onSaveUsername()
              }
            }}
            sx={inputTextSx}
          />
          <Button variant='contained' onClick={onSaveUsername} disabled={!usernameInput.trim()}>
            {t('dms.chat.username.confirm')}
          </Button>
        </Stack>

        {canChat && (
          <Box sx={{ mt: 3 }}>
            <Chip icon={<Icon icon='tabler-user-circle' />} label={activeAsText} color='success' variant='tonal' />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
