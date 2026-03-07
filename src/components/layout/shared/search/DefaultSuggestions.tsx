// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useDictionary } from '@/hooks/useDictionary'

type DefaultSuggestionsType = {
  sectionLabel: string
  items: {
    label: string
    href: string
    icon?: string
  }[]
}

const DefaultSuggestions = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
  const { lang: locale } = useParams()
  const { t } = useDictionary()

  const defaultSuggestions: DefaultSuggestionsType[] = [
    {
      sectionLabel: t('dms.search.sections.popularSearches'),
      items: [
        { label: t('dms.search.items.analytics'), href: '/dashboards/analytics', icon: 'tabler-trending-up' },
        { label: t('dms.search.items.crm'), href: '/dashboards/crm', icon: 'tabler-chart-pie-2' },
        { label: t('dms.search.items.ecommerce'), href: '/dashboards/ecommerce', icon: 'tabler-shopping-cart' },
        { label: t('dms.search.items.userList'), href: '/apps/user/list', icon: 'tabler-file-description' }
      ]
    },
    {
      sectionLabel: t('dms.search.sections.apps'),
      items: [
        { label: t('dms.search.items.calendar'), href: '/apps/calendar', icon: 'tabler-calendar' },
        { label: t('dms.search.items.invoiceList'), href: '/apps/invoice/list', icon: 'tabler-file-info' },
        { label: t('dms.search.items.userList'), href: '/apps/user/list', icon: 'tabler-file-invoice' },
        { label: t('dms.search.items.rolesPermissions'), href: '/apps/roles', icon: 'tabler-lock' }
      ]
    },
    {
      sectionLabel: t('dms.search.sections.pages'),
      items: [
        { label: t('dms.search.items.userProfile'), href: '/pages/user-profile', icon: 'tabler-user' },
        { label: t('dms.search.items.accountSettings'), href: '/pages/account-settings', icon: 'tabler-settings' },
        { label: t('dms.search.items.pricing'), href: '/pages/pricing', icon: 'tabler-currency-dollar' },
        { label: t('dms.search.items.faq'), href: '/pages/faq', icon: 'tabler-help-circle' }
      ]
    },
    {
      sectionLabel: t('dms.search.sections.formsCharts'),
      items: [
        { label: t('dms.search.items.formLayouts'), href: '/forms/form-layouts', icon: 'tabler-layout' },
        { label: t('dms.search.items.formValidation'), href: '/forms/form-validation', icon: 'tabler-checkup-list' },
        { label: t('dms.search.items.formWizard'), href: '/forms/form-wizard', icon: 'tabler-git-merge' },
        { label: t('dms.search.items.apexCharts'), href: '/charts/apex-charts', icon: 'tabler-chart-ppf' }
      ]
    }
  ]

  return (
    <div className='flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      {defaultSuggestions.map((section, index) => (
        <div key={index} className='flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'>
          <p className='text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]'>{section.sectionLabel}</p>
          <ul className='flex flex-col gap-4'>
            {section.items.map((item, i) => (
              <li key={i} className='flex'>
                <Link
                  href={getLocalizedUrl(item.href, locale as Locale)}
                  className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <i className={classnames(item.icon, 'flex text-xl shrink-0')} />}
                  <p className='text-[15px] leading-[1.4667] truncate'>{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DefaultSuggestions
