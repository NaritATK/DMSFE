export const i18n = {
  defaultLocale: 'th',
  locales: ['en', 'th'],
  langDirection: {
    en: 'ltr',
    th: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
