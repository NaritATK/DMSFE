'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Theme } from '@mui/material/styles'

import { useDictionary } from '@/hooks/useDictionary'
import ChatComposer from './_components/ChatComposer'
import ChatMessages from './_components/ChatMessages'
import UsernameCard from './_components/UsernameCard'
import { usePublicChat } from './_hooks/usePublicChat'

const cardSx = {
  borderRadius: 4,
  border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'light'
      ? '0 8px 30px rgba(15,23,42,0.06)'
      : '0 8px 28px rgba(0,0,0,0.35)',
}

export default function PublicChatPage() {
  const { t } = useDictionary()
  const { state, actions } = usePublicChat()

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant='h4'>{t('dms.chat.page.title')}</Typography>
        <Typography variant='body1' color='text.secondary' sx={{ fontSize: { xs: '1rem', md: '1.0625rem' } }}>
          {t('dms.chat.page.subtitle')}
        </Typography>
      </Box>

      <Box sx={cardSx}>
        <UsernameCard
          usernameInput={state.usernameInput}
          username={state.username}
          canChat={state.canChat}
          onChangeUsernameInput={actions.setUsernameInput}
          onSaveUsername={actions.handleSaveUsername}
        />
      </Box>

      <Card sx={cardSx}>
        <CardHeader title={t('dms.chat.page.sectionTitle')} titleTypographyProps={{ fontSize: '1.125rem', fontWeight: 600 }} />
        <Divider />

        <CardContent>
          {!state.canChat && <Alert severity='warning'>{t('dms.chat.page.usernameRequired')}</Alert>}

          <Stack spacing={3} sx={{ mt: state.canChat ? 0 : 2 }}>
            <ChatMessages
              messages={state.messages}
              errorText={state.errorText}
              isSending={state.isSending}
              endRef={state.endRef}
            />

            <ChatComposer
              canChat={state.canChat}
              isSending={state.isSending}
              question={state.question}
              onChangeQuestion={actions.setQuestion}
              onSubmit={actions.sendQuestion}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
