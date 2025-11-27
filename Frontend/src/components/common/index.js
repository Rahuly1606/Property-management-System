/**
 * PropertyHub Design System
 * 
 * This file exports all design system components and utilities
 * for easy access throughout the application.
 */

// Export layout components
export * from './ResponsiveLayout';

// Export animation utilities
export * from './Animations';

// Export accessibility utilities
export * from './Accessibility';

// Export data display components
export * from './DataDisplay';

// Re-export other previously created components
// Note: You need to update these imports to match your file paths

// Button components
export {
    Button,
    IconButton,
    ButtonGroup
} from '../common/Button';

// Card components
export {
    Card,
    PropertyCard,
    ProfileCard,
    StatCard
} from '../common/Card';

// Form components
export {
    Input,
    TextArea,
    Select,
    Checkbox,
    Radio,
    FileUpload,
    FormControl,
    FormGroup,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Switch,
    DatePicker
} from '../common/FormComponents';

// Modal components
export {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useModal
} from '../common/Modal';

// Toast components
export {
    Toast,
    ToastContainer,
    useToast
} from '../common/Toast';

// Skeleton loading components
export {
    Skeleton,
    PropertyCardSkeleton,
    PropertyGridSkeleton,
    PropertyDetailSkeleton,
    FormSkeleton,
    ProfileSkeleton,
    TableSkeleton
} from '../common/Skeletons';

// Define design tokens for easier reference
export const designTokens = {
    colors: {
        // Primary colors
        primary: {
            50: 'var(--color-primary-50)',
            100: 'var(--color-primary-100)',
            200: 'var(--color-primary-200)',
            300: 'var(--color-primary-300)',
            400: 'var(--color-primary-400)',
            500: 'var(--color-primary-500)',
            600: 'var(--color-primary-600)',
            700: 'var(--color-primary-700)',
            800: 'var(--color-primary-800)',
            900: 'var(--color-primary-900)',
        },
        // Accent colors
        accent: {
            50: 'var(--color-accent-50)',
            100: 'var(--color-accent-100)',
            200: 'var(--color-accent-200)',
            300: 'var(--color-accent-300)',
            400: 'var(--color-accent-400)',
            500: 'var(--color-accent-500)',
            600: 'var(--color-accent-600)',
            700: 'var(--color-accent-700)',
            800: 'var(--color-accent-800)',
            900: 'var(--color-accent-900)',
        },
        // Gray scale
        gray: {
            50: 'var(--color-gray-50)',
            100: 'var(--color-gray-100)',
            200: 'var(--color-gray-200)',
            300: 'var(--color-gray-300)',
            400: 'var(--color-gray-400)',
            500: 'var(--color-gray-500)',
            600: 'var(--color-gray-600)',
            700: 'var(--color-gray-700)',
            800: 'var(--color-gray-800)',
            900: 'var(--color-gray-900)',
        },
        // UI colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
    },

    // Typography
    typography: {
        fontFamily: {
            heading: 'var(--font-heading)',
            body: 'var(--font-body)',
        },
        fontSize: {
            xs: 'var(--text-xs)',      // 12px
            sm: 'var(--text-sm)',      // 14px
            base: 'var(--text-base)',  // 16px
            lg: 'var(--text-lg)',      // 18px
            xl: 'var(--text-xl)',      // 20px
            '2xl': 'var(--text-2xl)',  // 24px
            '3xl': 'var(--text-3xl)',  // 30px
            '4xl': 'var(--text-4xl)',  // 36px
            '5xl': 'var(--text-5xl)',  // 48px
        },
        fontWeight: {
            light: 'var(--font-light)',
            normal: 'var(--font-normal)',
            medium: 'var(--font-medium)',
            semibold: 'var(--font-semibold)',
            bold: 'var(--font-bold)',
        },
        lineHeight: {
            none: 'var(--leading-none)',
            tight: 'var(--leading-tight)',
            snug: 'var(--leading-snug)',
            normal: 'var(--leading-normal)',
            relaxed: 'var(--leading-relaxed)',
            loose: 'var(--leading-loose)',
        },
    },

    // Spacing
    spacing: {
        0: '0px',
        1: 'var(--spacing-1)',   // 4px
        2: 'var(--spacing-2)',   // 8px
        3: 'var(--spacing-3)',   // 12px
        4: 'var(--spacing-4)',   // 16px
        5: 'var(--spacing-5)',   // 20px
        6: 'var(--spacing-6)',   // 24px
        8: 'var(--spacing-8)',   // 32px
        10: 'var(--spacing-10)', // 40px
        12: 'var(--spacing-12)', // 48px
        16: 'var(--spacing-16)', // 64px
        20: 'var(--spacing-20)', // 80px
        24: 'var(--spacing-24)', // 96px
    },

    // Breakpoints
    breakpoints: {
        sm: 'var(--breakpoint-sm)', // 375px - Mobile
        md: 'var(--breakpoint-md)', // 768px - Tablet
        lg: 'var(--breakpoint-lg)', // 1440px - Desktop
    },

    // Border radius
    borderRadius: {
        none: '0px',
        sm: 'var(--radius-sm)',     // 2px
        DEFAULT: 'var(--radius-md)', // 4px
        md: 'var(--radius-md)',     // 4px
        lg: 'var(--radius-lg)',     // 8px
        xl: 'var(--radius-xl)',     // 12px
        '2xl': 'var(--radius-2xl)', // 16px
        '3xl': 'var(--radius-3xl)', // 24px
        full: '9999px',
    },

    // Shadows
    shadows: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        none: 'none',
    },

    // Animations
    animations: {
        durations: {
            fast: 'var(--duration-fast)',     // 150ms
            normal: 'var(--duration-normal)', // 300ms
            slow: 'var(--duration-slow)',     // 500ms
        },
        easings: {
            default: 'var(--easing-default)', // cubic-bezier(0.4, 0, 0.2, 1)
            in: 'var(--easing-in)',           // cubic-bezier(0.4, 0, 1, 1)
            out: 'var(--easing-out)',         // cubic-bezier(0, 0, 0.2, 1)
            inOut: 'var(--easing-in-out)',    // cubic-bezier(0.4, 0, 0.2, 1)
        },
    },
};

// Helper functions for working with the design system
export const designSystem = {
    // Get a color value from the color scales
    color: (name, shade = 500) => {
        const colorParts = name.split('-');
        const colorName = colorParts[0];
        const colorShade = colorParts.length > 1 ? colorParts[1] : shade;

        if (designTokens.colors[colorName]) {
            if (typeof designTokens.colors[colorName] === 'object') {
                return designTokens.colors[colorName][colorShade];
            }
            return designTokens.colors[colorName];
        }
        return null;
    },

    // Get a spacing value
    spacing: (size) => designTokens.spacing[size] || `${size}px`,

    // Get a breakpoint value
    breakpoint: (name) => designTokens.breakpoints[name],

    // Get a font size
    fontSize: (size) => designTokens.typography.fontSize[size],

    // Get a shadow
    shadow: (size) => designTokens.shadows[size],

    // Get an animation duration
    duration: (speed) => designTokens.animations.durations[speed],

    // Get an animation easing
    easing: (type) => designTokens.animations.easings[type],

    // Get a border radius
    radius: (size) => designTokens.borderRadius[size],
};

// Export theme and design system utilities
export default {
    designTokens,
    designSystem,
};