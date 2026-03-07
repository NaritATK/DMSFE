'use client'

import { useEffect } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import type { Locale } from '@configs/i18n'

import themeConfig from '@configs/themeConfig'

import { getLocalizedUrl } from '@/utils/i18n'

const AuthRedirect = ({ lang }: { lang: Locale }) => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const login = `/${lang}/login`
    const homePage = getLocalizedUrl(themeConfig.homePageUrl, lang)

    // Avoid redirect loops when we are already on login or home.
    if (pathname === login || pathname === homePage) {
      router.replace(login)

      return
    }

    router.replace(`/${lang}/login?redirectTo=${encodeURIComponent(pathname)}`)
  }, [lang, pathname, router])

  return null
}

export default AuthRedirect
