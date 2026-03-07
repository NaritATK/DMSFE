import type { NextRequest } from 'next/server'

import {
  getBackendToken,
  internalErrorResponse,
  proxyBackendRequest,
  unauthorizedResponse,
} from '@/libs/backend-proxy'

export async function GET(request: NextRequest) {
  try {
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: '/activity-logs', method: 'GET', token: backendToken })
  } catch (error) {
    return internalErrorResponse('Error proxying activity-logs GET:', error, request)
  }
}
