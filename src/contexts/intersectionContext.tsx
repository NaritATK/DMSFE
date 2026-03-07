'use client'

// React Imports
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

export const initialIntersections: Record<string, boolean> = {
  features: false,
  team: false,
  faq: false,
  'contact-us': false
}

type IntersectionContextProps = {
  intersections: Record<string, boolean>
  updateIntersections: (data: Record<string, boolean>) => void
}

export const IntersectionContext = createContext<IntersectionContextProps | null>(null)

export const IntersectionProvider = ({ children }: { children: ReactNode }) => {
  // States
  const [intersections, setIntersections] = useState(initialIntersections)

  const updateIntersections = (data: Record<string, boolean>) => {
    setIntersections(prev => {
      const isAnyActive = Object.values(prev).some(value => value === true)
      const newValue = Object.values(data)[0]

      // If trying to deactivate and nothing is active, skip update
      if (!newValue && !isAnyActive) return prev

      // Create new state object instead of mutating
      const nextState: Record<string, boolean> = {}
      
      // Copy previous state
      for (const key of Object.keys(prev)) {
        nextState[key] = prev[key]
      }
      
      // If activating a new section, deactivate others
      if (newValue) {
        for (const key of Object.keys(nextState)) {
          if (nextState[key] && data[key] !== true) {
            nextState[key] = false
          }
        }
      }
      
      // Apply new data
      for (const key of Object.keys(data)) {
        nextState[key] = data[key]
      }

      return nextState
    })
  }

  return (
    <IntersectionContext.Provider value={{ intersections, updateIntersections }}>
      {children}
    </IntersectionContext.Provider>
  )
}
