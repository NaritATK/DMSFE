'use client'

// React Imports
import { useCallback, useRef } from 'react'

import type { ActivityAction, ActivityResource } from '@/types/dms'

interface LogActivityParams {
  action: ActivityAction
  resource: ActivityResource
  resourceId?: string
  details?: Record<string, any>
}

interface PendingLog {
  params: LogActivityParams
  timestamp: string
  resolve: (value: any) => void
  reject: (reason: any) => void
}

// Module-level batch queue (shared across all hook instances)
const batchQueue: PendingLog[] = []
let batchTimeout: NodeJS.Timeout | null = null
let flushPromise: Promise<any> | null = null

/**
 * Flush the batched logs to the server
 * Uses Beacon API when available (non-blocking, works during page unload)
 * Falls back to fetch with keepalive
 */
const flushBatch = async (): Promise<void> => {
  if (batchQueue.length === 0) return
  if (flushPromise) return flushPromise

  const currentBatch = batchQueue.splice(0)
  
  flushPromise = (async () => {
    const payload = currentBatch.map(({ params, timestamp }) => ({
      ...params,
      timestamp
    }))

    try {
      // Try Beacon API first (best for logging - non-blocking, survives page unload)
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], {
          type: 'application/json'
        })

        const sent = navigator.sendBeacon('/api/logs/batch', blob)
        
        if (sent) {
          currentBatch.forEach(({ resolve }) => resolve({ success: true }))
          
return
        }
      }

      // Fallback to fetch with keepalive
      const response = await fetch('/api/logs/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true // Ensures request completes even during page unload
      })

      if (!response.ok) {
        throw new Error('Failed to log activity')
      }

      const result = await response.json()

      currentBatch.forEach(({ resolve }) => resolve(result))
    } catch (error) {
      console.error('Error logging activity:', error)

      // Don't throw - logging failures shouldn't break user flow
      currentBatch.forEach(({ resolve }) => resolve({ success: false, error }))
    } finally {
      flushPromise = null
    }
  })()

  return flushPromise
}

/**
 * Schedule batch flush with debouncing
 */
const scheduleFlush = (delay = 100): void => {
  if (batchTimeout) {
    clearTimeout(batchTimeout)
  }

  batchTimeout = setTimeout(() => {
    flushBatch()
  }, delay)
}

/**
 * Hook for logging user activities
 * Features:
 * - Batching: Multiple logs are batched and sent together
 * - Non-blocking: Uses Beacon API or keepalive fetch
 * - Deduplication: Identical logs within batch window are deduplicated
 * - Fire-and-forget: Logging errors don't break user flow
 */
export const useActivityLog = () => {
  // Track logged activities to prevent duplicates within short time window
  const recentLogs = useRef<Set<string>>(new Set())

  const logActivity = useCallback(async (params: LogActivityParams): Promise<any> => {
    // Create deduplication key
    const dedupKey = `${params.action}-${params.resource}-${params.resourceId || 'none'}`
    
    // Skip if identical log was recently added (within 100ms batch window)
    if (recentLogs.current.has(dedupKey)) {
      return { success: true, deduplicated: true }
    }
    
    // Mark as recently logged
    recentLogs.current.add(dedupKey)
    setTimeout(() => recentLogs.current.delete(dedupKey), 1000)

    const timestamp = new Date().toISOString()

    // Return promise that resolves when batch is flushed
    return new Promise((resolve, reject) => {
      batchQueue.push({ params, timestamp, resolve, reject })
      
      // Flush immediately if batch is large enough
      if (batchQueue.length >= 10) {
        flushBatch()
      } else {
        scheduleFlush(100)
      }
    })
  }, [])

  return {
    logActivity
  }
}
