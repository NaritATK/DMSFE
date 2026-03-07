'use client'

import dynamic from 'next/dynamic'
import type { getDictionary } from '@/utils/getDictionary'
import type { Mode } from '@core/types'

const Navigation = dynamic(() => import('./Navigation'), { ssr: false })

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  mode: Mode
}

const NavigationDynamic = (props: Props) => {
  return <Navigation {...props} />
}

export default NavigationDynamic
