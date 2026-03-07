import { useCallback, useEffect, useMemo, useState } from 'react'

import { deleteDocument, getDocuments, updateDocument, type Document } from '@/services/document.service'

type EditPageMessages = {
  deleteConfirmText: string
  deleteSheetsSyncFailedTitle: string
  deleteFailedTitle: string
  unknownError: string
  updateSheetsSyncFailedTitle: string
  requeueConversionFailedTitle: string
}

type DocumentMutationPayload = {
  title?: string
  description?: string
  departmentUnitId?: string
  academicYearId?: string
  changeNote?: string
  file?: File
}

type IntegrationStatus = {
  attempted: boolean
  success: boolean
  status?: number
  error?: string
  detail?: string
}

const buildFailureAlertMessage = (title: string, documentId: string, integrationStatus: IntegrationStatus) => {
  return [
    title,
    `documentId: ${documentId}`,
    `error: ${integrationStatus.error || '-'}`,
    `detail: ${integrationStatus.detail || '-'}`,
    integrationStatus.status ? `status: ${integrationStatus.status}` : null
  ]
    .filter(Boolean)
    .join('\n')
}

export const useEditDocumentsPage = (messages: EditPageMessages) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getDocuments({
        page,
        limit: rowsPerPage,
        search: searchQuery || undefined
      })

      setDocuments(response.documents)
      setTotal(response.total)
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, searchQuery])

  useEffect(() => {
    void fetchDocuments()
  }, [fetchDocuments])

  const handleEdit = (document: Document) => {
    setSelectedDocument(document)
    setEditDialogOpen(true)
  }

  const handleDelete = async (document: Document) => {
    if (!confirm(messages.deleteConfirmText)) return

    try {
      const result = await deleteDocument(document.documentId)

      if (result.sheetsSync?.attempted && !result.sheetsSync.success) {
        alert(buildFailureAlertMessage(messages.deleteSheetsSyncFailedTitle, document.documentId, result.sheetsSync))
      }

      await fetchDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
      const detail = error instanceof Error ? error.message : messages.unknownError
      alert(`${messages.deleteFailedTitle}\n${detail}`)
    }
  }

  const handleEditClose = () => {
    setEditDialogOpen(false)
    setSelectedDocument(null)
  }

  const handleEditSave = async (id: string, data: DocumentMutationPayload) => {
    try {
      const result = await updateDocument(id, data)

      if (result.sheetsSync?.attempted && !result.sheetsSync.success) {
        alert(buildFailureAlertMessage(messages.updateSheetsSyncFailedTitle, id, result.sheetsSync))
      }

      if (result.requeueConversion?.attempted && !result.requeueConversion.success) {
        alert(buildFailureAlertMessage(messages.requeueConversionFailedTitle, id, result.requeueConversion))
      }

      await fetchDocuments()
      handleEditClose()
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  const handleSearch = () => setPage(0)
  const handlePageChange = (newPage: number) => setPage(newPage)
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  const documentCountLabel = useMemo(() => total, [total])

  return {
    state: {
      documents,
      loading,
      searchQuery,
      selectedDocument,
      editDialogOpen,
      page,
      rowsPerPage,
      total,
      documentCountLabel
    },
    actions: {
      setSearchQuery,
      handleSearch,
      handleEdit,
      handleDelete,
      handleEditClose,
      handleEditSave,
      handlePageChange,
      handleRowsPerPageChange,
      fetchDocuments
    }
  }
}
