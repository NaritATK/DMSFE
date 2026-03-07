import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  getBackendToken,
  internalErrorResponse,
  proxyBackendRequest,
  unauthorizedResponse,
} from '@/libs/backend-proxy'
import { apiT } from '@/libs/api-i18n'

// GET /api/users - Proxy to DMFAPI user-role users list
export async function GET(request: NextRequest) {
  try {
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: '/user-roles/users', method: 'GET', token: backendToken })
  } catch (error) {
    return internalErrorResponse('Error proxying users GET:', error, request)
  }
}

// POST /api/users - deprecated in this architecture
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: apiT('notImplemented', request),
      details: apiT('userCreationViaRoleAccess', request),
    },
    { status: 501 }
  )
}
