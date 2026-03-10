// ============================================
// User & Authentication Types
// ============================================

export type Role = 'STAFF' | 'ADMIN'

export interface User {
  id: string
  email: string
  name?: string | null
  role: Role
  permissions?: Record<string, boolean> | null
  department?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  menuAccess?: string[]
  lastLogin?: Date
}

export interface UserWithRelations extends User {
  documents?: Document[]
  activityLogs?: ActivityLog[]
}

// Alias for backward compatibility
export type UserWithPermissions = User

// ============================================
// Document Types
// ============================================

/**
 * Document type aligned with the actual API response from DMFAPI.
 * This is the single source of truth for document shape across the app.
 */
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

/**
 * DocumentWithRelations extends Document with optional nested data.
 * Used when the API returns related user/version info.
 */
export interface DocumentWithRelations extends Document {
  user?: User
  versions?: DocumentVersion[]
}

// Computed helpers for backward compatibility
export const getDocumentId = (doc: Document): string => doc.documentId
export const getDocumentDisplayName = (doc: Document): string => doc.title || doc.fileName
export const getDocumentOriginalName = (doc: Document): string => doc.fileName
export const getDocumentFileType = (doc: Document): string => doc.mimeType || doc.fileExtension || ''
export const getDocumentCreatedAt = (doc: Document): string => doc.uploadedAt
export const getDocumentUpdatedAt = (doc: Document): string => doc.updatedAt

export interface DocumentVersion {
  id: string
  documentId: string
  fileName: string
  filePath: string
  fileSize: number
  changedBy: string
  changeNote?: string | null
  createdAt: Date
}

export interface DocumentUploadData {
  file: File
  fileName: string
  academicYear: string
  department: string
  description?: string
}

export interface DocumentEditData {
  fileName?: string
  academicYear?: string
  department?: string
  description?: string
  file?: File
  changeNote?: string
}

// ============================================
// Menu Types
// ============================================

export interface Menu {
  id: string
  label: string
  icon?: string | null
  href?: string | null
  parentId?: string | null
  order: number
  isActive: boolean
  requiredRole?: Role | null
  createdAt: Date
  updatedAt: Date
}

export interface MenuWithChildren extends Menu {
  children?: MenuWithChildren[]
  parent?: Menu | null
}

export interface MenuTreeNode {
  id: string
  label?: string
  title?: string
  icon?: string
  href?: string
  path?: string
  order?: number
  children?: MenuTreeNode[]
  requiredRole?: Role
  visibleFor?: string[]
  parentId?: string | null
  isActive?: boolean
}

// Alias for backward compatibility
export type MenuNode = MenuTreeNode

// ============================================
// Webhook Types
// ============================================

export interface WebhookConfig {
  id: string
  department: string
  webhookUrl: string
  isActive: boolean
  enabled?: boolean
  events?: string[]
  headers?: Record<string, string>
  description?: string | null
  lastTriggered?: Date
  createdAt: Date
  updatedAt: Date
}

export interface WebhookTestResult {
  success: boolean
  statusCode?: number
  message: string
  responseTime?: number
}

// ============================================
// Activity Log Types
// ============================================

export type ActivityAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'LOGIN'
  | 'LOGOUT'
  | 'UPLOAD'
  | 'DOWNLOAD'
  | 'ROLE_SWITCH'

export type ActivityResource =
  | 'DOCUMENT'
  | 'USER'
  | 'MENU'
  | 'WEBHOOK'
  | 'DEPARTMENT'
  | 'ACADEMIC_YEAR'
  | 'AUTH'

export interface ActivityLog {
  id: string
  userId: string
  action: ActivityAction
  resource: ActivityResource
  resourceId?: string | null
  details?: Record<string, unknown> | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
}

export interface ActivityLogWithUser extends ActivityLog {
  user?: User
}

export interface ActivityLogFilters {
  userId?: string
  action?: ActivityAction
  resource?: ActivityResource
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}

export interface LogFilters {
  search: string
  userId: string
  action: string
  resource: string
  dateFrom: Date | string | null
  dateTo: Date | string | null
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface ActivityLogExtended extends ActivityLog {
  userName?: string
  userEmail?: string
  timestamp?: Date
}

export interface HistoryFilters {
  search: string
  academicYear: string
  department: string
  dateFrom: Date | null
  dateTo: Date | null
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

// ============================================
// Master Data Types
// ============================================

export interface Department {
  id: string
  code: string
  name: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AcademicYear {
  id: string
  year: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  totalDocuments: number
  totalSize: number
  documentsByDepartment: Array<{
    department: string
    count: number
  }>
  documentsByYear: Array<{
    year: string
    count: number
  }>
  recentUploads: DocumentWithRelations[]
  storageUsage: {
    used: number
    limit: number
    percentage: number
  }
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// Form Types
// ============================================

export interface UploadFormData {
  files: File[]
  academicYear: string
  academicYearId?: string
  department: string
  departmentUnitCode?: string
  departmentUnitId?: string
  description?: string
  uploader?: string
  uploaderName?: string
}

export interface EditFormData {
  fileName: string
  academicYear: string
  department: string
  description?: string
  changeNote?: string
}

export interface UserFormData {
  email: string
  name?: string
  role: Role
  department?: string
  permissions?: Record<string, boolean>
}

export interface MenuFormData {
  label: string
  icon?: string
  href?: string
  parentId?: string
  order: number
  requiredRole?: Role
}

export interface WebhookFormData {
  department: string
  webhookUrl: string
  description?: string
}

// ============================================
// UI State Types
// ============================================

export interface FileUploadState {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  previewUrl?: string
  displayName: string // File base name (editable)
  extension: string // File extension (read-only)
}

export interface RoleContext {
  currentRole: Role
  actualRole: Role
  isRoleSwitched: boolean
  switchRole: (role: Role) => void
  resetRole: () => void
}
