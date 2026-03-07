'use client'

// React Imports
import { useEffect, useRef } from 'react'

import { signOut, useSession } from 'next-auth/react'

import type { Role } from '@/types/dms'

export const useAuth = () => {
  const { data: session, status, update } = useSession()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user
  const hasTriggeredInvalidSessionSignOut = useRef(false)

  // Auto sign-out when backend session becomes invalid (DB check failed).
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (status !== 'authenticated') return

    const backendSessionInvalid = Boolean((session as any)?.backendSessionInvalid)

    if (!backendSessionInvalid) {
      hasTriggeredInvalidSessionSignOut.current = false

      return
    }

    if (hasTriggeredInvalidSessionSignOut.current) return

    hasTriggeredInvalidSessionSignOut.current = true

    localStorage.removeItem('backendToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('sysUserId')

    void signOut({ callbackUrl: '/login' })
  }, [session, status])

  // Keep localStorage token/role in sync with NextAuth session
  // to prevent random 401 + forced redirect when switching roles.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const backendToken = (session as any)?.backendToken
    const role = (session as any)?.user?.role
    const sysUserId = (session as any)?.user?.sysUserId

    if (status === 'unauthenticated') {
      localStorage.removeItem('backendToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('sysUserId')
      
return
    }

    if (backendToken) {
      localStorage.setItem('backendToken', backendToken)
    }

    if (role) {
      localStorage.setItem('userRole', role)
    }

    if (sysUserId) {
      localStorage.setItem('sysUserId', sysUserId)
    }
  }, [session, status])

  return {
    user,
    isAuthenticated,
    isLoading,
    status,
    session,
    updateSession: update
  }
}

export const useRole = () => {
  const { user } = useAuth()

  // actualRole is the real role from backend, role is the current view role
  const actualRole = (user as any)?.actualRole || user?.role
  const viewRole = user?.role

  const hasRole = (role: Role): boolean => {
    return viewRole === role
  }

  // Check if user actually has ADMIN role in backend
  const canBeAdmin = actualRole === 'ADMIN'
  
  const isStaff = viewRole === 'STAFF'
  const isAdmin = viewRole === 'ADMIN'

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false
    
    return user.permissions[permission] === true
  }

  return {
    role: viewRole,
    actualRole,
    canBeAdmin,
    isStaff,
    isAdmin,
    hasRole,
    hasPermission
  }
}
