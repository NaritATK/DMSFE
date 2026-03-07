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
import { getDepartmentUnits, getDocuments, type DepartmentUnit } from '@/services/document.service'

// Dynamically import ApexCharts to avoid SSR issues
const AppReactApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

interface DepartmentData {
  department: string
  count: number
}

// Static colors for ApexCharts (CSS variables don't work with ApexCharts)
const COLORS = {
  primary: '#7367F0',
  textSecondary: '#6c757d'
}

const getDepartmentLabel = (unit: DepartmentUnit, locale: string) => {
  if (locale === 'th') return unit.name

  return unit.nameEn || unit.name
}

const DocumentsByDepartment = () => {
  const { t, locale } = useDictionary()
  const theme = useTheme()
  const [data, setData] = useState<DepartmentData[]>([])
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

        const units = await getDepartmentUnits()

        // Fetch counts per unit in parallel (quick FE-side aggregation)
        const counts = await Promise.all(
          (units || []).map(async unit => {
            try {
              const res = await getDocuments({ page: 0, limit: 1, departmentUnitId: unit.departmentUnitId })

              return {
                department: getDepartmentLabel(unit, locale),
                count: res.total || 0
              }
            } catch {
              return {
                department: getDepartmentLabel(unit, locale),
                count: 0
              }
            }
          })
        )

        // Sort desc and take top 10 for readability
        const top = counts
          .filter(item => item.department)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)

        setData(top)
      } catch (error) {
        console.error('Error fetching department chart data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      parentHeightOffset: 0
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        barHeight: '60%'
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: [COLORS.primary],
    xaxis: {
      categories: data.map(item => item.department),
      labels: {
        style: {
          colors: Array(data.length).fill(COLORS.textSecondary),
          fontSize: '13px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: Array(data.length).fill(COLORS.textSecondary),
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
        <CardHeader title={t('dms.dashboard.documentsByDepartment')} />
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
        <CardHeader title={t('dms.dashboard.documentsByDepartment')} />
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
      <CardHeader title={t('dms.dashboard.documentsByDepartment')} />
      <CardContent>
        <AppReactApexCharts
          key={`department-chart-${data.length}`}
          type='bar'
          height={300}
          options={chartOptions}
          series={series}
        />
      </CardContent>
    </Card>
  )
}

export default DocumentsByDepartment
