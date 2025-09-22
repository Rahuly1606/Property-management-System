/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // Design brief specifies these three breakpoints
      sm: '375px',    // Mobile
      md: '768px',    // Tablet
      lg: '1440px',   // Desktop
    },
    colors: {
      // Primary palette - deep blue for trust
      primary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a', // Deep blue for trust specified in the brief
      },
      // Warm accent for CTAs as specified in the brief
      accent: {
        50: '#fff7f5',
        100: '#ffeee9',
        200: '#ffd6ca',
        300: '#ffbeac',
        400: '#ff8f6e',
        500: '#ff7a59', // Warm accent for CTAs specified in the brief
        600: '#e66e50',
        700: '#bf5c43',
        800: '#994935',
        900: '#7d3b2c',
      },
      // Neutral greys for text as specified in the brief
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      // Supporting colors
      success: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
    },
    fontFamily: {
      // Inter font for body text as specified in the brief
      sans: ['Inter', 'system-ui', 'sans-serif'],
      // Poppins for headlines as specified in the brief
      heading: ['Poppins', 'sans-serif'],
    },
    fontSize: {
      // Type scale specified in the brief: 48, 32, 24, 18, 16, 14
      xs: '14px',
      sm: '14px',
      base: '16px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '48px',
    },
    extend: {
      spacing: {
        // Consistent spacing scale
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        // Card radius specified in the brief (12px)
        'none': '0',
        'sm': '4px',
        'md': '8px',
        DEFAULT: '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        // Shadow levels for different elevations
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 6px 12px -2px rgba(0, 0, 0, 0.1), 0 3px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 12px 24px -3px rgba(0, 0, 0, 0.1), 0 8px 12px -3px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      gridTemplateColumns: {
        // 12-column grid as specified in the brief
        '12': 'repeat(12, minmax(0, 1fr))',
        // 8-column grid for tablet as specified in the brief
        '8': 'repeat(8, minmax(0, 1fr))',
        // Single column for mobile as specified in the brief
        '1': 'repeat(1, minmax(0, 1fr))',
      },
      animation: {
        // Animations for hover effects and skeleton loaders
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'card-hover': 'cardHover 0.3s ease forwards',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
        cardHover: {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(-8px)',
          },
        },
      },
    },
  },
  plugins: [],
}