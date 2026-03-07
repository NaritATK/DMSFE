'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'

// Type Imports
import type { CardStatsWithAreaChartProps } from '@/types/pages/widgetTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Static color mapping for ApexCharts
const COLOR_MAP: Record<string, string> = {
  primary: '#7367F0',
  success: '#28C76F',
  warning: '#FF9F43',
  error: '#EA5455',
  info: '#00CFE8'
}

const CardStatsWithAreaChart = (props: CardStatsWithAreaChartProps) => {
  // Props
  const { stats, title, avatarIcon, chartSeries, avatarSize, chartColor = 'primary', avatarColor, avatarSkin } = props

  // Use static color for ApexCharts (CSS variables don't work)
  const chartColorValue = COLOR_MAP[chartColor] ?? COLOR_MAP.primary
  const backgroundPaper = '#fff'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 2.5,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        bottom: 17
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: chartColorValue
            },
            {
              offset: 100,
              opacity: 0.1,
              color: backgroundPaper
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: chartColorValue
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-2 pb-3'>
        <CustomAvatar variant='rounded' skin={avatarSkin} color={avatarColor} size={avatarSize}>
          <i className={classnames(avatarIcon, 'text-[26px]')} />
        </CustomAvatar>
        <div>
          <Typography variant='h5'>{stats}</Typography>
          <Typography variant='body2'>{title}</Typography>
        </div>
      </CardContent>
      <AppReactApexCharts type='area' height={100} width='100%' options={options} series={chartSeries} />
    </Card>
  )
}

export default CardStatsWithAreaChart
