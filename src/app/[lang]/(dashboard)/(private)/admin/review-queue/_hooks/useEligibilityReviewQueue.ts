import { useCallback, useEffect, useMemo, useState } from 'react'

import { getErrorMessage } from '../../_utils/admin-error.utils'
import { useDictionary } from '@/hooks/useDictionary'
import { reviewQueueService } from '@/services/review-queue.service'
import type { AuditDiffStatus, AuditItem, EligibilityPreviewRow, ReviewItem } from '@/types/admin/review-queue'
import { buildAuditCsv, calculateEditorDiff, downloadBlob, emptyEligibilityRow, sanitizeEligibilityRows } from '../_utils/review-queue.utils'

export const useEligibilityReviewQueue = () => {
  const { t } = useDictionary()
  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [requeueingId, setRequeueingId] = useState<string | null>(null)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorLoading, setEditorLoading] = useState(false)
  const [editorSaving, setEditorSaving] = useState(false)
  const [editorConversionId, setEditorConversionId] = useState<string | null>(null)
  const [editorDocumentTitle, setEditorDocumentTitle] = useState('')
  const [editorRows, setEditorRows] = useState<EligibilityPreviewRow[]>([])
  const [originalEditorRows, setOriginalEditorRows] = useState<EligibilityPreviewRow[]>([])

  const [auditOpen, setAuditOpen] = useState(false)
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditItems, setAuditItems] = useState<AuditItem[]>([])
  const [auditConversionId, setAuditConversionId] = useState<string | null>(null)
  const [auditStatusFilter, setAuditStatusFilter] = useState<AuditDiffStatus>('ALL')

  const fetchQueue = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setItems(await reviewQueueService.listEligibilityQueue())
    } catch (error: unknown) {
      setError(getErrorMessage(error, t('dms.admin.reviewQueue.errors.loadQueue')))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items

    return items.filter(item =>
      item.document?.title?.toLowerCase().includes(q) ||
      item.document?.fileName?.toLowerCase().includes(q) ||
      item.documentId.toLowerCase().includes(q) ||
      item.conversionId.toLowerCase().includes(q)
    )
  }, [items, search])

  const handleResolve = async (conversionId: string) => {
    setResolvingId(conversionId)
    try {
      await reviewQueueService.resolve(conversionId)
      await fetchQueue()
    } catch (error: unknown) {
      setError(getErrorMessage(error, t('dms.admin.reviewQueue.errors.resolve')))
    } finally {
      setResolvingId(null)
    }
  }

  const handleRequeue = async (conversionId: string) => {
    setRequeueingId(conversionId)
    try {
      await reviewQueueService.requeue(conversionId)
      await fetchQueue()
    } catch (error: unknown) {
      setError(getErrorMessage(error, t('dms.admin.reviewQueue.errors.requeue')))
    } finally {
      setRequeueingId(null)
    }
  }

  const openEditor = async (item: ReviewItem) => {
    setEditorOpen(true)
    setEditorLoading(true)
    setEditorConversionId(item.conversionId)
    setEditorDocumentTitle(item.document?.title || item.documentId)

    try {
      const rows = await reviewQueueService.getRows(item.conversionId)
      const initialRows = rows.length ? rows : [emptyEligibilityRow()]
      setEditorRows(initialRows)
      setOriginalEditorRows(initialRows)
    } catch (error: unknown) {
      setError(getErrorMessage(error, t('dms.admin.reviewQueue.errors.loadRows')))
      setEditorRows([emptyEligibilityRow()])
      setOriginalEditorRows([])
    } finally {
      setEditorLoading(false)
    }
  }

  const closeEditor = () => {
    if (editorSaving) return
    setEditorOpen(false)
    setEditorConversionId(null)
    setEditorDocumentTitle('')
    setEditorRows([])
    setOriginalEditorRows([])
  }

  const updateEditorRow = (idx: number, patch: Partial<EligibilityPreviewRow>) => {
    setEditorRows(prev => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)))
  }

  const removeEditorRow = (idx: number) => {
    setEditorRows(prev => {
      const next = prev.filter((_, i) => i !== idx)

      return next.length ? next : [emptyEligibilityRow()]
    })
  }

  const addEditorRow = () => setEditorRows(prev => [...prev, emptyEligibilityRow()])

  const saveEditorRows = async () => {
    if (!editorConversionId) return

    const sanitizedRows = sanitizeEligibilityRows(editorRows)
    if (sanitizedRows.length === 0) {
      setError(t('dms.admin.reviewQueue.errors.requireProgramName'))
      return
    }

    setEditorSaving(true)
    try {
      await reviewQueueService.saveRows(editorConversionId, sanitizedRows)
      await reviewQueueService.resolve(editorConversionId)
      closeEditor()
      await fetchQueue()
    } catch (error: unknown) {
      setError(getErrorMessage(error, t('dms.admin.reviewQueue.errors.saveRows')))
    } finally {
      setEditorSaving(false)
    }
  }

  const openAudit = async (conversionId: string) => {
    setAuditOpen(true)
    setAuditLoading(true)
    setAuditConversionId(conversionId)

    try {
      setAuditItems(await reviewQueueService.getAuditLogs(conversionId))
    } catch (error: unknown) {
      setError(getErrorMessage(error, t('dms.admin.reviewQueue.errors.loadAudit')))
      setAuditItems([])
    } finally {
      setAuditLoading(false)
    }
  }

  const closeAudit = () => {
    setAuditOpen(false)
    setAuditConversionId(null)
    setAuditItems([])
  }

  const editorDiff = useMemo(() => calculateEditorDiff(originalEditorRows, editorRows), [editorRows, originalEditorRows])

  const exportAuditJson = () => {
    downloadBlob(
      JSON.stringify(auditItems, null, 2),
      `eligibility-audit-${auditConversionId || 'all'}.json`,
      'application/json;charset=utf-8'
    )
  }

  const exportAuditCsv = () => {
    downloadBlob(
      buildAuditCsv(auditItems, auditStatusFilter, t('dms.admin.reviewQueue.noMinGpaRule')),
      `eligibility-audit-${auditConversionId || 'all'}.csv`,
      'text/csv;charset=utf-8'
    )
  }

  return {
    state: {
      items,
      loading,
      error,
      search,
      resolvingId,
      requeueingId,
      filteredItems,
      editorOpen,
      editorLoading,
      editorSaving,
      editorDocumentTitle,
      editorRows,
      editorDiff,
      auditOpen,
      auditLoading,
      auditItems,
      auditConversionId,
      auditStatusFilter,
    },
    actions: {
      setError,
      setSearch,
      setAuditStatusFilter,
      fetchQueue,
      handleResolve,
      handleRequeue,
      openEditor,
      closeEditor,
      updateEditorRow,
      removeEditorRow,
      addEditorRow,
      saveEditorRows,
      openAudit,
      closeAudit,
      exportAuditJson,
      exportAuditCsv,
    },
  }
}
