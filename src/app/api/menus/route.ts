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

    return proxyBackendRequest({ request, path: '/menus', method: 'GET', token: backendToken })
  } catch (error) {
    return internalErrorResponse('Error proxying menus GET:', error, request)
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: '/menus', method: 'POST', token: backendToken, includeQuery: false })
  } catch (error) {
    return internalErrorResponse('Error proxying menus POST:', error, request)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: '/menus/reorder', method: 'PATCH', token: backendToken, includeQuery: false })
  } catch (error) {
    return internalErrorResponse('Error proxying menus PATCH reorder:', error, request)
  }
}
