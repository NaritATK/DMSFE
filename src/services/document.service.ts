import axios, { isAxiosError } from 'axios'

import apiClient from '@/libs/axios'
import { clientT } from '@/utils/client-i18n'

export interface DepartmentUnit {
  departmentUnitId: string
  code: string
  name: string
  nameEn: string | null
  description: string | null
  isActive: boolean
  sortOrder: number
  createdBy: string | null
  createdAt: string
  updatedBy: string | null
  updatedAt: string
}

export interface AcademicYear {
  academicYearId: string
  year: string
  description: string | null
  startDate: string | null
  endDate: string | null
  isActive: boolean
  isLocked: boolean
  createdBy: string | null
  createdAt: string
  updatedBy: string | null
  updatedAt: string
}

export interface Document {
  documentId: string
  documentCode: string
  title: string
  description: string | null
  fileName: string
  fileSize: number
  mimeType: string
  fileType?: string | null
  minioPath: string
  minioUrl?: string | null
  fileExtension: string
  uploadedBy: string
  uploadedByName: string | null
  department: string
  academicYear: string
  departmentUnitId: string | null
  academicYearId: string | null
  masDepartmentUnit: {
    departmentUnitId: string
    code: string
    name: string
    nameEn: string | null
  } | null
  masAcademicYear: {
    academicYearId: string
    year: string
    description: string | null
  } | null
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED'
  confidentiality: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET'
  viewCount: number
  downloadCount: number
  currentVersion: number
  editCount: number
  isActive: boolean
  uploadedAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
}

export interface DocumentsResponse {
  documents: Document[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UploadResponse {
  message: string
  document: Document
  url: string
  path: string
  bucket: string
}

type VersionedDocument = Pick<Document, 'currentVersion' | 'editCount'>

type ApiErrorData = {
  details?: string
  error?: string
  requestId?: string
}

interface EnhancedError extends Error {
  originalError?: unknown
  requestId?: string
  status?: number
}

const toEditCount = (doc: Partial<VersionedDocument>): number => {
  const version = doc.currentVersion ?? doc.editCount ?? 0

  return Math.max((Number(version) || 0) - 1, 0)
}

const attachEditCount = <T extends Partial<VersionedDocument>>(doc: T): T & { editCount: number } => ({
  ...doc,
  editCount: toEditCount(doc)
})

const getUploadErrorMessage = (error: unknown): { message: string; requestId?: string; status?: number } => {
  if (!isAxiosError<ApiErrorData>(error)) {
    if (typeof error === 'string' && error.trim()) return { message: error.trim() }
    if (error instanceof Error && error.message.trim()) return { message: error.message }

    return { message: clientT('dms.api.uploadFailed', 'Upload failed') }
  }

  const details = error.response?.data?.details
  const apiError = error.response?.data?.error
  const requestId = error.response?.data?.requestId

  let parsedDetails: { details?: string; error?: string } | null = null

  if (typeof details === 'string') {
    try {
      const parsed = JSON.parse(details) as unknown

      if (typeof parsed === 'object' && parsed !== null) {
        parsedDetails = parsed as { details?: string; error?: string }
      }
    } catch {
      parsedDetails = null
    }
  }

  let message: string

  if (typeof parsedDetails?.details === 'string' && parsedDetails.details.trim()) {
    message = parsedDetails.details.trim()
  } else if (typeof parsedDetails?.error === 'string' && parsedDetails.error.trim()) {
    message = parsedDetails.error.trim()
  } else if (typeof details === 'string' && details.trim()) {
    message = details.trim()
  } else if (typeof apiError === 'string' && apiError.trim()) {
    message = apiError.trim()
  } else if (typeof error.message === 'string' && error.message.trim()) {
    message = error.message
  } else {
    message = clientT('dms.api.uploadFailed', 'Upload failed')
  }

  return {
    message,
    requestId,
    status: error.response?.status
  }
}

export const getDepartmentUnits = async (): Promise<DepartmentUnit[]> => {
  const response = await apiClient.get<DepartmentUnit[]>('/documents/department-units')

  return response.data
}

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  const response = await apiClient.get<AcademicYear[]>('/documents/academic-years')

  return response.data
}

export const getDocuments = async (params?: {
  page?: number
  limit?: number
  departmentUnitId?: string
  academicYearId?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
}): Promise<DocumentsResponse> => {
  const response = await apiClient.get<DocumentsResponse>('/documents', { params })

  return {
    ...response.data,
    documents: response.data.documents.map(doc => attachEditCount(doc))
  }
}

export const getDocumentById = async (id: string): Promise<Document> => {
  const response = await apiClient.get<Document>(`/documents/${id}`)

  return attachEditCount(response.data)
}

export const uploadDocument = async (
  file: File,
  title: string,
  departmentUnitId: string,
  academicYearId: string,
  description?: string,
  confidentiality?: string,
  departmentUnitCode?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('title', title)
  formData.append('departmentUnitId', departmentUnitId)
  formData.append('academicYearId', academicYearId)
  if (description) formData.append('description', description)
  if (confidentiality) formData.append('confidentiality', confidentiality)
  if (departmentUnitCode) formData.append('departmentUnitCode', departmentUnitCode)

  try {
    const response = await axios.post<UploadResponse>('/api/documents/upload', formData, {
      timeout: 180000,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

          onProgress(percentCompleted)
        }
      }
    })

