'use client'

// React Imports
import { createContext, useContext, useMemo, useState, useCallback } from 'react'

// Type Imports
import type { ChildrenType } from '../types'

export type HorizontalNavContextProps = {
  isBreakpointReached?: boolean
  updateIsBreakpointReached: (isBreakpointReached: boolean) => void
}

// Use null as default to enforce provider usage
const HorizontalNavContext = createContext<HorizontalNavContextProps | null>(null)

/**
 * Hook to access horizontal navigation context
 * @throws Error if used outside of HorizontalNavProvider
 */
export const useHorizontalNav = (): HorizontalNavContextProps => {
  const context = useContext(HorizontalNavContext)
  
  if (context === null) {
    throw new Error('useHorizontalNav must be used within a HorizontalNavProvider')
  }
  
  return context
}

export const HorizontalNavProvider = ({ children }: ChildrenType) => {
  // States
  const [isBreakpointReached, setIsBreakpointReached] = useState(false)

  // Stable callback using useCallback
  const updateIsBreakpointReached = useCallback((value: boolean) => {
    setIsBreakpointReached(value)
  }, [])

  // Hooks
  const HorizontalNavProviderValue = useMemo(
    () => ({
      isBreakpointReached,
      updateIsBreakpointReached
    }),
    [isBreakpointReached, updateIsBreakpointReached]
  )

  return <HorizontalNavContext.Provider value={HorizontalNavProviderValue}>{children}</HorizontalNavContext.Provider>
}

export default HorizontalNavContext
