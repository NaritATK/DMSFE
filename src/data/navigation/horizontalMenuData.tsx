// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const horizontalMenuData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
): HorizontalMenuDataType[] => {
  void dictionary

  return [
  // STAFF Menu Items
  {
    label: 'Dashboard',
    icon: 'tabler-layout-dashboard',
    href: '/manage'
  },
  {
    label: 'Documents',
    icon: 'tabler-file',
    children: [
      {
        label: 'Upload',
        icon: 'tabler-upload',
        href: '/upload'
      },
      {
        label: 'Edit',
        icon: 'tabler-edit',
        href: '/edit'
      },
      {
        label: 'History',
        icon: 'tabler-history',
        href: '/history'
      }
    ]
  },

  // ADMIN Menu Items
  {
    label: 'Administration',
    icon: 'tabler-settings',
    children: [
      {
        label: 'Users',
        icon: 'tabler-users',
        href: '/admin/users'
      },
      {
        label: 'Menus',
        icon: 'tabler-menu-2',
        href: '/admin/menus'
      },
      {
        label: 'Academic Years',
        icon: 'tabler-calendar',
        href: '/admin/academic-years'
      },
      {
        label: 'Logs',
        icon: 'tabler-file-analytics',
        href: '/admin/logs'
      },
      {
        label: 'Webhooks',
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
}

export default horizontalMenuData
