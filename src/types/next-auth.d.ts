import 'next-auth'
import 'next-auth/jwt'
import type { Role } from './dms'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    backendToken?: string
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: Role
      actualRole?: Role
      department?: string
      permissions?: Record<string, boolean>
      isActive: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role?: Role
    actualRole?: Role
    department?: string
    permissions?: Record<string, boolean>
    isActive?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    accessToken?: string
    backendToken?: string
    sysUserId?: string
    role: Role
    actualRole?: Role
    viewRole?: Role
    department?: string
    permissions?: Record<string, boolean>
    isActive: boolean
    microsoftAccessToken?: string
  }
}
