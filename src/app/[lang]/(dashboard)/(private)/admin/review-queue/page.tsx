'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import RoleGuard from '@/components/auth/RoleGuard'
import { useDictionary } from '@/hooks/useDictionary'
import AuditDialog from './_components/AuditDialog'
import EligibilityEditorDialog from './_components/EligibilityEditorDialog'
import { useEligibilityReviewQueue } from './_hooks/useEligibilityReviewQueue'
import { getAuditDiffRows, reviewRowLabel, reviewRowRule } from './_utils/review-queue.utils'

export default function EligibilityReviewQueuePage() {
  const { t, locale } = useDictionary()
  const { state, actions } = useEligibilityReviewQueue()

  return (
    <RoleGuard requiredRole='ADMIN'>
      <Card>
        <CardHeader
          avatar={<Icon icon='tabler-list-check' fontSize={24} />}
          title={t('dms.admin.reviewQueue.title')}
          subheader={t('dms.admin.reviewQueue.subheader')}
          action={
            <Button variant='outlined' startIcon={<Icon icon='tabler-refresh' />} onClick={actions.fetchQueue}>
              {t('dms.common.refresh')}
            </Button>
          }
        />
        <CardContent>
          {state.error && (
            <Alert severity='error' sx={{ mb: 2 }} onClose={() => actions.setError(null)}>
              {state.error}
            </Alert>
          )}

          {state.loading ? (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : state.items.length === 0 ? (
            <Alert severity='success'>{t('dms.admin.reviewQueue.empty')}</Alert>
          ) : (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size='small'
                  label={t('dms.admin.reviewQueue.searchLabel')}
                  value={state.search}
                  onChange={e => actions.setSearch(e.target.value)}
                  placeholder={t('dms.admin.reviewQueue.searchPlaceholder')}
                />
              </Stack>

              {state.filteredItems.length === 0 ? (
                <Alert severity='info'>{t('dms.admin.reviewQueue.searchNoMatch')}</Alert>
              ) : (
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('dms.admin.reviewQueue.columns.document')}</TableCell>
                        <TableCell>{t('dms.admin.reviewQueue.columns.eligibilityRows')}</TableCell>
                        <TableCell>{t('dms.admin.reviewQueue.columns.preview')}</TableCell>
                        <TableCell>{t('dms.admin.reviewQueue.columns.chunks')}</TableCell>
                        <TableCell>{t('dms.admin.reviewQueue.columns.reason')}</TableCell>
                        <TableCell>{t('dms.admin.reviewQueue.columns.updated')}</TableCell>
                        <TableCell align='right'>{t('dms.common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.filteredItems.map(item => (
                        <TableRow key={item.conversionId} hover>
                          <TableCell>
                            <Typography variant='body2' fontWeight={600}>{item.document?.title || item.documentId}</Typography>
                            <Typography variant='caption' color='text.secondary'>{item.document?.fileName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip size='small' label={item.eligibilityCount} color={item.eligibilityCount > 0 ? 'info' : 'warning'} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 340 }}>
                              {item.eligibilityPreview?.length
                                ? item.eligibilityPreview.map((row, idx) => (
                                    <Chip key={`${item.conversionId}-${idx}`} size='small' variant='outlined' label={`${row.programCode || '-'} ${row.noMinGpa ? t('dms.admin.reviewQueue.noMin') : row.minGpa ?? 'NA'}`} />
                                  ))
                                : <Typography variant='caption' color='text.secondary'>-</Typography>}
                            </Box>
                          </TableCell>
                          <TableCell><Typography variant='body2'>{item.chunkCount ?? 0} / emb {item.embeddedChunkCount ?? 0}</Typography></TableCell>
                          <TableCell><Typography variant='caption' color='text.secondary'>{item.lastError || '-'}</Typography></TableCell>
                          <TableCell><Typography variant='caption'>{new Date(item.updatedAt).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US')}</Typography></TableCell>
                          <TableCell align='right'>
                            <Stack direction='row' spacing={1} justifyContent='flex-end'>
                              <Button size='small' variant='outlined' onClick={() => actions.openAudit(item.conversionId)}>{t('dms.admin.reviewQueue.actions.audit')}</Button>
                              <Button size='small' variant='outlined' onClick={() => actions.openEditor(item)}>{t('dms.admin.reviewQueue.actions.editRows')}</Button>
                              <Button size='small' variant='outlined' onClick={() => actions.handleRequeue(item.conversionId)} disabled={state.requeueingId === item.conversionId}>
                                {state.requeueingId === item.conversionId ? t('dms.admin.reviewQueue.actions.queueing') : t('dms.admin.reviewQueue.actions.reconvert')}
                              </Button>
                              <Button size='small' variant='contained' color='success' onClick={() => actions.handleResolve(item.conversionId)} disabled={state.resolvingId === item.conversionId}>
                                {state.resolvingId === item.conversionId ? t('dms.admin.reviewQueue.actions.resolving') : t('dms.admin.reviewQueue.actions.markResolved')}
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AuditDialog
        open={state.auditOpen}
        loading={state.auditLoading}
        conversionId={state.auditConversionId}
        items={state.auditItems}
        statusFilter={state.auditStatusFilter}
        onFilterChange={actions.setAuditStatusFilter}
        onClose={actions.closeAudit}
        getDiffRows={getAuditDiffRows}
        rowLabel={reviewRowLabel}
        rowRule={row => reviewRowRule(row, t('dms.admin.reviewQueue.noMinGpaRule'))}
        onExportCsv={actions.exportAuditCsv}
        onExportJson={actions.exportAuditJson}
      />

      <EligibilityEditorDialog
        open={state.editorOpen}
        loading={state.editorLoading}
        saving={state.editorSaving}
        title={state.editorDocumentTitle}
        rows={state.editorRows}
        addedCount={state.editorDiff.addedCount}
        updatedCount={state.editorDiff.updatedCount}
        removedCount={state.editorDiff.removedCount}
        error={state.error}
        onClose={actions.closeEditor}
        onAddRow={actions.addEditorRow}
        onRemoveRow={actions.removeEditorRow}
        onUpdateRow={actions.updateEditorRow}
        onSave={actions.saveEditorRows}
      />
    </RoleGuard>
  )
}
