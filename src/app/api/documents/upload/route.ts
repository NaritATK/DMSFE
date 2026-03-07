import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { getApiBaseUrl } from '@/libs/api-url'
import { getBackendToken } from '@/libs/backend-proxy'
import { apiT } from '@/libs/api-i18n'

const API_URL = getApiBaseUrl()
const REQUEUE_CONVERSION_WEBHOOK_URL = process.env.REQUEUE_CONVERSION_WEBHOOK_URL?.trim()
const REQUEUE_CONVERSION_WEBHOOK_TOKEN = process.env.REQUEUE_CONVERSION_WEBHOOK_TOKEN?.trim()
const WEBHOOK_EVENT_REQUEUE_CONVERSION = 'DMS_REQUEUE_CONVERSION'

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)

  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (!trimmed) return []

    try {
      const parsed = JSON.parse(trimmed)

      if (Array.isArray(parsed)) return parsed.map(item => String(item).trim()).filter(Boolean)
    } catch {
      // fallback
    }

    
return trimmed.split(',').map(item => item.trim()).filter(Boolean)
  }

  
return []
}

const toHeaderRecord = (value: unknown): Record<string, string> => {
  if (!value) return {}

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)

      if (parsed && typeof parsed === 'object') {
        return Object.fromEntries(Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [k, String(v)]))
      }
    } catch {
      return {}
    }
  }

  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, String(v)]))
  }

  
return {}
}

const resolveRequeueWebhookConfig = async (backendToken: string) => {
  try {
    const response = await fetch(`${API_URL}/webhooks`, {
      headers: { Authorization: `Bearer ${backendToken}` },
      cache: 'no-store'
    })

    if (response.ok) {
      const rawData = await response.json()
      const webhooks = (Array.isArray(rawData) ? rawData : rawData?.data || []) as Array<Record<string, unknown>>

      const matched = webhooks.find(webhook => {
        const enabled = webhook.enabled !== false && webhook.isActive !== false
        const events = toStringArray(webhook.events)

        
return enabled && events.map(event => event.toUpperCase()).includes(WEBHOOK_EVENT_REQUEUE_CONVERSION)
      })

      if (matched && typeof matched.webhookUrl === 'string' && matched.webhookUrl.trim()) {
        const headers = toHeaderRecord(matched.headers)

        
return {
          url: matched.webhookUrl.trim(),
          token: headers['x-api-key'] || headers['X-API-KEY'] || undefined
        }
      }
    }
  } catch (error) {
    console.error('[upload-proxy] resolve requeue webhook failed:', error)
  }

  return {
    url: REQUEUE_CONVERSION_WEBHOOK_URL,
    token: REQUEUE_CONVERSION_WEBHOOK_TOKEN
  }
}

const triggerRequeueConversion = async (documentId: string, backendToken: string) => {
  const webhook = await resolveRequeueWebhookConfig(backendToken)

  if (!webhook.url) return

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (webhook.token) headers['x-api-key'] = webhook.token

  try {
    await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ documentId }),
      cache: 'no-store'
    })
  } catch (error) {
    console.error('[upload-proxy] trigger requeue failed:', error)
  }
}

// POST /api/documents/upload - Upload document with user info from Microsoft 365
export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: apiT('unauthorized', request) }, { status: 401 })
    }

    // Get user info from Microsoft 365 session
    const userEmail = session.user.email
    const userName = session.user.name || session.user.email

    // Get form data from request
    const formData = await request.formData()
    
    // Forward to backend API with user info in headers
    const backendUrl = `${API_URL}/documents/upload`
    
    // Create new FormData to forward to backend
    const backendFormData = new FormData()
    
    // Copy all fields from original form data
    formData.forEach((value, key) => {
      backendFormData.append(key, value)
    })
    
    console.log('[upload-proxy]', {
      requestId,
      message: 'Forwarding upload to backend',
      backendUrl,
      userEmail,
      userName
    })

    const backendToken = await getBackendToken()

    if (!backendToken) {
      return NextResponse.json({ error: apiT('backendTokenNotFound', request) }, { status: 401 })
    }

    const controller = new AbortController()
    const timeoutMs = Number(process.env.NEXT_PUBLIC_UPLOAD_PROXY_TIMEOUT_MS || '180000')
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(backendUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        // Pass JWT token for authentication
        'Authorization': `Bearer ${backendToken}`,

        // Pass user info from Microsoft 365 to backend
        'X-User-Email': userEmail,
        'X-User-Name': userName,

        // Correlation id for tracing FE -> BE logs
        'X-Request-Id': requestId,
      },
      body: backendFormData,
    }).finally(() => clearTimeout(timeout))

    if (!response.ok) {
      const errorText = await response.text()

      console.error('[upload-proxy]', {
        requestId,
        message: apiT('backendUploadError', request),
        status: response.status,
        errorText
      })
      
return NextResponse.json(
        {
          error: apiT('backendUploadError', request),
          code: 'BACKEND_UPLOAD_ERROR',
          status: response.status,
          details: errorText,
          requestId
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    const uploadedDocumentId = data?.document?.documentId || data?.documentId

    if (uploadedDocumentId) {
      await triggerRequeueConversion(String(uploadedDocumentId), backendToken)
    }

    return NextResponse.json({ ...data, requestId }, { status: 201 })
  } catch (error) {
    const isAbort = error instanceof Error && error.name === 'AbortError'

    if (isAbort) {
      return NextResponse.json(
        {
          error: apiT('uploadTimedOut', request),
          code: 'UPLOAD_PROXY_TIMEOUT',
          requestId
        },
        { status: 504 }
      )
    }

    console.error('[upload-proxy]', {
      requestId,
      message: 'Error uploading document',
      error: error instanceof Error ? error.message : String(error)
    })
    
return NextResponse.json(
      {
        error: apiT('internalServerError', request),
        code: 'UPLOAD_PROXY_ERROR',
        details: error instanceof Error ? error.message : String(error),
        requestId
      },
      { status: 500 }
    )
  }
}
