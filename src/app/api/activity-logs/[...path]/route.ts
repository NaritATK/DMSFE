import type { NextRequest } from 'next/server'

import {
  getBackendToken,
  internalErrorResponse,
  proxyBackendRequest,
  unauthorizedResponse,
} from '@/libs/backend-proxy'

const proxy = async (
  request: NextRequest,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string[]
) => {
  const backendToken = await getBackendToken()
  if (!backendToken) return unauthorizedResponse(request)

  const suffix = path.length ? `/${path.join('/')}` : ''

  return proxyBackendRequest({
    request,
    path: `/activity-logs${suffix}`,
    method,
    token: backendToken,
  })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'GET', path)
  } catch (error) {
    return internalErrorResponse('Error proxying activity-logs GET [...path]:', error, request)
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'POST', path)
  } catch (error) {
    return internalErrorResponse('Error proxying activity-logs POST [...path]:', error, request)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'PATCH', path)
  } catch (error) {
    return internalErrorResponse('Error proxying activity-logs PATCH [...path]:', error, request)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'PUT', path)
  } catch (error) {
    return internalErrorResponse('Error proxying activity-logs PUT [...path]:', error, request)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'DELETE', path)
  } catch (error) {
    return internalErrorResponse('Error proxying activity-logs DELETE [...path]:', error, request)
  }
}
