import type { NextRequest } from 'next/server'

import en from '@/data/dictionaries/en.json'
import th from '@/data/dictionaries/th.json'

type Locale = 'en' | 'th'

type ApiKey =
  | 'unauthorized'
  | 'internalServerError'
  | 'backendTokenNotFound'
  | 'backendApiError'
  | 'backendUploadError'
  | 'backendUpdateError'
  | 'backendDeleteError'
  | 'deprecatedEndpoint'
  | 'templateRouteDisabled'
  | 'useNextAuthLogin'
  | 'useDocumentsUpload'
  | 'notImplemented'
  | 'userCreationViaRoleAccess'
  | 'userUpdatesViaRoleAccess'
  | 'userDeletionViaRoleAccess'
  | 'chatbotBackendError'
  | 'chatbotUnavailable'
  | 'uploadTimedOut'
  | 'uploadFailed'

const dictionaries = { en, th } as const

const getByPath = (obj: unknown, path: string): string | undefined => {
  const value = path
    .split('.')
    .reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj)

  return typeof value === 'string' ? value : undefined
}

export const resolveApiLocale = (request?: NextRequest): Locale => {
  const requestPath = request?.nextUrl?.pathname || ''
  const pathLang = requestPath.split('/').filter(Boolean)[0]

  if (pathLang === 'th') return 'th'
  if (pathLang === 'en') return 'en'

  const referer = request?.headers.get('referer') || ''

  if (referer.includes('/th/')) return 'th'
  if (referer.includes('/en/')) return 'en'

  const acceptLanguage = request?.headers.get('accept-language') || ''

  if (acceptLanguage.toLowerCase().includes('th')) return 'th'

  return 'en'
}

export const apiT = (key: ApiKey, request?: NextRequest, fallback?: string): string => {
  const locale = resolveApiLocale(request)
  const localized = getByPath(dictionaries[locale], `dms.api.${key}`)
  const fallbackLocalized = getByPath(dictionaries.en, `dms.api.${key}`)

  return localized || fallbackLocalized || fallback || key
}
