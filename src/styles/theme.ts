import React from 'react';

import { PaletteColor, PaletteColorOptions } from '@mui/material';
import { blue, grey, orange } from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const color = {
  disabled: '#585858',
}

const theme = {
  spacing: 8,
  palette: {
    primary: {
      dark: '#0879FF;',
      main: '#0879F9;',
      light: '#0879E4;',
    },
    secondary: {
      main: '#FF8F76',
    },
    tertiary: {
      main: '#EDE8D6',
    },
    success: {
      main: '#84D0E4',
    },
    warning: {
      main: '#FFA113',
    },
    error: {
      main: '#FF4D00',
    },
    info: {
      main: '#8FC39E',
    },
    background: {
      default: '#000',
      paper: '#222',
    },
    text: {
      primary: '#fff',
      secondary: '#5D5A6F',
    },
    divider: color.disabled,
    button: {
      orange: {
        default: orange[600],
        hover: orange[700],
        active: orange[800],
      },
      blue: {
        default: blue[600],
        hover: blue[700],
        active: blue[800],
      },
      light: {
        default: grey[300],
        hover: grey[400],
        active: grey[500],
        text: {
          default: '#1b1b1b',
        },
      },
      dark: {
        default: grey[700],
        hover: grey[800],
        active: grey[900],
        text: {
          default: grey[900],
          contained: grey[100],
        },
      },
      transparent: {
        default: 'transparent',
        hover: 'transparent',
        active: 'transparent',
        text: {
          default: '#6B6B6B',
          active: '#30A9FA',
          contained: grey[100],
        },
      },
    } as { [key in ButtonColors]: ButtonColor },
    input: {
      background: {
        default: '#fff',
        disabled: '#f3f3f3',
      },
      border: {
        default: '#dedde4',
        active: '#30A9FA',
        error: '#ff0000',
        hover: '#30A9c5',
        disabled: 'transparent',
      },
      text: {
        default: '#5D5A6F',
      },
      helperText: {
        default: '#ababab',
        error: '#ff4d00',
      },
    },
    red: {
      main: '#F00',
    },
  },
  breakpoints: {
    values: {
      xss: 0,
      xs: 375,
      sm: 768,
      md: 1024,
      lg: 1440,
      xl: 1600,
    },
  },
  typography: {
    fontFamily: 'Noto Sans TC, Helvetica Neue, Arial, sans-serif',
    fontSize: 16,
    h1: {
      fontSize: 60,
      lineHeight: 1.3,
      fontWeight: 500,
    },
    h2: {
      fontSize: 48,
      lineHeight: 1.3,
      fontWeight: 500,
    },
    h3: {
      fontSize: 40,
      lineHeight: 1.3,
      fontWeight: 500,
    },
    h4: {
      fontSize: 32,
      lineHeight: 1.3,
      fontWeight: 500,
    },
    h5: {
      fontSize: 24,
      lineHeight: 1.3,
      fontWeight: 400,
    },
    h6: {
      fontSize: 20,
      lineHeight: 1.3,
      fontWeight: 400,
    },
    body1: {
      fontSize: 16,
      lineHeight: 1.3,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.3,
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 500,
    },
    caption: {
      fontSize: 12,
      lineHeight: '15px',
      fontWeight: 400,
      letterSpacing: '0.02rem',
    },
    // Custom typography variants
    'h1-bold': {
      fontSize: 60,
      lineHeight: '79px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'h2-bold': {
      fontSize: 48,
      lineHeight: '62px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'h3-bold': {
      fontSize: 40,
      lineHeight: '52px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'h4-bold': {
      fontSize: 32,
      lineHeight: '42px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'h5-bold': {
      fontSize: 24,
      lineHeight: '31px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'h6-bold': {
      fontSize: 20,
      lineHeight: '31px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'body1-bold': {
      fontSize: 16,
      lineHeight: '26px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'body2-bold': {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'subtitle1-bold': {
      fontSize: 14,
      lineHeight: '16px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
    'caption-bold': {
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 700,
      letterSpacing: '0.02rem',
    },
  },
};

/**
 * Extend MUI theme interface
 */
declare module '@mui/material/styles' {
  /**
   * Typography
   */
  interface TypographyVariants {
    'h1-bold': React.CSSProperties;
    'h2-bold': React.CSSProperties;
    'h3-bold': React.CSSProperties;
    'h4-bold': React.CSSProperties;
    'h5-bold': React.CSSProperties;
    'body1-bold': React.CSSProperties;
    'body2-bold': React.CSSProperties;
    'subtitle1-bold': React.CSSProperties;
    'caption-bold': React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    'h1-bold'?: React.CSSProperties;
    'h2-bold'?: React.CSSProperties;
    'h3-bold'?: React.CSSProperties;
    'h4-bold'?: React.CSSProperties;
    'h5-bold': React.CSSProperties;
    'body1-bold': React.CSSProperties;
    'body2-bold': React.CSSProperties;
    'subtitle1-bold': React.CSSProperties;
    'caption-bold': React.CSSProperties;
  }

  /**
   * Palette
   */
  interface Palette {
    red: PaletteColor;
  }

  interface PaletteOptions {
    red: PaletteColorOptions;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'h1-bold': true;
    'h2-bold': true;
    'h3-bold': true;
    'h4-bold': true;
    'h5-bold': true;
    'body1-bold': true;
    'body2-bold': true;
    'subtitle1-bold': true;
    'caption-bold': true;
  }
}

export type ButtonColors = 'orange' | 'blue' | 'light' | 'dark' | 'transparent';

export interface ButtonTextColor extends Omit<ButtonColor, 'text'> {
  contained: string;
}

export interface ButtonColor {
  default: string;
  hover: string;
  active: string;
  text?: ButtonTextColor;
}

export const muiTheme = responsiveFontSizes(createTheme(theme));

export default theme;
