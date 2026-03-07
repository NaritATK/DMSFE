import type { FormEvent, KeyboardEvent } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { useDictionary } from '@/hooks/useDictionary'

type Props = {
  canChat: boolean
  isSending: boolean
  question: string
  onChangeQuestion: (value: string) => void
  onSubmit: () => Promise<void> | void
}

const inputTextSx = {
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    lineHeight: 1.7,
  },
}

export default function ChatComposer({ canChat, isSending, question, onChangeQuestion, onSubmit }: Props) {
  const { t } = useDictionary()

  const isSubmitDisabled = !canChat || !question.trim() || isSending

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await onSubmit()
  }

  const handleQuestionEnter = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }

    event.preventDefault()

    if (!isSubmitDisabled) {
      onSubmit()
    }
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <Stack direction='row' spacing={2} alignItems='flex-end'>
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          label={t('dms.chat.composer.label')}
          value={question}
          onChange={event => onChangeQuestion(event.target.value)}
          onKeyDown={handleQuestionEnter}
          disabled={!canChat || isSending}
          sx={inputTextSx}
        />

        <Button type='submit' variant='contained' disabled={isSubmitDisabled}>
          {isSending ? <CircularProgress size={20} color='inherit' /> : t('dms.chat.composer.send')}
        </Button>
      </Stack>
    </Box>
  )
}
