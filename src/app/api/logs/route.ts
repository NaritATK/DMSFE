import type { NextRequest } from 'next/server'

import {
  getBackendToken,
  internalErrorResponse,
  proxyBackendRequest,
  unauthorizedResponse,
} from '@/libs/backend-proxy'

const mapLogQueryParams = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const params = new URLSearchParams()

  const map: Record<string, string> = {
    page: 'page',
    limit: 'limit',
    userId: 'userId',
    action: 'action',
    resource: 'resource',
    dateFrom: 'startDate',
    dateTo: 'endDate',
    startDate: 'startDate',
    endDate: 'endDate',
  }

  for (const [from, to] of Object.entries(map)) {
    const val = searchParams.get(from)
    if (val) params.set(to, val)
  }

  return params.toString()
}

// GET /api/logs - Proxy to DMFAPI /activity-logs
export async function GET(request: NextRequest) {
  try {
    const backendToken = await getBackendToken()
    if (!backendToken) return unauthorizedResponse(request)

    return proxyBackendRequest({
      request,
      path: '/activity-logs',
      method: 'GET',
      token: backendToken,
      includeQuery: false,
      queryString: mapLogQueryParams(request),
    })
  } catch (error) {
    return internalErrorResponse('Error proxying logs GET:', error, request)
  }
}
