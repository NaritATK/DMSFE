'use client'

import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'

import type { HistoryFilters as HistoryFiltersType } from '@/types/dms'

interface HistoryFiltersProps {
  filters: HistoryFiltersType
  onChange: (filters: Partial<HistoryFiltersType>) => void
}

const toInputDate = (date: Date | null) => (!date ? '' : new Date(date).toISOString().split('T')[0])

const fromInputDate = (value: string): Date | null => {
  if (!value) return null

  const parsed = new Date(value)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const HistoryFilters = ({ filters, onChange }: HistoryFiltersProps) => {
  const { t } = useDictionary()

  const departments = [
    t('dms.history.departmentOptions.it'),
    t('dms.history.departmentOptions.hr'),
    t('dms.history.departmentOptions.finance'),
    t('dms.history.departmentOptions.operations'),
    t('dms.history.departmentOptions.marketing'),
    t('dms.history.departmentOptions.sales'),
    t('dms.history.departmentOptions.legal'),
    t('dms.history.departmentOptions.rd')
  ]

  const academicYears = ['2020', '2021', '2022', '2023', '2024', '2025', '2026']

  return (
    <Box className='grid grid-cols-12 gap-6'>
      <Box className='col-span-12 md:col-span-6'>
        <TextField
          fullWidth
          placeholder={t('dms.history.searchPlaceholder')}
          value={filters.search}
          onChange={e => onChange({ search: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon icon='tabler-search' fontSize={20} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Box className='col-span-12 sm:col-span-6 md:col-span-3'>
        <Autocomplete
          options={academicYears}
          value={filters.academicYear || null}
          onChange={(_, value) => onChange({ academicYear: value || '' })}
          renderInput={params => <TextField {...params} label={t('dms.common.academicYear')} />}
        />
      </Box>

      <Box className='col-span-12 sm:col-span-6 md:col-span-3'>
        <Autocomplete
          options={departments}
          value={filters.department || null}
          onChange={(_, value) => onChange({ department: value || '' })}
          renderInput={params => <TextField {...params} label={t('dms.common.department')} />}
        />
      </Box>

      <Box className='col-span-12 sm:col-span-6 md:col-span-3'>
        <TextField
          fullWidth
          type='date'
          label={t('dms.history.dateFrom')}
          value={toInputDate(filters.dateFrom)}
          onChange={e => onChange({ dateFrom: fromInputDate(e.target.value) })}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box className='col-span-12 sm:col-span-6 md:col-span-3'>
        <TextField
          fullWidth
          type='date'
          label={t('dms.history.dateTo')}
          value={toInputDate(filters.dateTo)}
          onChange={e => onChange({ dateTo: fromInputDate(e.target.value) })}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box className='col-span-12 sm:col-span-6 md:col-span-3'>
        <TextField
          fullWidth
          select
          label={t('dms.history.sortBy')}
          value={filters.sortBy}
          onChange={e => onChange({ sortBy: e.target.value as HistoryFiltersType['sortBy'] })}
        >
          <MenuItem value='updatedAt'>{t('dms.history.lastModified')}</MenuItem>
          <MenuItem value='createdAt'>{t('dms.history.uploadDate')}</MenuItem>
          <MenuItem value='fileName'>{t('dms.history.fileName')}</MenuItem>
          <MenuItem value='fileSize'>{t('dms.history.fileSize')}</MenuItem>
          <MenuItem value='department'>{t('dms.common.department')}</MenuItem>
        </TextField>
      </Box>

      <Box className='col-span-12 sm:col-span-6 md:col-span-3'>
        <TextField
          fullWidth
          select
          label={t('dms.history.sortOrder')}
          value={filters.sortOrder}
          onChange={e => onChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
        >
          <MenuItem value='desc'>{t('dms.history.descending')}</MenuItem>
          <MenuItem value='asc'>{t('dms.history.ascending')}</MenuItem>
        </TextField>
      </Box>
    </Box>
  )
}

export default HistoryFilters
