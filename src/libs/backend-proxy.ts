import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { getApiBaseUrl } from '@/libs/api-url'
import { apiT } from '@/libs/api-i18n'

const API_URL = getApiBaseUrl()

export type ProxyMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const getBackendToken = async (): Promise<string | null> => {
  try {
    const session = await getServerSession(authOptions)
    const backendToken = (session as { backendToken?: unknown } | null)?.backendToken

    if (!session?.user || typeof backendToken !== 'string' || !backendToken) {
      console.log('[backend-proxy] No valid backend token in session')
      return null
    }

    return backendToken
  } catch (error) {
    console.error('[backend-proxy] Error getting backend token:', error)
    return null
  }
}

export const unauthorizedResponse = (request?: NextRequest) =>
  NextResponse.json({ error: apiT('unauthorized', request) }, { status: 401 })

export const internalErrorResponse = (label: string, error: unknown, request?: NextRequest) => {
  console.error(label, error)

  return NextResponse.json({ error: apiT('internalServerError', request) }, { status: 500 })
}

const toResponseBody = async (response: Response): Promise<BodyInit | null> => {
  if (response.status === 204 || response.status === 205) return null

  const rawText = await response.text()

  if (!rawText) return null

  const contentType = response.headers.get('content-type')?.toLowerCase() || ''

  if (contentType.includes('application/json')) return rawText

  try {
    return JSON.stringify(JSON.parse(rawText))
  } catch {
    return rawText
  }
}

const parseProxyResponse = async (response: Response) => {
  const body = await toResponseBody(response)
  const headers = new Headers()
  const contentType = response.headers.get('content-type')

  if (contentType) headers.set('content-type', contentType)

  return new NextResponse(body, {
    status: response.status,
    headers,
  })
}

export const proxyBackendRequest = async ({
  request,
  path,
  method,
  token,
  includeQuery = true,
  queryString,
}: {
  request: NextRequest
  path: string
  method: ProxyMethod
  token: string
  includeQuery?: boolean
  queryString?: string
}) => {
  const query = queryString ?? (includeQuery ? request.nextUrl.searchParams.toString() : '')
  const url = `${API_URL}${path}${query ? `?${query}` : ''}`

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }

  let body: string | undefined

  if (!['GET', 'DELETE'].includes(method)) {
    body = await request.text()
    headers['Content-Type'] = request.headers.get('content-type') || 'application/json'
  }

  const response = await fetch(url, { method, headers, body, cache: 'no-store' })

  return parseProxyResponse(response)
}
