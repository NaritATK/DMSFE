import en from '@/data/dictionaries/en.json'
import th from '@/data/dictionaries/th.json'

type SupportedLocale = 'en' | 'th'

const dictionaries = { en, th } as const

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getByPath = (obj: unknown, path: string): unknown => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (!isObjectRecord(acc)) return undefined

    return acc[key]
  }, obj)
}

export const getClientLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') return 'en'

  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase()

  return firstSegment?.startsWith('th') ? 'th' : 'en'
}

export const clientT = (path: string, fallback: string): string => {
  const locale = getClientLocale()
  const value = getByPath(dictionaries[locale], path) ?? getByPath(dictionaries.en, path)

  return typeof value === 'string' ? value : fallback
}
