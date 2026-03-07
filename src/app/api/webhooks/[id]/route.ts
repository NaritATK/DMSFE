import type { NextRequest } from 'next/server'

import {
  getBackendToken,
  internalErrorResponse,
  proxyBackendRequest,
  unauthorizedResponse,
} from '@/libs/backend-proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: `/webhooks/${id}`, method: 'GET', token: backendToken })
  } catch (error) {
    return internalErrorResponse('Error proxying webhooks GET:', error, request)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: `/webhooks/${id}`, method: 'PATCH', token: backendToken, includeQuery: false })
  } catch (error) {
    return internalErrorResponse('Error proxying webhooks PATCH:', error, request)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: `/webhooks/${id}`, method: 'DELETE', token: backendToken, includeQuery: false })
  } catch (error) {
    return internalErrorResponse('Error proxying webhooks DELETE:', error, request)
  }
}
