import type { ChatRequestPayload, ChatResponsePayload } from '@/types/chat/public-chat'
import { clientT } from '@/utils/client-i18n'

const CHAT_API_PATH = '/api/chatbot/ask'

const parseJsonSafely = async (response: Response): Promise<ChatResponsePayload> => {
  try {
    return (await response.json()) as ChatResponsePayload
  } catch {
    return {}
  }
}

const getChatErrorMessage = (payload: ChatResponsePayload) =>
  payload?.detail || payload?.error || clientT('dms.api.chatbotUnavailable', 'Unable to connect to chatbot service')

export const publicChatService = {
  async ask(payload: ChatRequestPayload) {
    const response = await fetch(CHAT_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const data = await parseJsonSafely(response)

    if (!response.ok) {
      throw new Error(getChatErrorMessage(data))
    }

    return data
  },
}
