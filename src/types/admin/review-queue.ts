export type EligibilityPreviewRow = {
  eligibilityId?: string
  programCode: string | null
  facultyName?: string | null
  programName: string
  minGpa: number | null
  noMinGpa: boolean
}

export type EligibilityAuditDetailRow = {
  programCode?: string | null
  facultyName?: string | null
  programName?: string
  minGpa?: number | null
  noMinGpa?: boolean
}

export type AuditItem = {
  logId: string
  userId: string
  action: string
  details: {
    beforeCount?: number
    afterCount?: number
    beforeSample?: EligibilityAuditDetailRow[]
    afterSample?: EligibilityAuditDetailRow[]
  } | null
  createdAt: string
}

export type AuditDiffStatus = 'ALL' | 'ADDED' | 'REMOVED' | 'UPDATED' | 'UNCHANGED'

export type AuditDiffRow = {
  key: string
  before?: EligibilityAuditDetailRow
  after?: EligibilityAuditDetailRow
  status: Exclude<AuditDiffStatus, 'ALL'>
}

export type ReviewItem = {
  conversionId: string
  documentId: string
  conversionStatus: string
  lastError: string | null
  chunkCount: number | null
  embeddedChunkCount: number | null
  eligibilityCount: number
  updatedAt: string
  document: {
    documentId: string
    title: string
    fileName: string
    status: string
    isActive: boolean
    uploadedAt: string
  }
  eligibilityPreview: EligibilityPreviewRow[]
}
