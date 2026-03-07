import { useEffect, useMemo, useRef, useState } from 'react'

import { useDictionary } from '@/hooks/useDictionary'
import { publicChatService } from '@/services/public-chat.service'
import type { ChatMessage } from '@/types/chat/public-chat'

const USERNAME_KEY = 'dms-chatbot-username'
const MESSAGES_KEY = 'dms-chatbot-messages'

const createMessage = (role: ChatMessage['role'], text: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  text,
  at: new Date().toISOString(),
})

const readCachedMessages = (): ChatMessage[] => {
  const cached = localStorage.getItem(MESSAGES_KEY)

  if (!cached) {
    return []
  }

  try {
    const parsed = JSON.parse(cached) as ChatMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const usePublicChat = () => {
  const { t } = useDictionary()
  const [usernameInput, setUsernameInput] = useState('')
  const [username, setUsername] = useState('')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [errorText, setErrorText] = useState('')

  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const savedUsername = localStorage.getItem(USERNAME_KEY) || ''

    setUsername(savedUsername)
    setUsernameInput(savedUsername)
    setMessages(readCachedMessages())
  }, [])

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const canChat = useMemo(() => username.trim().length > 0, [username])

  const handleSaveUsername = () => {
    const nextUsername = usernameInput.trim()

    if (!nextUsername) {
      return
    }

    setUsername(nextUsername)
    localStorage.setItem(USERNAME_KEY, nextUsername)
  }

  const sendQuestion = async () => {
    const cleanQuestion = question.trim()

    if (!cleanQuestion || !canChat || isSending) {
      return
    }

    setIsSending(true)
    setErrorText('')

    const nextUserMessage = createMessage('user', cleanQuestion)
    const nextMessages = [...messages, nextUserMessage]

    setMessages(nextMessages)
    setQuestion('')

    try {
      const data = await publicChatService.ask({
        username,
        question: cleanQuestion,
        messages: nextMessages.map(({ role, text }) => ({ role, text })),
      })

      const answer = data?.answer || data?.message || data?.text || t('dms.chat.errors.emptyResponse')

      setMessages(prevMessages => [...prevMessages, createMessage('assistant', String(answer))])
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : t('dms.chat.errors.unknown'))
    } finally {
      setIsSending(false)
    }
  }

  return {
    state: {
      usernameInput,
      username,
      question,
      messages,
      isSending,
      errorText,
      canChat,
      endRef,
    },
    actions: {
      setUsernameInput,
      setQuestion,
      setErrorText,
      handleSaveUsername,
      sendQuestion,
    },
  }
}
