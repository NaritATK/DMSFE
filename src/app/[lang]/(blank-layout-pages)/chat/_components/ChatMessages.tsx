import type { RefObject } from 'react'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { ChatMessage } from '@/types/chat/public-chat'

type Props = {
  messages: ChatMessage[]
  errorText: string
  endRef: RefObject<HTMLDivElement | null>
}

const messageTextSx = {
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-word' as const,
  fontSize: { xs: '1.05rem', md: '1.12rem' },
  lineHeight: 1.9,
  fontWeight: 400,
  letterSpacing: 0.1,
}

export default function ChatMessages({ messages, errorText, endRef }: Props) {
  const { t } = useDictionary()

  const hasMessages = messages.length > 0

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          minHeight: 380,
          maxHeight: 560,
          overflowY: 'auto',
          background: theme =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, #fafcff 0%, #f6f9ff 100%)'
              : theme.palette.background.default,
        }}
      >
        {!hasMessages ? (
          <Box className='flex flex-col items-center justify-center h-full text-center gap-2'>
            <Icon icon='tabler-message-chatbot' fontSize={44} />
            <Typography variant='h6'>{t('dms.chat.messages.readyTitle')}</Typography>
            <Typography variant='body1' color='text.secondary' sx={{ fontSize: '1rem' }}>
              {t('dms.chat.messages.readySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {messages.map(message => {
              const isUser = message.role === 'user'

              return (
                <Box key={message.id} sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  <Stack direction='row' spacing={1.5} sx={{ maxWidth: { xs: '94%', md: '82%' } }}>
                    {!isUser && <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem' }}>AI</Avatar>}
                    <Box
                      sx={{
                        p: 2.2,
                        borderRadius: 3,
                        bgcolor: theme =>
                          isUser
                            ? theme.palette.mode === 'light'
                              ? '#1d4ed8'
                              : theme.palette.primary.dark
                            : theme.palette.background.paper,
                        color: theme => (isUser ? '#ffffff' : theme.palette.text.primary),
                        border: theme => (isUser ? 'none' : `1px solid ${theme.palette.divider}`),
                        boxShadow: theme =>
                          isUser
                            ? '0 6px 20px rgba(37,99,235,0.28)'
                            : theme.palette.mode === 'light'
                              ? '0 4px 18px rgba(15,23,42,0.07)'
                              : '0 4px 18px rgba(0,0,0,0.35)',
                      }}
                    >
                      <Typography variant='body1' sx={messageTextSx}>
                        {message.text}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )
            })}
            <div ref={endRef} />
          </Stack>
        )}
      </Box>

      {errorText && <Alert severity='error'>{errorText}</Alert>}
    </Stack>
  )
}
