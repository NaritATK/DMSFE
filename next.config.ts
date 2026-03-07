import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  redirects: async () => {
    return [
      // Canonical root
      {
        source: '/',
        destination: '/chat',
        permanent: true,
        locale: false
      },
      // Keep /manage as canonical dashboard path
      {
        source: '/dashboard',
        destination: '/manage',
        permanent: true,
        locale: false
      },
      // Disable self-registration route (login-only system)
      {
        source: '/register',
        destination: '/login',
        permanent: true,
        locale: false
      },
      // Disable legacy front-pages routes (redirect to chat)
      {
        source: '/front-pages/:path*',
        destination: '/chat',
        permanent: true,
        locale: false
      },
      // Hide locale prefix in URL (both /en/* and /th/* -> /*)
      {
        source: '/:lang(en|th)/:path*',
        destination: '/:path*',
        permanent: true,
        locale: false
      }
    ]
  },
  rewrites: async () => {
    return [
      // Clean dashboard URL
      {
        source: '/manage',
        destination: '/th/dashboard'
      },
      // Internally serve locale pages from default locale without exposing /th in URL
      {
        source: '/:path((?!api|_next|front-pages|images|favicon.ico|icon.png|manage).*)',
        destination: '/th/:path'
      }
    ]
  }
}

export default nextConfig
