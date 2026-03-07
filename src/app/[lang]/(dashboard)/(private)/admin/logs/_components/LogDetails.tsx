import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import type { ActivityLog } from '@/services/activity-log.service'
import { flattenDetails } from '../_utils/activity-log.utils'

type Props = {
  details: ActivityLog['details']
  noDetailsText: string
  rawJsonText: string
}

export default function LogDetails({ details, noDetailsText, rawJsonText }: Props) {
  if (!details) {
    return <Typography variant='body2' color='text.secondary'>{noDetailsText}</Typography>
  }

  if (typeof details !== 'object') {
    return <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>{String(details)}</Typography>
  }

  const entries = flattenDetails(details)

  return (
    <Box className='flex flex-col gap-2'>
      {entries.length > 0 && (
        <Box className='flex flex-col gap-1'>
          {entries.map(([key, value]) => (
            <Box key={key} className='flex flex-wrap gap-2'>
              <Typography variant='body2' fontWeight={600} sx={{ minWidth: 140 }}>{key}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box className='mt-2'>
        <Typography variant='caption' color='text.secondary'>{rawJsonText}</Typography>
        <Box component='pre' className='mt-1 p-3 rounded border border-divider' sx={{ fontSize: '0.75rem', overflowX: 'auto' }}>
          {JSON.stringify(details, null, 2)}
        </Box>
      </Box>
    </Box>
  )
}
