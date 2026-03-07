'use client'

import { useMemo, useCallback } from 'react'

import { useParams } from 'next/navigation'

import en from '@/data/dictionaries/en.json'
import th from '@/data/dictionaries/th.json'

const dictionaries = { en, th } as const

type SupportedLocale = keyof typeof dictionaries

const getByPath = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], obj)

export const useDictionary = () => {
  const params = useParams()
  const langParam = Array.isArray(params?.lang) ? params?.lang[0] : params?.lang
  const normalizedLang = typeof langParam === 'string' ? langParam.toLowerCase() : ''
  const locale = (normalizedLang.startsWith('th') ? 'th' : 'en') as SupportedLocale

  const dict = useMemo(() => dictionaries[locale], [locale])
  const fallbackDict = dictionaries.en

  const t = useCallback((path: string, fallback?: string) => {
    const value = getByPath(dict, path) ?? getByPath(fallbackDict, path)

    return typeof value === 'string' ? value : fallback || path
  }, [dict, fallbackDict])

  return { locale, dictionary: dict, t }
}
