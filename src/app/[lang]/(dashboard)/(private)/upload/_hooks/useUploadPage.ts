import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { useActivityLog } from '@/hooks/useActivityLog'
import { uploadDocument } from '@/services/document.service'

import type { FileUploadState, UploadFormData } from '@/types/dms'

type UploadSummary = {
  total: number
  success: number
  failed: number
}

const INITIAL_FORM_DATA: Partial<UploadFormData> = {
  academicYear: '',
  academicYearId: '',
  department: '',
  departmentUnitCode: '',
  departmentUnitId: '',
  description: '',
  uploader: '',
  uploaderName: ''
}

const extractFileNameParts = (fileName: string) => {
  const nameParts = fileName.split('.')
  const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : ''
  const displayName = nameParts.join('.')

  return { displayName, extension }
}

const parseUploadError = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message.trim()) return error.message.trim()
  if (typeof error === 'string' && error.trim()) return error.trim()

  if (error && typeof error === 'object') {
    const errorRecord = error as Record<string, unknown>
    const messageCandidates = [errorRecord.message, errorRecord.error, errorRecord.details]

    for (const candidate of messageCandidates) {
      if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
    }

    return JSON.stringify(error)
  }

  return fallbackMessage
}

export const useUploadPage = (errorSelectMetadataText: string, uploadFailedText: string) => {
  const { logActivity } = useActivityLog()

  const [files, setFiles] = useState<FileUploadState[]>([])
  const [formData, setFormData] = useState<Partial<UploadFormData>>(INITIAL_FORM_DATA)
  const [uploading, setUploading] = useState(false)
  const [metadataError, setMetadataError] = useState<string | null>(null)
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null)

  const handleFilesSelected = (newFiles: File[]) => {
    const fileStates: FileUploadState[] = newFiles.map(file => {
      const { displayName, extension } = extractFileNameParts(file.name)

      return {
        file,
        id: uuidv4(),
        progress: 0,
        status: 'pending',
        displayName,
        extension
      }
    })

    setFiles(prev => [...prev, ...fileStates])
  }

  const handleRemoveFile = (fileId: string) => setFiles(prev => prev.filter(file => file.id !== fileId))

  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(file => (file.id === fileId ? { ...file, displayName: newName } : file)))
  }

  const handleFormChange = (data: Partial<UploadFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
    setMetadataError(null)
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    if (!formData.academicYearId || !formData.departmentUnitId || !formData.academicYear || !formData.department) {
      setMetadataError(errorSelectMetadataText)

      return
    }

    setUploading(true)
    setMetadataError(null)
    setUploadSummary(null)

    const filesSnapshot = [...files]

    try {
      let failedCount = 0

      for (const fileState of filesSnapshot) {
        setFiles(prev => prev.map(file => (file.id === fileState.id ? { ...file, status: 'uploading', progress: 0 } : file)))

        try {
          const finalFileName = fileState.displayName + fileState.extension
          const renamedFile = new File([fileState.file], finalFileName, { type: fileState.file.type })

          await uploadDocument(
            renamedFile,
            finalFileName,
            formData.departmentUnitId,
            formData.academicYearId,
            formData.description || undefined,
            undefined,
            formData.departmentUnitCode || undefined,
            progress => setFiles(prev => prev.map(file => (file.id === fileState.id ? { ...file, progress } : file)))
          )

          setFiles(prev => prev.map(file => (file.id === fileState.id ? { ...file, status: 'success', progress: 100 } : file)))

          void logActivity({
            action: 'UPLOAD',
            resource: 'DOCUMENT',
            details: {
              fileName: finalFileName,
              fileSize: fileState.file.size,
              academicYear: formData.academicYear,
              department: formData.departmentUnitCode,
              uploader: formData.uploader
            }
          })
        } catch (error: unknown) {
          failedCount += 1
          const errorMessage = parseUploadError(error, uploadFailedText)

          setFiles(prev => prev.map(file => (file.id === fileState.id ? { ...file, status: 'error', error: errorMessage } : file)))
        }
      }

      const totalCount = filesSnapshot.length
      const successCount = totalCount - failedCount
      setUploadSummary({ total: totalCount, success: successCount, failed: failedCount })

      if (failedCount === 0) {
        setTimeout(() => {
          setFiles([])
          setFormData(INITIAL_FORM_DATA)
        }, 2000)
      } else {
        setFiles(prev => prev.filter(file => file.status === 'error'))
      }
    } finally {
      setUploading(false)
    }
  }

  const clearFailedFiles = () => setFiles(prev => prev.filter(file => file.status !== 'error'))

  return {
    state: {
      files,
      formData,
      uploading,
      metadataError,
      uploadSummary,
      canUpload: files.length > 0 && !!formData.academicYearId && !!formData.departmentUnitId && !uploading
    },
    actions: {
      setMetadataError,
      setUploadSummary,
      handleFilesSelected,
      handleRemoveFile,
      handleRenameFile,
      handleFormChange,
      handleUpload,
      clearFailedFiles
    }
  }
}
