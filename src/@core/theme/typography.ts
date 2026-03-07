// MUI Imports
import type { Theme } from '@mui/material/styles'

type TypographyFonts = {
  headingFontFamily: string
  bodyFontFamily: string
}

const getFallbackStack = (primaryFont: string) =>
  [
    primaryFont,
    'sans-serif',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(',')

const typography = ({ headingFontFamily, bodyFontFamily }: TypographyFonts): Theme['typography'] => {
  const resolvedHeadingFont =
    typeof headingFontFamily === 'undefined' || headingFontFamily === ''
      ? getFallbackStack('"Noto Sans Thai"')
      : headingFontFamily

  const resolvedBodyFont =
    typeof bodyFontFamily === 'undefined' || bodyFontFamily === ''
      ? getFallbackStack('"Noto Sans Thai"')
      : bodyFontFamily

  return {
    fontFamily: resolvedBodyFont,
    fontSize: 14,
    h1: {
      fontFamily: resolvedHeadingFont,
      fontSize: '2.875rem',
      fontWeight: 600,
      lineHeight: 1.47826
    },
    h2: {
      fontFamily: resolvedHeadingFont,
      fontSize: '2.375rem',
      fontWeight: 600,
      lineHeight: 1.47368421
    },
    h3: {
      fontFamily: resolvedHeadingFont,
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    h4: {
      fontFamily: resolvedHeadingFont,
      fontSize: '1.625rem',
      fontWeight: 600,
      lineHeight: 1.55
    },
    h5: {
      fontFamily: resolvedHeadingFont,
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontFamily: resolvedHeadingFont,
      fontSize: '1.0625rem',
      fontWeight: 600,
      lineHeight: 1.45
    },
    subtitle1: {
      fontFamily: resolvedHeadingFont,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    subtitle2: {
      fontFamily: resolvedHeadingFont,
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontFamily: resolvedBodyFont,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontFamily: resolvedBodyFont,
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontFamily: resolvedBodyFont,
      fontSize: '1rem',
      lineHeight: 1.45,
      textTransform: 'none'
    },
    caption: {
      fontFamily: resolvedBodyFont,
      fontSize: '0.875rem',
      lineHeight: 1.45,
      letterSpacing: '0.3px'
    },
    overline: {
      fontFamily: resolvedHeadingFont,
      fontSize: '0.75rem',
      lineHeight: 1.16667,
      letterSpacing: '0.8px'
    }
  } as Theme['typography']
}

export default typography
