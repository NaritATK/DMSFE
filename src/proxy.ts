import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getToken } from 'next-auth/jwt'

const protectedSegments = ['dashboard', 'upload', 'edit', 'history', 'admin']

const getLocalePrefix = (pathname: string) => {
  const firstSegment = pathname.split('/')[1] || ''

  if (/^[a-z]{2}(?:-[A-Z]{2})?$/.test(firstSegment)) {
    return `/${firstSegment}`
  }

  return ''
}

const isProtectedPath = (pathname: string) => {
  return protectedSegments.some(segment => {
    if (pathname === `/${segment}` || pathname.startsWith(`/${segment}/`)) {
      return true
    }

    return /^\/[a-z]{2}(?:-[A-Z]{2})?\//.test(pathname)
      ? pathname === `/${pathname.split('/')[1]}/${segment}` || pathname.startsWith(`/${pathname.split('/')[1]}/${segment}/`)
      : false
  })
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const localePrefix = getLocalePrefix(pathname)
  const hasBackendToken = Boolean((token as any)?.backendToken)
  const backendSessionInvalid = Boolean((token as any)?.backendTokenInvalid)
  const hasUsableSession = Boolean(token) && hasBackendToken && !backendSessionInvalid

  if (!hasUsableSession && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone()

    loginUrl.pathname = `${localePrefix}/login`
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }

  // NOTE: Never force-redirect from login here.
  // Let page-level auth guards decide to avoid redirect loops.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
}
