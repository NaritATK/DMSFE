// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { ensurePrefix } from '@/utils/string'

// Check if the url is missing the locale
export const isUrlMissingLocale = (url: string) => {
  return i18n.locales.every(locale => !(url.startsWith(`/${locale}/`) || url === `/${locale}`))
}

// Get the localized url
export const getLocalizedUrl = (url: string, languageCode: string): string => {
  if (!url || !languageCode) throw new Error("URL or Language Code can't be empty")

  // Hide default locale (th) from URL for cleaner paths, e.g. /chat instead of /th/chat
  if (languageCode === i18n.defaultLocale) {
    const defaultLocalePrefix = new RegExp(`^/${i18n.defaultLocale}(?=/|$)`)

    return isUrlMissingLocale(url) ? ensurePrefix(url, '/') : url.replace(defaultLocalePrefix, '') || '/'
  }

  return isUrlMissingLocale(url) ? `/${languageCode}${ensurePrefix(url, '/')}` : url
}
