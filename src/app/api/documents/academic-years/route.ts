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

    return proxyBackendRequest({ request, path: '/documents/academic-years', method: 'GET', token: backendToken })
  } catch (error) {
    return internalErrorResponse('Error proxying documents/academic-years GET:', error, request)
  }
}
