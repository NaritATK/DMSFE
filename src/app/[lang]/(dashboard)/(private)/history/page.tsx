'use client'

import { useState, useEffect, useCallback } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import { useDictionary } from '@/hooks/useDictionary'
import { getDocuments, getDocumentPresignUrl, type Document } from '@/services/document.service'
import DocumentDetailDialog from '@/views/history/DocumentDetailDialog'
import HistoryFilters from '@/views/history/HistoryFilters'
import HistoryTable from '@/views/history/HistoryTable'

import type { HistoryFilters as HistoryFiltersType } from '@/types/dms'

const initialFilters: HistoryFiltersType = {
  search: '',
  academicYear: '',
  department: '',
  dateFrom: null,
  dateTo: null,
  sortBy: 'updatedAt',
  sortOrder: 'desc'
}

export default function HistoryPage() {
  const { t } = useDictionary()
  
  // State
  const [documents, setDocuments] = useState<Document[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<HistoryFiltersType>(initialFilters)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Fetch documents - same pattern as RecentUploads
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await getDocuments({
        page,
        limit: rowsPerPage,
        search: filters.search,
        academicYearId: filters.academicYear,
        departmentUnitId: filters.department,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })
      
      setDocuments(response.documents || [])
      setTotalCount(response.total || 0)
    } catch (err: any) {
      console.error('Error fetching documents:', err)
      // apiClient interceptor will handle 401 redirect automatically
      setError(t('dms.history.loadFailed', 'Cannot load documents. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }, [page, rowsPerPage, filters, t])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Handlers
  const handleFilterChange = (newFilters: Partial<HistoryFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(0)
  }

  const openDetailDialog = (doc: Document) => {
    setSelectedDocument(doc)
    setDetailDialogOpen(true)
  }

  const closeDetailDialog = () => {
    setDetailDialogOpen(false)
    setSelectedDocument(null)
  }

  const handleDownload = async (doc: Document) => {
    const docId = doc.documentId
    if (!docId || docId === 'undefined' || docId === 'null') {
      console.error('Invalid document ID for download:', doc)
      return
    }

    try {
      const data = await getDocumentPresignUrl(docId)
      if (data?.url) {
        window.open(data.url, '_blank')
      }
    } catch {
      // ignore non-critical download errors in UI
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box className='flex items-center justify-between'>
        <Box>
          <Typography variant='h4' className='mb-1'>{t('dms.history.title')}</Typography>
          <Typography variant='body2' color='text.secondary'>{t('dms.history.subtitle')}</Typography>
        </Box>
      </Box>

      <Card>
        <CardHeader title={t('dms.history.filters')} />
        <CardContent>
          <HistoryFilters
            filters={filters}
            onChange={handleFilterChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={t('dms.history.documents')} subheader={`${totalCount} ${t('dms.history.documentsFound')}`} />
        <CardContent>
          {isLoading ? (
            <Box className='flex items-center justify-center p-8'>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity='error' className='m-4'>
              {error}
              <Box className='mt-2'>
                <Button 
                  size='small' 
                  variant='outlined' 
                  startIcon={<Icon icon='tabler-refresh' />}
                  onClick={fetchDocuments}
                >
                  {t('dms.common.retry', 'Retry')}
                </Button>
              </Box>
            </Alert>
          ) : (
            <HistoryTable
              documents={documents}
              totalCount={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              onViewDetails={openDetailDialog}
              onDownload={handleDownload}
            />
          )}
        </CardContent>
      </Card>

      {selectedDocument && (
        <DocumentDetailDialog
          open={detailDialogOpen}
          document={selectedDocument}
          onClose={closeDetailDialog}
          onDownload={() => {}}
        />
      )}
    </Box>
  )
}