    return response.data
  } catch (error: unknown) {
    console.error('[uploadDocument] caught error:', error)
    console.error('[uploadDocument] error.response:', isAxiosError(error) ? error.response : undefined)
    console.error('[uploadDocument] error.response.data:', isAxiosError(error) ? error.response?.data : undefined)

    const { message, requestId, status } = getUploadErrorMessage(error)
    const finalMessage = requestId ? `${message} (requestId: ${requestId})` : message
    const enhancedError: EnhancedError = new Error(finalMessage)

    enhancedError.originalError = error
    enhancedError.requestId = requestId
    enhancedError.status = status

    throw enhancedError
  }
}

export interface UpdateDocumentResult {
  message: string
  document: Document
  sheetsSync?: {
    attempted: boolean
    success: boolean
    reason?: string
    status?: number
    error?: string
    detail?: string
  }
  requeueConversion?: {
    attempted: boolean
    success: boolean
    reason?: string
    status?: number
    error?: string
    detail?: string
  }
}

export const updateDocument = async (
  id: string,
  data: {
    title?: string
    description?: string
    departmentUnitId?: string
    academicYearId?: string
    changeNote?: string
    file?: File
  },
  onProgress?: (progress: number) => void
): Promise<UpdateDocumentResult> => {
  const formData = new FormData()

  if (data.title) formData.append('title', data.title)
  if (data.description !== undefined) formData.append('description', data.description)
  if (data.departmentUnitId) formData.append('departmentUnitId', data.departmentUnitId)
  if (data.academicYearId) formData.append('academicYearId', data.academicYearId)
  if (data.changeNote) formData.append('changeNote', data.changeNote)
  if (data.file) formData.append('file', data.file)

  const response = await axios.patch<{ message: string; document: Document }>(`/api/documents/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

        onProgress(percentCompleted)
      }
    }
  })

  return {
    ...response.data,
    document: attachEditCount(response.data.document)
  }
}

export interface DeleteDocumentResult {
  message: string
  document: Document
  sheetsSync?: {
    attempted: boolean
    success: boolean
    reason?: string
    status?: number
    error?: string
    detail?: string
  }
}

export interface DocumentPresignResponse {
  url: string
}

export const getDocumentPresignUrl = async (id: string): Promise<DocumentPresignResponse> => {
  const response = await apiClient.get<DocumentPresignResponse>(`/documents/${id}/presign`)

  return response.data
}

export const deleteDocument = async (id: string): Promise<DeleteDocumentResult> => {
  const response = await apiClient.delete<DeleteDocumentResult>(`/documents/${id}`)

  return response.data
}
