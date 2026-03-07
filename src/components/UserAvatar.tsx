'use client'

import { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Skeleton from '@mui/material/Skeleton'
import { useSession } from 'next-auth/react'
import { 
  fetchUserPhoto, 
  getCachedPhoto, 
  cachePhoto 
} from '@/services/user-profile.service'

interface UserAvatarProps {
  size?: number
  className?: string
}

/**
 * User Avatar component that fetches profile photo from Microsoft Graph
 * This fetches the photo AFTER login is complete, so it won't block authentication
 */
export const UserAvatar = ({ size = 38, className }: UserAvatarProps) => {
  const { data: session, status } = useSession()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only fetch after authentication is complete
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    const loadPhoto = async () => {
      // Check cache first
      const cached = getCachedPhoto()
      if (cached) {
        setPhotoUrl(cached)
        setIsLoading(false)
        return
      }

      // Get Microsoft access token from session
      const msToken = (session as any)?.microsoftAccessToken
      
      if (!msToken) {
        console.log('[UserAvatar] No Microsoft token available')
        setIsLoading(false)
        return
      }

      try {
        const photo = await fetchUserPhoto(msToken)
        if (photo) {
          setPhotoUrl(photo)
          cachePhoto(photo)
        }
      } catch (error) {
        console.error('[UserAvatar] Failed to load photo:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPhoto()
  }, [status, session])

  const userName = session?.user?.name || ''
  const userImage = session?.user?.image || photoUrl

  if (isLoading) {
    return (
      <Skeleton 
        variant="circular" 
        width={size} 
        height={size}
        className={className}
      />
    )
  }

  return (
    <Avatar
      alt={userName}
      src={userImage || undefined}
      className={className}
      sx={{ 
        width: size, 
        height: size,
        cursor: 'pointer'
      }}
    >
      {!userImage && userName.charAt(0).toUpperCase()}
    </Avatar>
  )
}

export default UserAvatar
