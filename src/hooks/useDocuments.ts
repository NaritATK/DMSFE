'use client'

// Third-party Imports
import useSWR from 'swr'

// Import apiClient which has 401 interceptor
import apiClient from '@/libs/axios'

// Type Imports
import type { Document } from '@/services/document.service'
import type { HistoryFilters } from '@/types/dms'

interface DocumentsResponse {
  documents: Document[]
  total: number
  page: number
  limit: number
}

interface UseDocumentsOptions {
  filters: HistoryFilters
  page: number
  rowsPerPage: number
}

// Fetcher function for SWR using apiClient (has 401 interceptor)
const fetchDocuments = async (url: string): Promise<DocumentsResponse> => {
  console.log('[useDocuments] Fetching:', url)
  
  // Remove '/api' prefix because apiClient already has baseURL '/api'
  // URL from buildQueryString is like '/api/documents?...'
  // We need to change it to '/documents?...' for apiClient
  const path = url.replace(/^\/api/, '')
  
  // Use apiClient which has 401 interceptor
  const response = await apiClient.get(path)
  
  console.log('[useDocuments] Success:', response.data)
  return response.data
}

// Build query string from filters
const buildQueryString = (filters: HistoryFilters, page: number, limit: number): string => {
  const params = new URLSearchParams()
  
  if (filters.search) params.set('search', filters.search)
  if (filters.academicYear) params.set('academicYearId', filters.academicYear)
  if (filters.department) params.set('departmentUnitId', filters.department)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom.toISOString())
  if (filters.dateTo) params.set('dateTo', filters.dateTo.toISOString())
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  
  params.set('page', page.toString())
  params.set('limit', limit.toString())
  
  return `/api/documents?${params.toString()}`
}

/**
 * Hook for fetching documents with SWR
 * Features:
 * - Automatic caching and revalidation
 * - Request deduplication
 * - Optimistic updates support
 * - Error handling
 */
export const useDocuments = ({ filters, page, rowsPerPage }: UseDocumentsOptions) => {
  const queryString = buildQueryString(filters, page, rowsPerPage)
  
  const { data, error, isLoading, mutate } = useSWR<DocumentsResponse>(
    queryString,
    fetchDocuments,
    {
      // Revalidate on mount if data is stale
      revalidateOnMount: true,

      // Revalidate when window regains focus
      revalidateOnFocus: false, // Disable for data that doesn't change often
      // Revalidate on network reconnect
      revalidateOnReconnect: true,

      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,

      // Keep previous data while fetching new data
      keepPreviousData: true,

      // Retry on error
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      
      // Handle 401 error - redirect to login
      onError: (err) => {
        console.error('[useDocuments] SWR error:', err)
        if ((err as any)?.status === 401 || (err as any)?.response?.status === 401) {
          console.log('[useDocuments] 401 detected in onError, redirecting...')
          const currentPath = window.location.pathname
          window.location.href = `/login?error=session_expired&redirectTo=${encodeURIComponent(currentPath)}`
        }
      }
    }
  )

  return {
    documents: data?.documents ?? [],
    totalCount: data?.total ?? 0,
    isLoading,
    error,
    mutate // For manual revalidation
  }
}

/**
 * Hook for fetching a single document
 */
export const useDocument = (documentId: string | null) => {
  const { data, error, isLoading } = useSWR<Document>(
    documentId ? `/api/documents/${documentId}` : null,
    async (url: string) => {
      const response = await fetch(url)

      if (!response.ok) throw new Error('Failed to fetch document')
      
return response.json()
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  )

  return {
    document: data,
    isLoading,
    error
  }
}
