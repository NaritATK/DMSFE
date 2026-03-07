'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useDictionary } from '@/hooks/useDictionary'
import type { AuditDiffRow, AuditDiffStatus, AuditItem } from '@/types/admin/review-queue'

type Props = {
  open: boolean
  loading: boolean
  conversionId: string | null
  items: AuditItem[]
  statusFilter: AuditDiffStatus
  onFilterChange: (next: AuditDiffStatus) => void
  onClose: () => void
  getDiffRows: (item: AuditItem) => AuditDiffRow[]
  rowLabel: (row: AuditDiffRow['before'] | AuditDiffRow['after']) => string
  rowRule: (row: AuditDiffRow['before'] | AuditDiffRow['after']) => string | number
  onExportCsv: () => void
  onExportJson: () => void
}

export default function AuditDialog({
  open,
  loading,
  conversionId,
  items,
  statusFilter,
  onFilterChange,
  onClose,
  getDiffRows,
  rowLabel,
  rowRule,
  onExportCsv,
  onExportJson,
}: Props) {
  const { t, locale } = useDictionary()
  const dialogTitle = t('dms.admin.reviewQueue.audit.title').replace('{conversionId}', conversionId || '-')

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Alert severity='info' sx={{ mt: 1 }}>{t('dms.admin.reviewQueue.audit.empty')}</Alert>
        ) : (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mt: 1, mb: 1.5 }}>
              <TextField
                select
                size='small'
                label={t('dms.admin.reviewQueue.audit.filterStatus')}
                value={statusFilter}
                onChange={e => onFilterChange(e.target.value as AuditDiffStatus)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value='ALL'>ALL</MenuItem>
                <MenuItem value='ADDED'>ADDED</MenuItem>
                <MenuItem value='UPDATED'>UPDATED</MenuItem>
                <MenuItem value='REMOVED'>REMOVED</MenuItem>
                <MenuItem value='UNCHANGED'>UNCHANGED</MenuItem>
              </TextField>
              <Button variant='outlined' onClick={onExportCsv}>{t('dms.admin.reviewQueue.audit.exportCsv')}</Button>
              <Button variant='outlined' onClick={onExportJson}>{t('dms.admin.reviewQueue.audit.exportJson')}</Button>
            </Stack>

            <Stack spacing={1.5}>
              {items.map(item => {
                const diffRows = getDiffRows(item)
                  .filter(row => (statusFilter === 'ALL' ? true : row.status === statusFilter))
                  .slice(0, 30)

                return (
                  <Box key={item.logId} sx={{ border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 1.5 }}>
                    <Stack direction='row' justifyContent='space-between'>
                      <Typography variant='body2' fontWeight={600}>{item.userId}</Typography>
                      <Typography variant='caption' color='text.secondary'>{new Date(item.createdAt).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US')}</Typography>
                    </Stack>
                    <Typography variant='caption' color='text.secondary'>{t('dms.admin.reviewQueue.audit.action')}: {item.action}</Typography>
                    <Stack direction='row' spacing={1} sx={{ mt: 1, mb: 1 }}>
                      <Chip
                        size='small'
                        variant='outlined'
                        color='error'
                        label={t('dms.admin.reviewQueue.audit.beforeCount').replace('{count}', String(item.details?.beforeCount ?? 0))}
                      />
                      <Chip
                        size='small'
                        variant='outlined'
                        color='success'
                        label={t('dms.admin.reviewQueue.audit.afterCount').replace('{count}', String(item.details?.afterCount ?? 0))}
                      />
                    </Stack>

                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('dms.admin.reviewQueue.audit.columns.program')}</TableCell>
                          <TableCell>{t('dms.admin.reviewQueue.audit.columns.before')}</TableCell>
                          <TableCell>{t('dms.admin.reviewQueue.audit.columns.after')}</TableCell>
                          <TableCell>{t('dms.common.status')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {diffRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography variant='caption' color='text.secondary'>{t('dms.admin.reviewQueue.audit.noDiffSample')}</Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          diffRows.map(row => (
                            <TableRow key={`${item.logId}-${row.key}`}>
                              <TableCell><Typography variant='caption'>{rowLabel(row.after || row.before)}</Typography></TableCell>
                              <TableCell><Typography variant='caption'>{rowRule(row.before)}</Typography></TableCell>
                              <TableCell><Typography variant='caption'>{rowRule(row.after)}</Typography></TableCell>
                              <TableCell>
                                <Chip
                                  size='small'
                                  label={row.status}
                                  color={row.status === 'ADDED' ? 'success' : row.status === 'REMOVED' ? 'error' : row.status === 'UPDATED' ? 'warning' : 'default'}
                                  variant='outlined'
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                )
              })}
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('dms.common.close')}</Button>
      </DialogActions>
    </Dialog>
  )
}
