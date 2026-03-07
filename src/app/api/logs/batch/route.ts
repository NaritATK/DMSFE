import type { NextRequest } from 'next/server'
import { NextResponse, after } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { getApiBaseUrl } from '@/libs/api-url'
import { getBackendToken, internalErrorResponse, unauthorizedResponse } from '@/libs/backend-proxy'

interface LogEntry {
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown>
  timestamp: string
}

const API_URL = getApiBaseUrl()

// POST /api/logs/batch - Batch create activity logs
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) return unauthorizedResponse(request)

    const body = await request.json()
    const logs: LogEntry[] = Array.isArray(body) ? body : [body]

    if (logs.length === 0) {
      return NextResponse.json({ success: true, count: 0 })
    }

    const userId = session.user.id
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const backendToken = await getBackendToken()

    if (!backendToken) return unauthorizedResponse(request)

    after(async () => {
      try {
        const results = await Promise.allSettled(
          logs.map(log =>
            fetch(`${API_URL}/activity-logs`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${backendToken}`,
              },
              body: JSON.stringify({
                userId,
                action: log.action,
                resource: log.resource,
                resourceId: log.resourceId,
                details: log.details,
                ipAddress,
                userAgent,
                timestamp: log.timestamp,
              }),
              keepalive: true,
            })
          )
        )

        const failed = results.filter(result => result.status === 'rejected').length

        if (failed > 0) {
          console.error('Failed to forward some activity logs to DMFAPI', {
            total: logs.length,
            failed,
          })
        }
      } catch (error) {
        console.error('Failed to forward activity logs to DMFAPI:', error)
      }
    })

    return NextResponse.json({
      success: true,
      count: logs.length,
      batched: true,
      forwardedTo: 'DMFAPI',
    })
  } catch (error) {
    return internalErrorResponse('Error processing batch logs:', error, request)
  }
}
