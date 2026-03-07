import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { apiT } from '@/libs/api-i18n'

const deprecatedResponse = (request: NextRequest) =>
  NextResponse.json(
    {
      error: apiT('deprecatedEndpoint', request),
      details: apiT('useNextAuthLogin', request)
    },
    { status: 410 }
  )

// Deprecated mock login endpoint (disabled for production safety)
export async function GET(request: NextRequest) {
  return deprecatedResponse(request)
}

// Deprecated mock login endpoint (disabled for production safety)
export async function POST(request: NextRequest) {
  return deprecatedResponse(request)
}
