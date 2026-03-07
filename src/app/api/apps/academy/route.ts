import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { apiT } from '@/libs/api-i18n'

const deprecatedResponse = (request: NextRequest) =>
  NextResponse.json(
    {
      error: apiT('deprecatedEndpoint', request),
      details: apiT('templateRouteDisabled', request)
    },
    { status: 410 }
  )

export async function GET(request: NextRequest) {
  return deprecatedResponse(request)
}
