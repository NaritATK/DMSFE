'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'
import { useDictionary } from '@/hooks/useDictionary'
import { useRole } from '@/hooks/useAuth'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import { getLocalizedUrl } from '@/utils/i18n'



const NavbarContent = () => {
  const { isBreakpointReached } = useHorizontalNav()
  const { lang: locale } = useParams()
  const { t } = useDictionary()
  const { role } = useRole()
  const isAdmin = role === 'ADMIN'

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {!isBreakpointReached && (
          <Link href={getLocalizedUrl('/manage', locale as Locale)}>
            <Logo variant='header' />
          </Link>
        )}
      </div>



      <div className='flex items-center'>
        <LanguageDropdown />
        <ModeDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
