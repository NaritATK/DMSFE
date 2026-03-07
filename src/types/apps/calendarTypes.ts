// Third-party Imports
import type { CalendarApi, EventApi, EventInput } from '@fullcalendar/core'
import type { Dispatch } from '@reduxjs/toolkit'

// Type Imports
import type { ThemeColor } from '@core/types'

export type CalendarFiltersType = 'Personal' | 'Business' | 'Family' | 'Holiday' | 'ETC'

export type CalendarColors = {
  ETC: ThemeColor
  Family: ThemeColor
  Holiday: ThemeColor
  Personal: ThemeColor
  Business: ThemeColor
}

export type CalendarType = {
  events: EventInput[]
  filteredEvents: EventInput[]
  selectedEvent: EventInput | EventApi | null
  selectedCalendars: CalendarFiltersType[]
}

export type AddEventType = Omit<EventInput, 'id'>

export type SidebarLeftProps = {
  mdAbove: boolean
  calendarApi: CalendarApi | null
  calendarStore: CalendarType
  leftSidebarOpen: boolean
  dispatch: Dispatch
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
}

export type AddEventSidebarType = {
  calendarStore: CalendarType
  calendarApi: CalendarApi | null
  dispatch: Dispatch
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
}
