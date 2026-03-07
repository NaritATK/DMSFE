'use client'

/**
 * Service for fetching user profile photo from Microsoft Graph API
 * This runs AFTER login is complete, so it won't block the authentication flow
 */

const GRAPH_API_PHOTO_URL = 'https://graph.microsoft.com/v1.0/me/photo/$value'

/**
 * Fetch user photo from Microsoft Graph API
 * This should be called AFTER the user is fully authenticated
 */
export const fetchUserPhoto = async (accessToken: string): Promise<string | null> => {
  try {
    const response = await fetch(GRAPH_API_PHOTO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      console.log('[UserProfile] No photo found:', response.status)
      return null
    }

    // Convert binary photo to base64
    const buffer = await response.arrayBuffer()
    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error('[UserProfile] Failed to fetch photo:', error)
    return null
  }
}

/**
 * Get photo from localStorage cache
 */
export const getCachedPhoto = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userPhoto')
}

/**
 * Cache photo to localStorage
 */
export const cachePhoto = (photoUrl: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('userPhoto', photoUrl)
}

/**
 * Clear cached photo
 */
export const clearCachedPhoto = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('userPhoto')
}
