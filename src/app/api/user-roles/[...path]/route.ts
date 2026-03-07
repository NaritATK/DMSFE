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

  return proxyBackendRequest({
    request,
    path: `/user-roles/${path.join('/')}`,
    method,
    token: backendToken,
  })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'GET', path)
  } catch (error) {
    return internalErrorResponse('Error proxying user-roles GET [...path]:', error, request)
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'POST', path)
  } catch (error) {
    return internalErrorResponse('Error proxying user-roles POST [...path]:', error, request)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'PATCH', path)
  } catch (error) {
    return internalErrorResponse('Error proxying user-roles PATCH [...path]:', error, request)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'PUT', path)
  } catch (error) {
    return internalErrorResponse('Error proxying user-roles PUT [...path]:', error, request)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    return proxy(request, 'DELETE', path)
  } catch (error) {
    return internalErrorResponse('Error proxying user-roles DELETE [...path]:', error, request)
  }
}
