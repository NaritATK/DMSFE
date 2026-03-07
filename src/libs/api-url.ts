const DEFAULT_API_ORIGIN = 'http://localhost:3001'

const normalizeApiOrigin = () => {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_ORIGIN
  const withoutTrailingSlash = configured.replace(/\/+$/, '')

  return withoutTrailingSlash.replace(/\/api$/, '')
}

export const getApiOrigin = () => normalizeApiOrigin()

export const getApiBaseUrl = () => `${normalizeApiOrigin()}/api`
