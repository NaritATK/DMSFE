// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Config Imports
import { authOptions } from '@/libs/auth'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const session = await getServerSession(authOptions)
  const backendSessionInvalid = Boolean((session as any)?.backendSessionInvalid)

  const hasUsableSession =
    Boolean(session) &&
    Boolean((session as any)?.backendToken) &&
    Boolean((session as any)?.user?.sysUserId) &&
    Boolean((session as any)?.user?.role) &&
    !backendSessionInvalid

  if (!hasUsableSession) {
    return <AuthRedirect lang={locale} />
  }

  return <>{children}</>
}
