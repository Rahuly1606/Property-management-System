/**
 * PropertyHub Theme Configuration
 * 
 * This file provides a Material-UI theme configuration that aligns with
 * our design system defined in the CSS variables. This allows components
 * from Material-UI to work seamlessly with our custom components.
 */

import { createTheme } from '@mui/material/styles';
import './styles/theme.css'; // Import our CSS variables

// Define breakpoints for responsive design aligned with our design system
const breakpoints = {
  values: {
    xs: 0,
    sm: 375, // Mobile
    md: 768, // Tablet
    lg: 1440, // Desktop
    xl: 1920,
  },
};

// Create Material-UI theme that matches our design system
const theme = createTheme({
  breakpoints,
  palette: {
    primary: {
      // Deep Blue color palette
      main: '#0F172A', // --color-primary-900
      light: '#1E293B', // --color-primary-800
      dark: '#0A0F1A', // Darker than primary-900
      contrastText: '#FFFFFF',
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    secondary: {
      // Warm Accent color palette
      main: '#FF7A59', // --color-accent-500
      light: '#FF8F6E', // --color-accent-400
      dark: '#E66E50', // --color-accent-600
      contrastText: '#FFFFFF',
      50: '#FFF7F5',
      100: '#FFEEE9',
      200: '#FFD6CA',
      300: '#FFBEAC',
      400: '#FF8F6E',
      500: '#FF7A59',
      600: '#E66E50',
      700: '#BF5C43',
      800: '#994935',
      900: '#7D3B2C',
    },
    success: {
      main: '#10B981', // --color-success
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444', // --color-error
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B', // --color-warning
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6', // --color-info
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: '#F9FAFB', // --color-gray-50
      paper: '#FFFFFF',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontSize: '3rem', // 48px, --text-5xl
      fontWeight: 600, // --font-semibold
      lineHeight: 1.25, // --leading-tight
      '@media (max-width:768px)': {
        fontSize: '2.5rem', // 40px on mobile/tablet
      },
    },
    h2: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontSize: '2.25rem', // 36px, --text-4xl
      fontWeight: 600, // --font-semibold
      lineHeight: 1.25, // --leading-tight
      '@media (max-width:768px)': {
        fontSize: '2rem', // 32px on mobile/tablet
      },
    },
    h3: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontSize: '1.875rem', // 30px, --text-3xl
      fontWeight: 600, // --font-semibold
      lineHeight: 1.375, // --leading-snug
      '@media (max-width:768px)': {
        fontSize: '1.75rem', // 28px on mobile/tablet
      },
    },
    h4: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontSize: '1.5rem', // 24px, --text-2xl
      fontWeight: 600, // --font-semibold
      lineHeight: 1.375, // --leading-snug
      '@media (max-width:768px)': {
        fontSize: '1.375rem', // 22px on mobile/tablet
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      '@media (max-width:768px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      '@media (max-width:576px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 576px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        container: {
          marginLeft: '-16px',
          marginRight: '-16px',
          width: 'calc(100% + 32px)',
          '@media (min-width: 576px)': {
            marginLeft: '-24px',
            marginRight: '-24px',
            width: 'calc(100% + 48px)',
          },
        },
        item: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 576px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
  },
});

export default theme; 