import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getApiBaseUrl } from '@/libs/api-url'
import { apiT } from '@/libs/api-i18n'
import type { ChatResponsePayload } from '@/types/chat/public-chat'

const API_URL = getApiBaseUrl()
const CHATBOT_PATH = process.env.CHATBOT_BACKEND_PATH || '/chatbot/ask'

const parseJsonSafely = async (response: Response): Promise<ChatResponsePayload | null> => {
  try {
    return (await response.json()) as ChatResponsePayload
  } catch {
    return null
  }
}

const buildErrorPayload = (data: ChatResponsePayload | null, request: NextRequest) => ({
  error: data?.error || apiT('chatbotBackendError', request),
  detail: data?.message || data?.detail || null,
})

export const proxyChatRequest = async (request: NextRequest) => {
  try {
    const body = await request.json()

    const response = await fetch(`${API_URL}${CHATBOT_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const data = await parseJsonSafely(response)

    if (!response.ok) {
      return NextResponse.json(buildErrorPayload(data, request), { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying chatbot POST:', error)

    return NextResponse.json({ error: apiT('chatbotUnavailable', request) }, { status: 500 })
  }
}
