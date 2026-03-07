import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { getApiBaseUrl } from '@/libs/api-url'
import { getBackendToken, internalErrorResponse, unauthorizedResponse } from '@/libs/backend-proxy'
import { apiT } from '@/libs/api-i18n'

const API_URL = getApiBaseUrl()

// GET /api/documents - List documents with filters (Proxy to Backend)
export async function GET(request: NextRequest) {
  try {
    console.log('[API /documents] Fetching documents...')
    
    const session = await getServerSession(authOptions)
    console.log('[API /documents] Session:', session ? 'exists' : 'null')

    if (!session?.user) {
      console.log('[API /documents] No session, returning 401')
      return unauthorizedResponse(request)
    }

    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const backendUrl = `${API_URL}/documents${queryString ? `?${queryString}` : ''}`
    console.log('[API /documents] Backend URL:', backendUrl)

    const backendToken = await getBackendToken()
    console.log('[API /documents] Backend token:', backendToken ? 'exists' : 'null')

    if (!backendToken) {
      return NextResponse.json({ error: apiT('backendTokenNotFound', request) }, { status: 401 })
    }

    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${backendToken}`,
      },
    })
    
    console.log('[API /documents] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API /documents] Backend error:', response.status, errorText)

      // Return specific error codes for better UX
      let errorCode = 'BACKEND_ERROR'
      if (response.status === 401) errorCode = 'AUTH_REQUIRED'
      if (response.status === 403) errorCode = 'FORBIDDEN'
      if (response.status === 429) errorCode = 'RATE_LIMIT'
      if (response.status >= 500) errorCode = 'SERVER_ERROR'

      return NextResponse.json(
        {
          error: apiT('backendApiError', request),
          errorCode,
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[API /documents] Success, documents count:', data.documents?.length || 0)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[API /documents] Error:', error)
    return internalErrorResponse('Error fetching documents:', error, request)
  }
}

// POST /api/documents - Proxy to Backend (upload handled by DMSAPI)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return unauthorizedResponse(request)
    }

    const backendToken = await getBackendToken()

    if (!backendToken) {
      return NextResponse.json({ error: apiT('backendTokenNotFound', request) }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${backendToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()

      try {
        const parsed = JSON.parse(errorText) as { message?: string }

        return NextResponse.json({ error: parsed.message || apiT('backendApiError', request) }, { status: response.status })
      } catch {
        return NextResponse.json({ error: apiT('backendApiError', request), details: errorText }, { status: response.status })
      }
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return internalErrorResponse('Error creating document:', error, request)
  }
}
