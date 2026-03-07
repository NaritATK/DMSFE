import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { getApiBaseUrl } from '@/libs/api-url'
import { getBackendToken, internalErrorResponse, unauthorizedResponse } from '@/libs/backend-proxy'
import { apiT } from '@/libs/api-i18n'

const API_URL = getApiBaseUrl()

// GET /api/documents/:id/presign - Get presigned URL for preview/download
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return unauthorizedResponse(request)
    }

    const backendToken = await getBackendToken()

    if (!backendToken) {
      return NextResponse.json({ error: apiT('backendTokenNotFound', request) }, { status: 401 })
    }

    const { id } = await params

    const response = await fetch(`${API_URL}/documents/${id}/presign`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${backendToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()

      return NextResponse.json({ error: apiT('backendApiError', request), details: errorText }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return internalErrorResponse('Error generating presigned URL:', error, request)
  }
}
