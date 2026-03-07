import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { getApiBaseUrl } from '@/libs/api-url'
import { getBackendToken } from '@/libs/backend-proxy'
import { apiT } from '@/libs/api-i18n'

const API_URL = getApiBaseUrl()
const SHEETS_DELETE_WEBHOOK_URL = process.env.SHEETS_DELETE_WEBHOOK_URL?.trim()
const SHEETS_DELETE_WEBHOOK_TOKEN = process.env.SHEETS_DELETE_WEBHOOK_TOKEN?.trim()
const REQUEUE_CONVERSION_WEBHOOK_URL = process.env.REQUEUE_CONVERSION_WEBHOOK_URL?.trim()
const REQUEUE_CONVERSION_WEBHOOK_TOKEN = process.env.REQUEUE_CONVERSION_WEBHOOK_TOKEN?.trim()

const WEBHOOK_EVENT_SHEETS_DELETE = 'DMS_SHEETS_DELETE'
const WEBHOOK_EVENT_REQUEUE_CONVERSION = 'DMS_REQUEUE_CONVERSION'

// GET /api/documents/[id] - Get document by ID (Proxy to Backend)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: apiT('unauthorized', request) }, { status: 401 })
    }

    const backendToken = await getBackendToken()

    if (!backendToken) {
      return NextResponse.json({ error: apiT('backendTokenNotFound', request) }, { status: 401 })
    }

    const backendUrl = `${API_URL}/documents/${id}`
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${backendToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()

      console.error('Backend API error:', response.status, errorText)
      
return NextResponse.json(
        {
          error: apiT('backendApiError', request),
          status: response.status,
          details: errorText
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    
return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching document:', error)
    
return NextResponse.json(
      { error: apiT('internalServerError', request) },
      { status: 500 }
    )
  }
}

// PATCH /api/documents/[id] - Update document with optional file replacement (Proxy to Backend)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: apiT('unauthorized', request) }, { status: 401 })
    }

    // Get user info from Microsoft 365 session
    const userEmail = session.user.email
    const userName = session.user.name || session.user.email

    // Get form data from request (supports both JSON and FormData)
    const contentType = request.headers.get('content-type') || ''
    let body: FormData | string
    let hasFileReplacement = false

    if (contentType.includes('multipart/form-data')) {
      // FormData with file
      body = await request.formData()
      hasFileReplacement = body.get('file') !== null
    } else {
      // JSON data
      const jsonData = await request.json()

      body = JSON.stringify(jsonData)
    }

    const backendToken = await getBackendToken()

    if (!backendToken) {
      return NextResponse.json({ error: apiT('backendTokenNotFound', request) }, { status: 401 })
    }

    const backendUrl = `${API_URL}/documents/${id}`
    
    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${backendToken}`,

        // Pass user info from Microsoft 365 to backend
        'X-User-Email': userEmail,
        'X-User-Name': userName,

        // Don't set Content-Type for FormData - browser will set it with boundary
        ...(contentType.includes('application/json') && { 'Content-Type': 'application/json' })
      },
      body: body as any,
    })

    if (!response.ok) {
      const errorText = await response.text()

      console.error('Backend update error:', response.status, errorText)
      
return NextResponse.json(
        {
          error: apiT('backendUpdateError', request),
          status: response.status,
          details: errorText
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    let sheetsSync: Awaited<ReturnType<typeof syncDeletedDocumentToSheets>> | undefined
    let requeueConversion: Awaited<ReturnType<typeof triggerRequeueConversion>> | undefined

    if (hasFileReplacement) {
      sheetsSync = await syncDeletedDocumentToSheets(
        {
          documentId: id,
          documentCode: data?.document?.documentCode,
          title: data?.document?.title,
          fileName: data?.document?.fileName,
          minioPath: data?.document?.minioPath,
          deletedByEmail: userEmail,
          deletedByName: userName
        },
        backendToken
      )

      requeueConversion = await triggerRequeueConversion(
        {
          documentId: id
        },
        backendToken
      )
    }

    return NextResponse.json({
      ...data,
      sheetsSync,
      requeueConversion
    })
  } catch (error) {
    console.error('Error updating document:', error)
    
return NextResponse.json(
      { error: apiT('internalServerError', request) },
      { status: 500 }
    )
  }
}

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (!trimmed) return []

    try {
      const parsed = JSON.parse(trimmed)

      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item).trim()).filter(Boolean)
      }
    } catch {
      // fallback to comma-separated values
    }

    return trimmed
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

const toHeaderRecord = (value: unknown): Record<string, string> => {
  if (!value) return {}

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)

      if (parsed && typeof parsed === 'object') {
        return Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).map(([key, val]) => [key, String(val)])
        )
      }
    } catch {
      return {}
    }
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, String(val)])
    )
  }

  return {}
}

const resolveWebhookConfig = async ({
  backendToken,
  eventCode,
  fallbackUrl,
  fallbackToken
}: {
  backendToken: string
  eventCode: string
  fallbackUrl?: string
  fallbackToken?: string
}) => {
  try {
    const response = await fetch(`${API_URL}/webhooks`, {
      headers: {
        Authorization: `Bearer ${backendToken}`
      },
      cache: 'no-store'
    })

    if (response.ok) {
      const rawData = await response.json()
      const webhooks = (Array.isArray(rawData) ? rawData : rawData?.data || []) as Array<Record<string, unknown>>

      const matched = webhooks.find(webhook => {
        const enabled = webhook.enabled !== false && webhook.isActive !== false
        const events = toStringArray(webhook.events)

        return enabled && events.map(event => event.toUpperCase()).includes(eventCode.toUpperCase())
      })

      if (matched && typeof matched.webhookUrl === 'string' && matched.webhookUrl.trim()) {
        const headers = toHeaderRecord(matched.headers)

        return {
          url: matched.webhookUrl.trim(),
          token: headers['x-api-key'] || headers['X-API-KEY'] || undefined,
          source: 'admin'
        }
      }
    }
  } catch (error) {
    console.error(`[WebhookResolver] Failed to load admin webhook for ${eventCode}:`, error)
  }

  return {
    url: fallbackUrl,
    token: fallbackToken,
    source: 'env'
  }
}

const triggerRequeueConversion = async (
  payload: {
    documentId: string
  },
  backendToken: string
) => {
  const webhook = await resolveWebhookConfig({
    backendToken,
    eventCode: WEBHOOK_EVENT_REQUEUE_CONVERSION,
    fallbackUrl: REQUEUE_CONVERSION_WEBHOOK_URL,
    fallbackToken: REQUEUE_CONVERSION_WEBHOOK_TOKEN
  })

  if (!webhook.url) {
    return {
      attempted: false,
      success: false,
      reason: `${WEBHOOK_EVENT_REQUEUE_CONVERSION} webhook is not configured (admin/env)`
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (webhook.token) {
    headers['x-api-key'] = webhook.token
  }

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store'
    })

    const responseBody = await response.text()

    if (!response.ok) {
      return {
        attempted: true,
        success: false,
        status: response.status,
        error: `Requeue webhook responded with ${response.status}`,
        detail: responseBody
      }
    }

    return {
      attempted: true,
      success: true,
      status: response.status,
      detail: responseBody
    }
  } catch (error) {
    return {
      attempted: true,
      success: false,
      error: 'Requeue webhook request failed',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

const syncDeletedDocumentToSheets = async (
  payload: {
    documentId: string
    documentCode?: string
    title?: string
    fileName?: string
    minioPath?: string
    deletedByEmail?: string
    deletedByName?: string
  },
  backendToken: string
) => {
  const webhook = await resolveWebhookConfig({
    backendToken,
    eventCode: WEBHOOK_EVENT_SHEETS_DELETE,
    fallbackUrl: SHEETS_DELETE_WEBHOOK_URL,
    fallbackToken: SHEETS_DELETE_WEBHOOK_TOKEN
  })

  if (!webhook.url) {
    return {
      attempted: false,
      success: false,
      reason: `${WEBHOOK_EVENT_SHEETS_DELETE} webhook is not configured (admin/env)`
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (webhook.token) {
    headers['x-api-key'] = webhook.token
  }

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store'
    })

    const responseBody = await response.text()

    if (!response.ok) {
      return {
        attempted: true,
        success: false,
        status: response.status,
        error: `Sheets webhook responded with ${response.status}`,
        detail: responseBody
      }
    }

    return {
      attempted: true,
      success: true,
      status: response.status,
      detail: responseBody
    }
  } catch (error) {
    return {
      attempted: true,
      success: false,
      error: 'Sheets webhook request failed',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// DELETE /api/documents/[id] - Delete document (Proxy to Backend)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: apiT('unauthorized', request) }, { status: 401 })
    }

    // Get user info from Microsoft 365 session
    const userEmail = session.user.email
    const userName = session.user.name || session.user.email

    const backendToken = await getBackendToken()

    if (!backendToken) {
      return NextResponse.json({ error: apiT('backendTokenNotFound', request) }, { status: 401 })
    }

    const backendUrl = `${API_URL}/documents/${id}`
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${backendToken}`,

        // Pass user info from Microsoft 365 to backend
        'X-User-Email': userEmail,
        'X-User-Name': userName,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()

      console.error('Backend delete error:', response.status, errorText)

      return NextResponse.json(
        {
          error: apiT('backendDeleteError', request),
          status: response.status,
          details: errorText
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    const sheetsSync = await syncDeletedDocumentToSheets(
      {
        documentId: id,
        documentCode: data?.document?.documentCode,
        title: data?.document?.title,
        fileName: data?.document?.fileName,
        minioPath: data?.document?.minioPath,
        deletedByEmail: userEmail,
        deletedByName: userName
      },
      backendToken
    )

    return NextResponse.json({
      ...data,
      sheetsSync
    })
  } catch (error) {
    console.error('Error deleting document:', error)
    
return NextResponse.json(
      { error: apiT('internalServerError', request) },
      { status: 500 }
    )
  }
}
