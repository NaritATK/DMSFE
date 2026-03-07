'use client'

// React Imports
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Type Imports
import type { ChildrenType } from '../types'

export type VerticalNavState = {
  width?: number
  collapsedWidth?: number
  isCollapsed?: boolean
  isHovered?: boolean
  isToggled?: boolean
  isScrollWithContent?: boolean
  isBreakpointReached?: boolean
  isPopoutWhenCollapsed?: boolean
  collapsing?: boolean // for internal use only
  expanding?: boolean // for internal use only
  transitionDuration?: number
}

export type VerticalNavContextProps = VerticalNavState & {
  updateVerticalNavState: (values: Partial<VerticalNavState>) => void
  collapseVerticalNav: (value?: boolean) => void
  hoverVerticalNav: (value?: boolean) => void
  toggleVerticalNav: (value?: boolean) => void
}

// Use null as default to enforce provider usage
const VerticalNavContext = createContext<VerticalNavContextProps | null>(null)

/**
 * Hook to access vertical navigation context
 * @throws Error if used outside of VerticalNavProvider
 */
export const useVerticalNav = (): VerticalNavContextProps => {
  const context = useContext(VerticalNavContext)
  
  if (context === null) {
    throw new Error('useVerticalNav must be used within a VerticalNavProvider')
  }
  
  return context
}

export const VerticalNavProvider = ({ children }: ChildrenType) => {
  // States
  const [verticalNavState, setVerticalNavState] = useState<VerticalNavState>()

  // Hooks
  const updateVerticalNavState = useCallback((values: Partial<VerticalNavState>) => {
    setVerticalNavState(prevState => ({
      ...prevState,
      ...values,
      collapsing: values.isCollapsed === true,
      expanding: values.isCollapsed === false
    }))
  }, [])

  const collapseVerticalNav = useCallback((value?: boolean) => {
    setVerticalNavState(prevState => ({
      ...prevState,
      isHovered: value !== undefined && false,
      isCollapsed: value !== undefined ? Boolean(value) : !Boolean(prevState?.isCollapsed),
      collapsing: value === true,
      expanding: value !== true
    }))
  }, [])

  const hoverVerticalNav = useCallback((value?: boolean) => {
    setVerticalNavState(prevState => ({
      ...prevState,
      isHovered: value !== undefined ? Boolean(value) : !Boolean(prevState?.isHovered)
    }))
  }, [])

  const toggleVerticalNav = useCallback((value?: boolean) => {
    setVerticalNavState(prevState => ({
      ...prevState,
      isToggled: value !== undefined ? Boolean(value) : !Boolean(prevState?.isToggled)
    }))
  }, [])

  const verticalNavProviderValue = useMemo(
    () => ({
      ...verticalNavState,
      updateVerticalNavState,
      collapseVerticalNav,
      hoverVerticalNav,
      toggleVerticalNav
    }),
    [verticalNavState, updateVerticalNavState, collapseVerticalNav, hoverVerticalNav, toggleVerticalNav]
  )

  return <VerticalNavContext.Provider value={verticalNavProviderValue}>{children}</VerticalNavContext.Provider>
}

export default VerticalNavContext
