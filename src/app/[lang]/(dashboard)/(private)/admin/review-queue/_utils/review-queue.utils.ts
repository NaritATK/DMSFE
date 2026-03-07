import type { AuditDiffRow, AuditDiffStatus, AuditItem, EligibilityAuditDetailRow, EligibilityPreviewRow } from '@/types/admin/review-queue'

export const emptyEligibilityRow = (): EligibilityPreviewRow => ({
  programCode: '',
  facultyName: '',
  programName: '',
  minGpa: null,
  noMinGpa: false,
})

export const reviewRowKey = (row?: EligibilityPreviewRow | EligibilityAuditDetailRow | null) =>
  `${row?.programCode || ''}::${row?.programName || ''}`.toLowerCase()

export const reviewRowLabel = (row?: EligibilityPreviewRow | EligibilityAuditDetailRow | null) =>
  `${row?.programCode || '-'} ${row?.programName || '-'}`

export const reviewRowRule = (row?: EligibilityPreviewRow | EligibilityAuditDetailRow | null, noMinGpaText = 'No minimum GPA') =>
  row?.noMinGpa ? noMinGpaText : (row?.minGpa ?? 'NA')

const parseMinGpa = (value: EligibilityPreviewRow['minGpa'], noMinGpa: boolean) => {
  if (noMinGpa || value === null || value === undefined) {
    return null
  }

  const numeric = Number(value)

  return Number.isFinite(numeric) ? numeric : null
}

export const sanitizeEligibilityRows = (rows: EligibilityPreviewRow[]) =>
  rows
    .map(row => ({
      programCode: row.programCode?.trim() || null,
      facultyName: row.facultyName?.trim() || null,
      programName: row.programName?.trim() || '',
      minGpa: parseMinGpa(row.minGpa, Boolean(row.noMinGpa)),
      noMinGpa: Boolean(row.noMinGpa),
    }))
    .filter(row => row.programName) as EligibilityPreviewRow[]

export const calculateEditorDiff = (originalRows: EligibilityPreviewRow[], currentRows: EligibilityPreviewRow[]) => {
  const originalMap = new Map(originalRows.map(row => [reviewRowKey(row), row]))
  const currentMap = new Map(currentRows.map(row => [reviewRowKey(row), row]))

  const addedCount = [...currentMap.keys()].filter(k => !originalMap.has(k) && k !== '::').length
  const removedCount = [...originalMap.keys()].filter(k => !currentMap.has(k) && k !== '::').length
  const updatedCount = [...currentMap.keys()].filter(k => {
    if (!originalMap.has(k) || k === '::') return false
    const a = originalMap.get(k)!
    const b = currentMap.get(k)!

    return (a.minGpa ?? null) !== (b.minGpa ?? null) || Boolean(a.noMinGpa) !== Boolean(b.noMinGpa) || (a.facultyName || '') !== (b.facultyName || '')
  }).length

  return { addedCount, removedCount, updatedCount }
}

export const getAuditDiffRows = (item: AuditItem): AuditDiffRow[] => {
  const before = Array.isArray(item.details?.beforeSample) ? item.details.beforeSample : []
  const after = Array.isArray(item.details?.afterSample) ? item.details.afterSample : []
  const beforeMap = new Map(before.map(row => [reviewRowKey(row), row]))
  const afterMap = new Map(after.map(row => [reviewRowKey(row), row]))
  const keys = Array.from(new Set([...beforeMap.keys(), ...afterMap.keys()])).filter(k => k !== '::')

  return keys.map(key => {
    const previous = beforeMap.get(key)
    const next = afterMap.get(key)
    const changed = JSON.stringify({ minGpa: previous?.minGpa ?? null, noMinGpa: !!previous?.noMinGpa }) !== JSON.stringify({ minGpa: next?.minGpa ?? null, noMinGpa: !!next?.noMinGpa })
    const status: AuditDiffRow['status'] = !previous ? 'ADDED' : !next ? 'REMOVED' : changed ? 'UPDATED' : 'UNCHANGED'

    return { key, before: previous, after: next, status }
  })
}

export const buildAuditCsv = (items: AuditItem[], statusFilter: AuditDiffStatus, noMinGpaText = 'No minimum GPA') => {
  const rows: string[] = ['logId,createdAt,userId,status,program,beforeRule,afterRule']

  items.forEach(item => {
    getAuditDiffRows(item)
      .filter(row => (statusFilter === 'ALL' ? true : row.status === statusFilter))
      .forEach(row => {
        const cols = [
          item.logId,
          item.createdAt,
          item.userId,
          row.status,
          reviewRowLabel(row.after || row.before),
          String(reviewRowRule(row.before, noMinGpaText)),
          String(reviewRowRule(row.after, noMinGpaText)),
        ].map(value => `"${String(value).replaceAll('"', '""')}"`)

        rows.push(cols.join(','))
      })
  })

  return rows.join('\n')
}

export const downloadBlob = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
