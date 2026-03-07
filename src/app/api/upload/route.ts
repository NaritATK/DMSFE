import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { apiT } from '@/libs/api-i18n'

// Deprecated template route.
// Use /api/documents/upload (proxy to DMFAPI) instead.
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: apiT('deprecatedEndpoint', request),
      details: apiT('useDocumentsUpload', request)
    },
    { status: 410 }
  )
}
