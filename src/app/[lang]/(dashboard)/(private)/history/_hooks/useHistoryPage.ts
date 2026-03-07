import { useState } from 'react'

import { useDocuments } from '@/hooks/useDocuments'
import { getDocumentPresignUrl } from '@/services/document.service'

import type { DocumentWithRelations, HistoryFilters } from '@/types/dms'

const initialFilters: HistoryFilters = {
  search: '',
  academicYear: '',
  department: '',
  dateFrom: null,
  dateTo: null,
  sortBy: 'updatedAt',
  sortOrder: 'desc'
}

const getDocumentId = (document: DocumentWithRelations): string | null => {
  const candidateId =
    typeof document.id === 'string'
      ? document.id
      : typeof (document as DocumentWithRelations & { documentId?: unknown }).documentId === 'string'
        ? String((document as DocumentWithRelations & { documentId?: string }).documentId)
        : null

  if (!candidateId || candidateId === 'undefined' || candidateId === 'null') return null

  return candidateId
}

export const useHistoryPage = () => {
  const [filters, setFilters] = useState<HistoryFilters>(initialFilters)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithRelations | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const { documents, totalCount, isLoading, error } = useDocuments({ filters, page, rowsPerPage })
  
  // Debug: log error details
  if (error) {
    console.log('[useHistoryPage] Error:', error)
    console.log('[useHistoryPage] Error status:', (error as any)?.status)
    console.log('[useHistoryPage] Error code:', (error as any)?.errorCode)
  }

  const openDetailDialog = (document: DocumentWithRelations) => {
    setSelectedDocument(document)
    setDetailDialogOpen(true)
  }

  const closeDetailDialog = () => {
    setDetailDialogOpen(false)
    setSelectedDocument(null)
  }

  const handleDownload = async (document: DocumentWithRelations) => {
    const documentId = getDocumentId(document)

    if (!documentId) {
      console.error('Invalid document ID:', document)

      return
    }

    try {
      const data = await getDocumentPresignUrl(documentId)

      if (data?.url) {
        window.open(data.url, '_blank')
      }
    } catch {
      // ignore non-critical download errors in UI
    }
  }

  return {
    state: {
      filters,
      page,
      rowsPerPage,
      selectedDocument,
      detailDialogOpen,
      documents,
      totalCount,
      isLoading,
      error
    },
    actions: {
      setFilters,
      setPage,
      setRowsPerPage,
      openDetailDialog,
      closeDetailDialog,
      handleDownload
    }
  }
}
