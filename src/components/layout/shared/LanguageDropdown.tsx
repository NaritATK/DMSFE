'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import { usePathname, useParams } from 'next/navigation'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import { i18n, type Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

type LanguageDataType = {
  langCode: Locale
  langName: string
}

const languageData: LanguageDataType[] = [
  {
    langCode: 'en',
    langName: 'English'
  },
  {
    langCode: 'th',
    langName: 'ไทย (Thai)'
  }
]

const LanguageDropdown = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const pathName = usePathname()
  const { settings } = useSettings()
  const { lang } = useParams()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const getNewPath = (newLocale: Locale) => {
    const segments = pathName.split('/').filter(Boolean)
    const validLocales = i18n.locales as readonly string[]

    if (segments.length > 0 && validLocales.includes(segments[0])) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }

    return `/${segments.join('/')}`
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <i className='tabler-language' />
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  {languageData.map(locale => {
                    const newPath = getNewPath(locale.langCode)

                    return (
                      <MenuItem
                        key={locale.langCode}
                        component='a'
                        href={newPath}
                        selected={lang === locale.langCode}
                        onClick={() => setOpen(false)}
                      >
                        {locale.langName}
                      </MenuItem>
                    )
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default LanguageDropdown
