import type { NextRequest } from 'next/server'

import { proxyChatRequest } from '@/libs/chat-proxy'

export async function POST(request: NextRequest) {
  return proxyChatRequest(request)
}
