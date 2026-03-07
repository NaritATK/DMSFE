// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>, userRole?: string): VerticalMenuDataType[] => {
  const navDict = dictionary?.navigation as any

  const allMenus: VerticalMenuDataType[] = [
    // STAFF Menu Items (visible to all)
    {
      label: navDict?.dashboard || 'Dashboard',
      icon: 'tabler-layout-dashboard',
      href: '/manage'
    },
    {
      label: navDict?.upload || 'Upload Document',
      icon: 'tabler-upload',
      href: '/upload'
    },
    {
      label: navDict?.edit || 'Edit Document',
      icon: 'tabler-edit',
      href: '/edit'
    },
    {
      label: navDict?.history || 'History',
      icon: 'tabler-history',
      href: '/history'
    },

    // ADMIN Section (ADMIN only)
    {
      label: navDict?.administration || 'Administration',
      isSection: true,
      requiredRole: 'ADMIN',
      children: [
        {
          label: navDict?.users || 'User Management',
          icon: 'tabler-users',
          href: '/admin/users'
        },
        {
          label: navDict?.menus || 'Menu Management',
          icon: 'tabler-menu-2',
          href: '/admin/menus'
        },
        {
          label: navDict?.academicYears || 'Academic Years',
          icon: 'tabler-calendar',
          href: '/admin/academic-years'
        },
        {
          label: navDict?.logs || 'Activity Logs',
          icon: 'tabler-file-analytics',
          href: '/admin/logs'
        },
        {
          label: navDict?.webhooks || 'Webhook Config',
          icon: 'tabler-webhook',
          href: '/admin/webhooks'
        },
        {
          label: 'Review Queue',
          icon: 'tabler-list-check',
          href: '/admin/review-queue'
        }
      ]
    }
  ]

  // Filter menus based on user role
  return allMenus.filter(item => {
    // If no requiredRole, show to everyone
    if (!item.requiredRole) return true

    // If requiredRole is ADMIN, only show to ADMIN users
    if (item.requiredRole === 'ADMIN') {
      return userRole === 'ADMIN'
    }

    return true
  })
}

export default verticalMenuData
