'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  fetchUserPhoto, 
  getCachedPhoto, 
  cachePhoto,
  clearCachedPhoto 
} from '@/services/user-profile.service'

/**
 * Hook to fetch and cache user profile photo from Microsoft Graph
 * This runs after login is complete, so it won't block authentication
 */
export const useUserPhoto = () => {
  const { data: session, status } = useSession()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only fetch after authentication is complete
    if (status !== 'authenticated') return

    const loadPhoto = async () => {
      // Check cache first
      const cached = getCachedPhoto()
      if (cached) {
        setPhotoUrl(cached)
        return
      }

      // Get Microsoft access token from session
      // Note: We need to store this during sign in
      const msToken = (session as any)?.microsoftAccessToken
      
      if (!msToken) {
        console.log('[useUserPhoto] No Microsoft token available')
        return
      }

      setIsLoading(true)
      try {
        const photo = await fetchUserPhoto(msToken)
        if (photo) {
          setPhotoUrl(photo)
          cachePhoto(photo)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadPhoto()
  }, [status, session])

  const refreshPhoto = async () => {
    clearCachedPhoto()
    setPhotoUrl(null)
    
    if (status !== 'authenticated') return
    
    const msToken = (session as any)?.microsoftAccessToken
    if (!msToken) return

    setIsLoading(true)
    try {
      const photo = await fetchUserPhoto(msToken)
      if (photo) {
        setPhotoUrl(photo)
        cachePhoto(photo)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    photoUrl,
    isLoading,
    refreshPhoto
  }
}
