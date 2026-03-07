'use client'

import { useEffect, useRef, useState } from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'

import { getDepartmentUnits, getAcademicYears } from '@/services/document.service'
import { useDictionary } from '@/hooks/useDictionary'

import type { UploadFormData } from '@/types/dms'
import type { DepartmentUnit, AcademicYear } from '@/services/document.service'

interface DocumentMetadataFormProps {
  formData: Partial<UploadFormData>
  onChange: (data: Partial<UploadFormData>) => void
  disabled?: boolean
}

const DocumentMetadataForm = ({ formData, onChange, disabled = false }: DocumentMetadataFormProps) => {
  const { data: session, status } = useSession()
  const { t } = useDictionary()
  const mountedRef = useRef(false)

  const [departmentUnits, setDepartmentUnits] = useState<DepartmentUnit[]>([])
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)

  // Mark as mounted on mount
  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  // Set uploader info once session is ready
  useEffect(() => {
    if (!mountedRef.current) return

    const user = session?.user

    if (!user || formData.uploader) return

    onChange({
      uploader: user.email || '',
      uploaderName: user.name || '',
    })
  }, [session?.user, formData.uploader, onChange])

  // Fetch initial options
  useEffect(() => {
    if (!mountedRef.current) return
    if (status === 'loading') return

    const fetchOptions = async () => {
      try {
        const [units, years] = await Promise.all([getDepartmentUnits(), getAcademicYears()])

        if (!mountedRef.current) return

        setDepartmentUnits(units)
        setAcademicYears(years)
      } catch (error) {
        console.error('Failed to fetch metadata options:', error)
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    if (status === 'authenticated') {
      fetchOptions()
    } else {
      setLoading(false)
    }
  }, [status])

  // Memoized value getters to avoid inline logic in JSX
  const selectedAcademicYear = academicYears.find(y => y.academicYearId === formData.academicYearId) || null
  const selectedDepartmentUnit = departmentUnits.find(d => d.departmentUnitId === formData.departmentUnitId) || null

  return (
    <Box className="flex flex-col gap-4">
      {/* Uploader Info */}
      <Box>
        <Typography variant="body2" fontWeight={600} className="mb-2">
          {t('dms.upload.uploader')}
        </Typography>
        <Box
          className="flex items-center p-3 rounded"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'action.hover',
            minHeight: 48,
          }}
        >
          <Typography variant="body1">
            {session?.user?.name
              ? `${session.user.name} (${session.user.email})`
              : session?.user?.email || t('dms.common.loading')}
          </Typography>
        </Box>
      </Box>

      {/* Academic Year */}
      <Box>
        <Typography variant="body2" fontWeight={600} className="mb-2">
          {t('dms.common.academicYear')} <span className="text-error-main">*</span>
        </Typography>
        <Autocomplete
          options={academicYears}
          getOptionLabel={option => option.year}
          value={selectedAcademicYear}
          onChange={(_, value) =>
            onChange({
              academicYear: value?.year || '',
              academicYearId: value?.academicYearId || '',
            })
          }
          loading={loading}
          disabled={disabled}
          renderInput={params => (
            <TextField
              {...params}
              placeholder={t('dms.upload.selectAcademicYear')}
              required
              error={!formData.academicYear}
            />
          )}
        />
      </Box>

      {/* Department */}
      <Box>
        <Typography variant="body2" fontWeight={600} className="mb-2">
          {t('dms.common.department')} <span className="text-error-main">*</span>
        </Typography>
        <Autocomplete
          options={departmentUnits}
          getOptionLabel={option => `${option.name} (${option.nameEn || option.code})`}
          value={selectedDepartmentUnit}
          onChange={(_, value) =>
            onChange({
              department: value?.name || '',
              departmentUnitCode: value?.code || '',
              departmentUnitId: value?.departmentUnitId || '',
            })
          }
          loading={loading}
          disabled={disabled}
          renderInput={params => (
            <TextField
              {...params}
              placeholder={t('dms.upload.selectDepartment')}
              required
              error={!formData.department}
            />
          )}
        />
      </Box>

      {/* Description */}
      <Box>
        <Typography variant="body2" fontWeight={600} className="mb-2">
          {t('dms.common.description')}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder={t('dms.upload.descriptionPlaceholder')}
          value={formData.description || ''}
          onChange={e => onChange({ description: e.target.value })}
          disabled={disabled}
        />
      </Box>

      {/* Info Box */}
      <Box className="p-3 rounded bg-info-lightOpacity">
        <Typography variant="caption" color="info.main">
          ℹ️ {t('dms.upload.sameMetadataInfo')}
        </Typography>
      </Box>
    </Box>
  )
}

export default DocumentMetadataForm
