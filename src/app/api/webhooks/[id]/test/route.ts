import type { NextRequest } from 'next/server'

import {
  getBackendToken,
  internalErrorResponse,
  proxyBackendRequest,
  unauthorizedResponse,
} from '@/libs/backend-proxy'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({ request, path: `/webhooks/${id}/test`, method: 'POST', token: backendToken, includeQuery: false })
  } catch (error) {
    return internalErrorResponse('Error proxying webhook test:', error, request)
  }
}
