import type { Metadata } from 'next'

import type { SystemMode } from '@core/types'

import { getServerMode } from '@core/utils/serverHelpers'

type GuestAuthPageConfig = {
  title: string
  description: string
}

type GuestAuthComponent = (props: { mode: SystemMode }) => React.ReactElement

export const buildGuestAuthMetadata = (config: GuestAuthPageConfig): Metadata => ({
  title: config.title,
  description: config.description,
})

export const renderGuestAuthPage = async (Component: GuestAuthComponent) => {
  const mode = await getServerMode()

  return <Component mode={mode} />
}
