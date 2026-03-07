'use client'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import type { ActivityLogExtended } from '@/types/dms'

interface LogTableProps { logs: ActivityLogExtended[]; totalCount: number; page: number; rowsPerPage: number; onPageChange: (page: number) => void; onRowsPerPageChange: (rowsPerPage: number) => void; onViewDetails: (log: ActivityLogExtended) => void }

const LogTable = ({ logs, totalCount, page, rowsPerPage, onPageChange, onRowsPerPageChange, onViewDetails }: LogTableProps) => {
  const { t, locale } = useDictionary()
  const formatTimestamp = (date: Date) => new Date(date).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const getActionColor = (action: string) => ({ CREATE: 'success', UPDATE: 'warning', DELETE: 'error', UPLOAD: 'info', DOWNLOAD: 'primary', LOGIN: 'success', LOGOUT: 'default' }[action] || 'default') as any
  const getActionIcon = (action: string) => ({ CREATE: 'tabler-plus', UPDATE: 'tabler-edit', DELETE: 'tabler-trash', UPLOAD: 'tabler-upload', DOWNLOAD: 'tabler-download', LOGIN: 'tabler-login', LOGOUT: 'tabler-logout' }[action] || 'tabler-point')
  const getResourceColor = (resource: string) => ({ USER: 'primary', DOCUMENT: 'info', MENU: 'warning', WEBHOOK: 'success', SYSTEM: 'error' }[resource] || 'default') as any

  if (logs.length === 0) return <Box className='flex flex-col items-center justify-center p-8'><Icon icon='tabler-file-off' fontSize={64} className='text-text-secondary mb-4' /><Typography variant='h6' color='text.secondary'>{t('dms.admin.logs.table.emptyTitle')}</Typography><Typography variant='body2' color='text.secondary'>{t('dms.admin.logs.table.emptySubtitle')}</Typography></Box>

  return <>
    <TableContainer><Table><TableHead><TableRow><TableCell>{t('dms.admin.logs.timestamp')}</TableCell><TableCell>{t('dms.common.user')}</TableCell><TableCell>{t('dms.admin.logs.action')}</TableCell><TableCell>{t('dms.admin.logs.resource')}</TableCell><TableCell>{t('dms.admin.logs.ipAddress')}</TableCell><TableCell align='right'>{t('dms.common.actions')}</TableCell></TableRow></TableHead><TableBody>
      {logs.map(log => <TableRow key={log.id} hover><TableCell><Typography variant='body2' fontWeight={600}>{formatTimestamp(log.timestamp || log.createdAt)}</Typography></TableCell><TableCell><Box><Typography variant='body2' fontWeight={600}>{log.userName}</Typography><Typography variant='caption' color='text.secondary'>{log.userEmail}</Typography></Box></TableCell><TableCell><Chip label={log.action} size='small' color={getActionColor(log.action)} icon={<Icon icon={getActionIcon(log.action)} />} /></TableCell><TableCell><Chip label={log.resource} size='small' variant='tonal' color={getResourceColor(log.resource)} /></TableCell><TableCell><Typography variant='body2' color='text.secondary'>{log.ipAddress}</Typography></TableCell><TableCell align='right'><Tooltip title={t('dms.common.viewDetails')}><IconButton size='small' onClick={() => onViewDetails(log)}><Icon icon='tabler-eye' fontSize={20} /></IconButton></Tooltip></TableCell></TableRow>)}
    </TableBody></Table></TableContainer>
    <TablePagination component='div' count={totalCount} page={page} onPageChange={(_, newPage) => onPageChange(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))} rowsPerPageOptions={[10, 25, 50, 100]} />
  </>
}

export default LogTable
