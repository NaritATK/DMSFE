// Third-party Imports
import AzureADProvider from 'next-auth/providers/azure-ad'
import type { NextAuthOptions } from 'next-auth'
import { Buffer } from 'buffer'
import { getApiOrigin } from './api-url'

// API Backend URL
const API_ORIGIN = getApiOrigin()
const AUTH_BASE_URL = (process.env.NEXTAUTH_URL || 'http://localhost:6849').replace(/\/$/, '')
const IS_HTTPS = AUTH_BASE_URL.startsWith('https://')
const BACKEND_SESSION_VALIDATE_INTERVAL_MS = 60 * 1000

const validateBackendSession = async (backendToken: string) => {
  try {
    const response = await fetch(`${API_ORIGIN}/api/auth/validate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${backendToken}`
      },
      cache: 'no-store'
    })

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

// Function to fetch user photo from Microsoft Graph API
const fetchMicrosoftPhoto = async (accessToken: string, userEmail?: string): Promise<string | null> => {
  try {
    console.log(`[Auth] Fetching photo for user: ${userEmail || 'unknown'}`)
    
    const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      console.log(`[Auth] No photo found or error: ${response.status} ${response.statusText}`)
      // User may not have a photo
      return null
    }

    // Convert binary photo to base64
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    console.log(`[Auth] Photo fetched successfully: ${base64.length} chars, type: ${contentType}`)

    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error('[Auth] Failed to fetch Microsoft photo:', error)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  // ** Configure Microsoft 365 (Azure AD) authentication
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: {
        params: {
          scope: 'openid profile email User.Read'
        }
      },
      // Enable state check for security (production)
      checks: ['pkce', 'state'],
    })
  ],

  // ** Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  // ** Cookies configuration for HTTPS (production)
  cookies: IS_HTTPS ? {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    csrfToken: {
      name: `__Secure-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
  } : undefined,

  // ** Pages configuration
  pages: {
    signIn: '/login',
    error: '/login'
  },

  // ** Callbacks
  callbacks: {
    async signIn({ account, profile, user }) {
      // Only allow sign in from Microsoft 365
      if (account?.provider !== 'azure-ad') {
        return false
      }

      // Sync user to backend API
      try {
        if (account?.access_token) {
          const response = await fetch(`${API_ORIGIN}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              accessToken: account.access_token
            })
          })

          console.log('[Auth] Sync user to backend response:', response)

          // Read response body once
          const responseText = await response.text()
          let data: any = {}
          
          try {
            data = JSON.parse(responseText)
          } catch {
            // Not JSON (probably HTML error page)
            console.error('[Auth] Response is not JSON:', responseText.substring(0, 200))
          }

          if (!response.ok) {
            // Handle error that could be string or object
            console.error('[Auth] Response not OK:', response.status, data, responseText.substring(0, 100))
            
            let errorCode = 'default'
            
            // If response is HTML (starts with <), it's a server error
            if (responseText.trim().startsWith('<')) {
              errorCode = 'SERVER_ERROR'
            }
            // Priority 1: data.code (backend auth middleware format: { code: 'ERROR', error: 'msg' })
            else if (typeof data?.code === 'string') {
              errorCode = data.code
            }
            // Priority 2: data.error as string (backend controller format: { error: 'ERROR', message: 'msg' })
            else if (typeof data?.error === 'string') {
              errorCode = data.error
            }
            // Priority 3: data.error.code (nested format)
            else if (typeof data?.error?.code === 'string') {
              errorCode = data.error.code
            }
            
            console.error('[Auth] Error code:', errorCode)
            return `/login?error=${encodeURIComponent(errorCode)}`
          }

          if (!data?.token) {
            console.error('[Auth] Backend sync missing token')
            
return false
          }

          // Store backend JWT token and user info
          ;(account as any).backendToken = data.token
          ;(account as any).sysUserId = data.user?.sysUserId
          ;(account as any).role = data.user?.role || 'STAFF'
          
          // Store Microsoft access token for later use (e.g., fetching profile photo)
          if (account?.access_token) {
            ;(account as any).microsoftAccessToken = account.access_token
          }

          console.log('[Auth] User synced to backend:', data.user?.sysUserId, 'Role:', data.user?.role)
        }
      } catch (error) {
        console.error('[Auth] Error syncing user to backend:', error)
        
return false
      }

      return Boolean((account as any)?.backendToken)
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in - store user info in token
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }

      // Handle client-side session updates (e.g., role switch without re-login)
      if (trigger === 'update') {
        const nextRole = (session as any)?.role || (session as any)?.user?.role
        const nextSysUserId = (session as any)?.user?.sysUserId
        const nextBackendToken = (session as any)?.backendToken

        // Store viewRole (user's choice) separately from actualRole (from backend)
        if (nextRole) {
          token.viewRole = nextRole
          token.role = nextRole // Keep role in sync for backward compatibility
        }
        if (nextSysUserId) token.sysUserId = nextSysUserId
        if (nextBackendToken) token.backendToken = nextBackendToken
      }

      // Store backend token and role only (avoid duplicating large token payload)
      if (account) {
        const accountBackendToken = (account as any).backendToken

        if (accountBackendToken) token.backendToken = accountBackendToken

        token.sysUserId = (account as any).sysUserId
        const accountRole: 'STAFF' | 'ADMIN' = (account as any).role || 'STAFF'
        token.actualRole = accountRole // Actual role from backend
        token.role = accountRole // Default view role = actual role
        token.viewRole = accountRole
        
        // Store Microsoft token for profile photo fetching
        const msToken = (account as any).microsoftAccessToken
        if (msToken) {
          token.microsoftAccessToken = msToken
        }
      }

      // Revalidate backend token against DB-backed auth endpoint periodically.
      // This prevents stale FE session from appearing authenticated after DB reset/user deactivation.
      const backendToken = (token as any).backendToken as string | undefined
      const validatedAt = Number((token as any).backendTokenValidatedAt || 0)

      const shouldValidate =
        !!backendToken &&
        (Boolean(account) || trigger === 'update' || Date.now() - validatedAt > BACKEND_SESSION_VALIDATE_INTERVAL_MS)

      if (shouldValidate && backendToken) {
        const validationResult = await validateBackendSession(backendToken)

        if (!validationResult?.user?.sysUserId) {
          delete (token as any).backendToken
          delete (token as any).sysUserId
          delete (token as any).role
          delete (token as any).actualRole
          delete (token as any).viewRole
          ;(token as any).backendTokenInvalid = true
        } else {
          ;(token as any).backendTokenInvalid = false
          ;(token as any).backendTokenValidatedAt = Date.now()
          token.sysUserId = validationResult.user.sysUserId
          token.actualRole = validationResult.roles?.includes?.('ADMIN') ? 'ADMIN' : 'STAFF'
          // Preserve user's view role choice if they have ADMIN access
          // Only update viewRole if user doesn't have ADMIN or if they haven't set a viewRole
          const isAdmin = validationResult.roles?.includes?.('ADMIN')
          if (!isAdmin) {
            token.viewRole = 'STAFF'
            token.role = 'STAFF'
          } else if (!token.viewRole) {
            // If user is admin but hasn't set a viewRole, default to actualRole
            token.viewRole = token.actualRole
            token.role = token.actualRole
          }
          // If user is admin and has set a viewRole, preserve it
        }
      }

      return token
    },

    async session({ session, token }) {
      const isBackendSessionValid = Boolean((token as any).backendToken) && !(token as any).backendTokenInvalid

      // Use viewRole for the active role (user's choice), fallback to actualRole
      const activeRole = (token.viewRole as 'STAFF' | 'ADMIN') || (token.role as 'STAFF' | 'ADMIN') || 'STAFF'

      if (session.user) {
        session.user.id = token.userId as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        session.user.role = activeRole
        session.user.isActive = isBackendSessionValid
        session.user.actualRole = (token.actualRole as 'STAFF' | 'ADMIN') || activeRole
        ;(session.user as any).sysUserId = token.sysUserId
      }

      // Store backend token in session for API calls
      ;(session as any).backendToken = isBackendSessionValid ? token.backendToken : undefined
      ;(session as any).backendSessionInvalid = !isBackendSessionValid
      
      // Store Microsoft access token for profile photo fetching
      ;(session as any).microsoftAccessToken = token.microsoftAccessToken

      return session
    }
  },

  // Keep debug opt-in only to avoid noisy logs in shared dev/staging
  debug: process.env.NEXTAUTH_DEBUG === 'true'
}
