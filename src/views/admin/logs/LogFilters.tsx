'use client'

import { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { LogFilters as LogFiltersType } from '@/types/dms'

interface LogFiltersProps { filters: LogFiltersType; onChange: (filters: Partial<LogFiltersType>) => void }

const LogFilters = ({ filters, onChange }: LogFiltersProps) => {
  const { t } = useDictionary()
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([])

  useEffect(() => {
    setUsers([
      { id: 'user-1', name: 'Admin User', email: 'admin@organization.com' },
      { id: 'user-2', name: 'Staff User 1', email: 'staff1@organization.com' },
      { id: 'user-3', name: 'Staff User 2', email: 'staff2@organization.com' },
      { id: 'user-4', name: 'Manager User', email: 'manager@organization.com' }
    ])
  }, [])

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'UPLOAD', 'DOWNLOAD', 'LOGIN', 'LOGOUT']
  const resources = ['USER', 'DOCUMENT', 'MENU', 'WEBHOOK', 'SYSTEM']

  return <Grid container spacing={4}>
    <Grid><TextField fullWidth placeholder={t('dms.admin.logs.filters.searchPlaceholder')} value={filters.search} onChange={e => onChange({ search: e.target.value })} InputProps={{ startAdornment: <InputAdornment position='start'><Icon icon='tabler-search' fontSize={20} /></InputAdornment> }} /></Grid>
    <Grid><Autocomplete options={users} getOptionLabel={option => `${option.name} (${option.email})`} value={users.find(u => u.id === filters.userId) || null} onChange={(_, value) => onChange({ userId: value?.id || '' })} renderInput={params => <TextField {...params} label={t('dms.common.user')} />} /></Grid>
    <Grid><TextField fullWidth select label={t('dms.admin.logs.action')} value={filters.action} onChange={e => onChange({ action: e.target.value })}><MenuItem value=''>{t('dms.admin.logs.filters.allActions')}</MenuItem>{actions.map(action => <MenuItem key={action} value={action}>{action}</MenuItem>)}</TextField></Grid>
    <Grid><TextField fullWidth select label={t('dms.admin.logs.resource')} value={filters.resource} onChange={e => onChange({ resource: e.target.value })}><MenuItem value=''>{t('dms.admin.logs.filters.allResources')}</MenuItem>{resources.map(resource => <MenuItem key={resource} value={resource}>{resource}</MenuItem>)}</TextField></Grid>
    <Grid><TextField fullWidth type='datetime-local' label={t('dms.history.dateFrom')} value={filters.dateFrom || ''} onChange={e => onChange({ dateFrom: e.target.value || null })} InputLabelProps={{ shrink: true }} /></Grid>
    <Grid><TextField fullWidth type='datetime-local' label={t('dms.history.dateTo')} value={filters.dateTo || ''} onChange={e => onChange({ dateTo: e.target.value || null })} InputLabelProps={{ shrink: true }} /></Grid>
    <Grid><TextField fullWidth select label={t('dms.history.sortBy')} value={filters.sortBy} onChange={e => onChange({ sortBy: e.target.value as any })}><MenuItem value='timestamp'>{t('dms.admin.logs.timestamp')}</MenuItem><MenuItem value='userName'>{t('dms.admin.logs.filters.userName')}</MenuItem><MenuItem value='action'>{t('dms.admin.logs.action')}</MenuItem><MenuItem value='resource'>{t('dms.admin.logs.resource')}</MenuItem></TextField></Grid>
    <Grid><TextField fullWidth select label={t('dms.history.sortOrder')} value={filters.sortOrder} onChange={e => onChange({ sortOrder: e.target.value as 'asc' | 'desc' })}><MenuItem value='desc'>{t('dms.admin.logs.filters.newestFirst')}</MenuItem><MenuItem value='asc'>{t('dms.admin.logs.filters.oldestFirst')}</MenuItem></TextField></Grid>
  </Grid>
}

export default LogFilters
