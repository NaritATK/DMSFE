'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import DocumentEditDialog from '@/views/edit/DocumentEditDialog'
import DocumentListTable from '@/views/edit/DocumentListTable'
import { useEditDocumentsPage } from './_hooks/useEditDocumentsPage'

export default function EditPage() {
  const { t } = useDictionary()
  const { state, actions } = useEditDocumentsPage({
    deleteConfirmText: t('dms.history.confirmDelete'),
    deleteSheetsSyncFailedTitle: t('dms.edit.alerts.deleteSheetsSyncFailedTitle'),
    deleteFailedTitle: t('dms.edit.alerts.deleteFailedTitle'),
    unknownError: t('dms.edit.alerts.unknownError'),
    updateSheetsSyncFailedTitle: t('dms.edit.alerts.updateSheetsSyncFailedTitle'),
    requeueConversionFailedTitle: t('dms.edit.alerts.requeueConversionFailedTitle')
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box className='flex items-center justify-between'>
        <Box>
          <Typography variant='h4' className='mb-1'>{t('dms.edit.title')}</Typography>
          <Typography variant='body2' color='text.secondary'>{t('dms.edit.subtitle')}</Typography>
        </Box>
      </Box>

      <Card>
        <CardHeader title={t('common.search', 'Search')} />
        <CardContent>
          <TextField
            fullWidth
            placeholder={t('dms.edit.searchPlaceholder')}
            value={state.searchQuery}
            onChange={e => actions.setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && actions.handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon='tabler-search' fontSize={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <Button variant='contained' size='small' onClick={actions.handleSearch}>
                    {t('common.search', 'Search')}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title={t('dms.edit.documentList')}
          subheader={t('dms.edit.editableDocumentsFound').replace('{total}', String(state.documentCountLabel))}
        />
        <CardContent>
          {state.loading ? (
            <Box className='flex items-center justify-center p-8'>
              <CircularProgress />
            </Box>
          ) : (
            <DocumentListTable
              documents={state.documents}
              totalCount={state.total}
              page={state.page}
              rowsPerPage={state.rowsPerPage}
              onPageChange={actions.handlePageChange}
              onRowsPerPageChange={actions.handleRowsPerPageChange}
              onEdit={actions.handleEdit}
              onDelete={actions.handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {state.selectedDocument && (
        <DocumentEditDialog
          open={state.editDialogOpen}
          document={state.selectedDocument}
          onClose={actions.handleEditClose}
          onSave={actions.handleEditSave}
        />
      )}
    </Box>
  )
}
