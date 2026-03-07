'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

import { useDictionary } from '@/hooks/useDictionary'
import { getAcademicYears, getDocuments, type AcademicYear } from '@/services/document.service'

const AppReactApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

interface YearData {
  year: string
  count: number
}

// Static colors for ApexCharts (CSS variables don't work with ApexCharts)
const COLORS = {
  success: '#28C76F',
  textSecondary: '#6c757d',
  background: '#fff'
}

const getYearLabel = (year: AcademicYear) => {
  // year.year is typically numeric string
  if (!year?.year) return ''

  return year.year
}

const DocumentsByYear = () => {
  const { t } = useDictionary()
  const theme = useTheme()
  const [data, setData] = useState<YearData[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Dynamic tooltip theme based on MUI theme mode
  const tooltipTheme = theme.palette.mode === 'dark' ? 'dark' : 'light'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const years = await getAcademicYears()

        const counts = await Promise.all(
          (years || []).map(async y => {
            try {
              const res = await getDocuments({ page: 0, limit: 1, academicYearId: y.academicYearId })

              return {
                year: getYearLabel(y),
                count: res.total || 0
              }
            } catch {
              return {
                year: getYearLabel(y),
                count: 0
              }
            }
          })
        )

        const sorted = counts
          .filter(item => item.year)
          .sort((a, b) => a.year.localeCompare(b.year))
          .slice(-10) // keep last 10 years (newest)

        setData(sorted)
      } catch (error) {
        console.error('Error fetching year chart data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      parentHeightOffset: 0,
      zoom: { enabled: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: [COLORS.success],
    markers: {
      size: 5,
      colors: [COLORS.success],
      strokeColors: [COLORS.background],
      strokeWidth: 2,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: data.map(item => item.year),
      labels: {
        style: {
          colors: Array(data.length).fill(COLORS.textSecondary),
          fontSize: '13px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: [COLORS.textSecondary],
          fontSize: '13px'
        }
      }
    },
    grid: {
      show: false
    },
    tooltip: {
      theme: tooltipTheme,
      y: {
        formatter: (value: number) => `${value} ${t('dms.dashboard.documentsUnit')}`
      }
    }
  }

  const series = [
    {
      name: t('dms.dashboard.documents'),
      data: data.map(item => item.count)
    }
  ]

  if (loading || !mounted) {
    return (
      <Card>
        <CardHeader title={t('dms.dashboard.documentsByAcademicYear')} />
        <CardContent>
          <Box className='flex items-center justify-center' style={{ height: 300 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title={t('dms.dashboard.documentsByAcademicYear')} />
        <CardContent>
          <Box className='flex items-center justify-center' style={{ height: 300 }}>
            {t('dms.history.noDocuments')}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title={t('dms.dashboard.documentsByAcademicYear')} />
      <CardContent>
        <AppReactApexCharts
          key={`year-chart-${data.length}`}
          type='line'
          height={300}
          options={chartOptions}
          series={series}
        />
      </CardContent>
    </Card>
  )
}

export default DocumentsByYear
