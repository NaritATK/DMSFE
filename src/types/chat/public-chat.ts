export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  at: string
}

export type ChatRequestPayload = {
  username: string
  question: string
  messages: Array<Pick<ChatMessage, 'role' | 'text'>>
}

export type ChatResponsePayload = {
  answer?: string
  message?: string
  text?: string
  error?: string
  detail?: string
}
