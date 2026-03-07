'use client'

// React Imports
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import type React from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { VerticalNavContextProps } from '@menu/contexts/verticalNavContext'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

type LogoVariant = 'header' | 'menu'

type Props = {
  color?: CSSProperties['color']
  variant?: LogoVariant
}

type LogoTextProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
  isBreakpointReached?: VerticalNavContextProps['isBreakpointReached']
  color?: CSSProperties['color']
}

const LogoText = styled.span<LogoTextProps>`
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
  font-size: 1.375rem;
  line-height: 1.09091;
  font-weight: 700;
  letter-spacing: 0.25px;
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? 'opacity: 0; margin-inline-start: 0;'
      : 'opacity: 1; margin-inline-start: 12px;'}
`

const Logo = ({ color, variant = 'header' }: Props) => {
  const logoTextRef = useRef<HTMLSpanElement>(null)

  const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout, isBreakpointReached])

  const logoSrc = variant === 'menu' ? '/images/branding/does-logo.png' : '/images/branding/up-seal.png'
  const logoAlt = variant === 'menu' ? 'DOES Logo' : 'UP Seal'

  const logoStyle: React.CSSProperties =
    variant === 'menu'
      ? {
          height: 24,
          width: 'auto',
          flexShrink: 0,
          borderRadius: 6,
          objectFit: 'contain'
        }
      : {
          height: 32,
          width: 32,
          flexShrink: 0,
          borderRadius: 999,
          objectFit: 'cover'
        }

  return (
    <div className='flex items-center'>
      <img src={logoSrc} alt={logoAlt} style={logoStyle} />
      <LogoText
        color={color}
        ref={logoTextRef}
        isHovered={isHovered}
        isCollapsed={layout === 'collapsed'}
        transitionDuration={transitionDuration}
        isBreakpointReached={isBreakpointReached}
      >
        {themeConfig.templateName}
      </LogoText>
    </div>
  )
}

export default Logo
