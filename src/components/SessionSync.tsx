'use client'

import { useAuth } from '@/hooks/useAuth'

const SessionSync = () => {
  // Ensure backend token/role are synced to localStorage on every private page.
  useAuth()

  return null
}

export default SessionSync
