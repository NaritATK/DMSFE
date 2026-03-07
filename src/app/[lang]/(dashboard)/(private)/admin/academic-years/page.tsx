'use client'

import { useEffect, useMemo, useState } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { Icon } from '@iconify/react'

import RoleGuard from '@/components/auth/RoleGuard'
import { useDictionary } from '@/hooks/useDictionary'
import {
  academicYearService,
  type AcademicYear,
  type CreateAcademicYearDto,
  type UpdateAcademicYearDto,
} from '@/services/academic-year.service'

const toDateInput = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const initialForm: CreateAcademicYearDto = {
  year: '',
  description: '',
  startDate: '',
  endDate: '',
  isActive: true,
}

export default function AcademicYearsPage() {
  const { t } = useDictionary()

  const [rows, setRows] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AcademicYear | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<CreateAcademicYearDto>(initialForm)

  const fetchAcademicYears = async () => {
    setLoading(true)
    setError(null)

    try {
      setRows(await academicYearService.getAll())
    } catch (err: any) {
      console.error('Error fetching academic years:', err)
      setError(err.response?.data?.error || err.message || t('dms.admin.academicYears.errors.fetch'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAcademicYears()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setFormData(initialForm)
    setEditing(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (row: AcademicYear) => {
    setEditing(row)
    setFormData({
      year: row.year,
      description: row.description || '',
      startDate: toDateInput(row.startDate),
      endDate: toDateInput(row.endDate),
      isActive: row.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.year || !formData.description) {
      setError(t('dms.admin.academicYears.errors.required'))
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (editing) {
        const payload: UpdateAcademicYearDto = {
          description: formData.description,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          isActive: formData.isActive,
        }
        await academicYearService.update(editing.academicYearId, payload)
      } else {
        await academicYearService.create({
          year: formData.year.trim(),
          description: formData.description.trim(),
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          isActive: formData.isActive,
        })
      }

      setDialogOpen(false)
      resetForm()
      await fetchAcademicYears()
    } catch (err: any) {
      console.error('Save academic year error:', err)
      setError(err.response?.data?.error || err.message || t('dms.admin.academicYears.errors.save'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row: AcademicYear) => {
    if (row.isLocked) {
      setError(t('dms.admin.academicYears.errors.lockedDelete'))
      return
    }

    if (!confirm(`${t('dms.admin.academicYears.confirmDelete')} ${row.year}?`)) return

    setError(null)
    try {
      await academicYearService.remove(row.academicYearId)
      await fetchAcademicYears()
    } catch (err: any) {
      console.error('Delete academic year error:', err)
      setError(err.response?.data?.error || err.message || t('dms.admin.academicYears.errors.delete'))
    }
  }

  const handleToggleActive = async (row: AcademicYear) => {
    if (row.isLocked) {
      setError(t('dms.admin.academicYears.errors.lockedToggle'))
      return
    }

    setError(null)
    try {
      await academicYearService.toggleActive(row.academicYearId)
      await fetchAcademicYears()
    } catch (err: any) {
      console.error('Toggle academic year error:', err)
      setError(err.response?.data?.error || err.message || t('dms.admin.academicYears.errors.toggle'))
    }
  }

  const dialogTitle = useMemo(
    () => (editing ? t('dms.admin.academicYears.edit') : t('dms.admin.academicYears.create')),
    [editing, t]
  )

  return (
    <RoleGuard requiredRole='ADMIN'>
      <Card>
        <CardHeader
          title={t('dms.admin.academicYears.title')}
          action={
            <Button variant='contained' startIcon={<Icon icon='tabler-plus' />} onClick={openCreateDialog}>
              {t('dms.admin.academicYears.add')}
            </Button>
          }
        />

        <CardContent>
          {error && <Alert severity='error' sx={{ mb: 4 }}>{error}</Alert>}

          {loading ? (
            <Box className='flex items-center justify-center py-10'>
              <CircularProgress />
            </Box>
          ) : (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>{t('dms.admin.academicYears.year')}</TableCell>
                  <TableCell>{t('dms.common.description')}</TableCell>
                  <TableCell>{t('dms.admin.academicYears.start')}</TableCell>
                  <TableCell>{t('dms.admin.academicYears.end')}</TableCell>
                  <TableCell>{t('dms.common.status')}</TableCell>
                  <TableCell>{t('dms.admin.academicYears.lock')}</TableCell>
                  <TableCell align='right'>{t('dms.common.actions')}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.academicYearId} hover>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.description || '-'}</TableCell>
                    <TableCell>{row.startDate ? new Date(row.startDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.isActive ? t('dms.admin.common.active') : t('dms.admin.common.inactive')}
                        size='small'
                        color={row.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.isLocked ? t('dms.admin.academicYears.locked') : t('dms.admin.academicYears.unlocked')}
                        size='small'
                        color={row.isLocked ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Tooltip title={row.isLocked ? t('dms.admin.academicYears.locked') : t('dms.common.edit')}>
                        <span>
                          <IconButton size='small' onClick={() => openEditDialog(row)} disabled={row.isLocked}>
                            <Icon icon='tabler-edit' />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip
                        title={
                          row.isLocked
                            ? t('dms.admin.academicYears.locked')
                            : row.isActive
                              ? t('dms.admin.academicYears.deactivate')
                              : t('dms.admin.academicYears.activate')
                        }
                      >
                        <span>
                          <IconButton size='small' onClick={() => handleToggleActive(row)} disabled={row.isLocked}>
                            <Icon icon={row.isActive ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={row.isLocked ? t('dms.admin.academicYears.locked') : t('dms.common.delete')}>
                        <span>
                          <IconButton size='small' color='error' onClick={() => handleDelete(row)} disabled={row.isLocked}>
                            <Icon icon='tabler-trash' />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align='center'>
                      {t('dms.admin.academicYears.empty')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('dms.admin.academicYears.year')}
              value={formData.year}
              onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
              disabled={!!editing}
              required
            />
            <TextField
              label={t('dms.common.description')}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <TextField
              label={t('dms.admin.academicYears.startDate')}
              type='date'
              value={formData.startDate || ''}
              onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label={t('dms.admin.academicYears.endDate')}
              type='date'
              value={formData.endDate || ''}
              onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={<Switch checked={!!formData.isActive} onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />}
              label={t('dms.admin.common.active')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>{t('dms.common.cancel')}</Button>
          <Button variant='contained' onClick={handleSave} disabled={saving}>
            {saving ? t('dms.admin.common.saving') : t('dms.common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </RoleGuard>
  )
}
