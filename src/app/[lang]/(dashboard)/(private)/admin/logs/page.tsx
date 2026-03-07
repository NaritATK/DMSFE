'use client'

import { Fragment, useEffect } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import RoleGuard from '@/components/auth/RoleGuard'
import { useDictionary } from '@/hooks/useDictionary'
import LogDetails from './_components/LogDetails'
import { useActivityLogs } from './_hooks/useActivityLogs'
import { formatShortId, getActionColor } from './_utils/activity-log.utils'

export default function ActivityLogsPage() {
  const { t, locale } = useDictionary()
  const { state, actions } = useActivityLogs()

  useEffect(() => {
    actions.fetchLogs(t('dms.admin.logs.errors.fetch'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.page, state.rowsPerPage, state.filters])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <RoleGuard requiredRole='ADMIN'>
      <Card>
        <CardHeader
          title={t('dms.admin.logs.title')}
          subheader={t('dms.admin.logs.subheader')}
          avatar={<Icon icon='tabler-file-text' fontSize={24} />}
        />

        <CardContent>
          {state.error && (
            <Alert severity='error' sx={{ mb: 2 }} onClose={() => actions.setError(null)}>
              {state.error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t('dms.admin.logs.action')}</InputLabel>
              <Select
                value={state.filters.action || ''}
                onChange={e => {
                  actions.setFilters(prev => ({ ...prev, action: (e.target.value as string) || undefined }))
                  actions.setPage(0)
                }}
                label={t('dms.admin.logs.action')}
              >
                <MenuItem value=''>{t('dms.common.all')}</MenuItem>
                <MenuItem value='CREATE'>CREATE</MenuItem>
                <MenuItem value='UPDATE'>UPDATE</MenuItem>
                <MenuItem value='DELETE'>DELETE</MenuItem>
                <MenuItem value='VIEW'>VIEW</MenuItem>
                <MenuItem value='LOGIN'>LOGIN</MenuItem>
                <MenuItem value='LOGOUT'>LOGOUT</MenuItem>
                <MenuItem value='UPLOAD'>UPLOAD</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t('dms.admin.logs.resource')}</InputLabel>
              <Select
                value={state.filters.resource || ''}
                onChange={e => {
                  actions.setFilters(prev => ({ ...prev, resource: (e.target.value as string) || undefined }))
                  actions.setPage(0)
                }}
                label={t('dms.admin.logs.resource')}
              >
                <MenuItem value=''>{t('dms.common.all')}</MenuItem>
                <MenuItem value='DOCUMENT'>DOCUMENT</MenuItem>
                <MenuItem value='USER'>USER</MenuItem>
                <MenuItem value='MENU'>MENU</MenuItem>
                <MenuItem value='WEBHOOK'>WEBHOOK</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={t('dms.admin.logs.userId')}
              value={state.filters.userId || ''}
              onChange={e => {
                actions.setFilters(prev => ({ ...prev, userId: e.target.value || undefined }))
                actions.setPage(0)
              }}
              sx={{ minWidth: 250 }}
              placeholder={t('dms.admin.logs.userIdPlaceholder')}
            />
          </Box>

          {state.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : state.logs.length === 0 ? (
            <Alert severity='info'>{t('dms.admin.logs.empty')}</Alert>
          ) : (
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('dms.admin.logs.timestamp')}</TableCell>
                    <TableCell>{t('dms.common.user')}</TableCell>
                    <TableCell>{t('dms.admin.logs.userId')}</TableCell>
                    <TableCell>{t('dms.admin.logs.action')}</TableCell>
                    <TableCell>{t('dms.admin.logs.resource')}</TableCell>
                    <TableCell>{t('dms.admin.logs.resourceId')}</TableCell>
                    <TableCell>{t('dms.admin.logs.ipAddress')}</TableCell>
                    <TableCell align='right'>{t('dms.admin.logs.details')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.logs.map(log => (
                    <Fragment key={log.logId}>
                      <TableRow hover>
                        <TableCell>{formatDate(log.createdAt)}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant='body2' fontWeight={600}>{log.userDisplayName || '-'}</Typography>
                            <Typography variant='caption' color='text.secondary'>{log.userEmail || '-'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>{formatShortId(log.userId)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={log.action} size='small' color={getActionColor(log.action)} />
                        </TableCell>
                        <TableCell>
                          <Chip label={log.resource} size='small' variant='outlined' />
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {formatShortId(log.resourceId)}
                          </Typography>
                        </TableCell>
                        <TableCell>{log.ipAddress || '-'}</TableCell>
                        <TableCell align='right'>
                          <Tooltip title={state.expandedLogId === log.logId ? t('dms.admin.logs.hideDetails') : t('dms.admin.logs.showDetails')}>
                            <IconButton
                              size='small'
                              onClick={() => actions.setExpandedLogId(state.expandedLogId === log.logId ? null : log.logId)}
                            >
                              <Icon icon={state.expandedLogId === log.logId ? 'tabler-chevron-up' : 'tabler-chevron-down'} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8} sx={{ p: 0 }}>
                          <Collapse in={state.expandedLogId === log.logId} timeout='auto' unmountOnExit>
                            <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                              <Typography variant='subtitle2' className='mb-2'>
                                {t('dms.admin.logs.details')}
                              </Typography>
                              <LogDetails
                                details={log.details}
                                noDetailsText={t('dms.admin.logs.noDetails')}
                                rawJsonText={t('dms.admin.logs.rawJson')}
                              />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!state.loading && state.logs.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component='div'
              count={state.totalLogs}
              rowsPerPage={state.rowsPerPage}
              page={state.page}
              onPageChange={(_, newPage) => actions.setPage(newPage)}
              onRowsPerPageChange={e => {
                actions.setRowsPerPage(Number.parseInt(e.target.value, 10))
                actions.setPage(0)
              }}
            />
          )}
        </CardContent>
      </Card>
    </RoleGuard>
  )
}
