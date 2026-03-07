'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Config Imports
import { i18n } from '@configs/i18n'

const LangRedirect = () => {
  const pathname = usePathname()

  // Check if pathname already starts with a locale
  const pathnameWithoutLeadingSlash = pathname.startsWith('/') ? pathname.slice(1) : pathname
  const firstSegment = pathnameWithoutLeadingSlash.split('/')[0]

  // If pathname already has a valid locale, don't add another one
  if ((i18n.locales as readonly string[]).includes(firstSegment)) {
    redirect(pathname)
  }

  redirect(`/${i18n.defaultLocale}${pathname}`)
}

export default LangRedirect
