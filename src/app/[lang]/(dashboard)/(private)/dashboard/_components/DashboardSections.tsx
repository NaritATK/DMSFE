'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useDictionary } from '@/hooks/useDictionary'
import ActivityTimeline from '@/views/dashboard/ActivityTimeline'
import DashboardStats from '@/views/dashboard/DashboardStats'
import DocumentsByDepartment from '@/views/dashboard/DocumentsByDepartment'
import DocumentsByYear from '@/views/dashboard/DocumentsByYear'
import RecentUploads from '@/views/dashboard/RecentUploads'
import StorageUsage from '@/views/dashboard/StorageUsage'

export default function DashboardSections() {
  const { t } = useDictionary()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box>
        <Typography variant='h5' fontWeight={700}>{t('dms.navigation.dashboard', 'Dashboard')}</Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('dms.dashboard.subtitle', 'Overview and quick actions')}
        </Typography>
      </Box>

      <DashboardStats />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
        <DocumentsByDepartment />
        <DocumentsByYear />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 6 }}>
        <StorageUsage />
        <RecentUploads />
      </Box>

      <ActivityTimeline />
    </Box>
  )
}
