import React from 'react';
import PropTypes from 'prop-types';

/**
 * Responsive Layout Components using Tailwind CSS for the PropertyHub design system
 * These components provide consistent layout structures based on the design brief requirements
 */

// Container Component
// Provides a centered, max-width container with proper padding at different breakpoints
export const Container = ({
    children,
    fluid = false,
    className = '',
    as = 'div',
    ...props
}) => {
    const Tag = as;

    return (
        <Tag
            className={`
        mx-auto 
        px-4 
        sm:px-6 
        md:px-8 
        ${fluid ? 'w-full' : 'max-w-7xl'} 
        ${className}
      `}
            {...props}
        >
            {children}
        </Tag>
    );
};

Container.propTypes = {
    children: PropTypes.node.isRequired,
    fluid: PropTypes.bool,
    className: PropTypes.string,
    as: PropTypes.oneOf(['div', 'section', 'article', 'main', 'header', 'footer', 'nav']),
};

// Row Component
// Provides a flex row container with optional gap, justification, and alignment
export const Row = ({
    children,
    wrap = true,
    gap = 4, // Default gap size
    justifyContent = 'start',
    alignItems = 'stretch',
    className = '',
    ...props
}) => {
    // Map gap values to Tailwind classes
    const gapClasses = {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
        16: 'gap-16',
    };

    // Map justifyContent values to Tailwind classes
    const justifyClasses = {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
    };

    // Map alignItems values to Tailwind classes
    const alignClasses = {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch',
    };

    return (
        <div
            className={`
        flex 
        ${wrap ? 'flex-wrap' : 'flex-nowrap'} 
        ${gapClasses[gap] || 'gap-4'} 
        ${justifyClasses[justifyContent] || 'justify-start'} 
        ${alignClasses[alignItems] || 'items-stretch'} 
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

Row.propTypes = {
    children: PropTypes.node.isRequired,
    wrap: PropTypes.bool,
    gap: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16]),
    justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'evenly']),
    alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
    className: PropTypes.string,
};

// Col Component
// Responsive column component for use within Row
export const Col = ({
    children,
    span = { sm: 12, md: undefined, lg: undefined }, // Default to full width on mobile
    className = '',
    ...props
}) => {
    // Map numeric spans to column classes for different breakpoints
    const getColClass = (value, breakpoint) => {
        if (value === undefined) return '';

        // Convert 12-based grid to fraction
        const width = value === 12 ? 'full' :
            value === 6 ? '1/2' :
                value === 4 ? '1/3' :
                    value === 8 ? '2/3' :
                        value === 3 ? '1/4' :
                            value === 9 ? '3/4' :
                                value === 2 ? '1/6' :
                                    value === 10 ? '5/6' :
                                        value === 5 ? '5/12' :
                                            value === 7 ? '7/12' :
                                                value === 1 ? '1/12' :
                                                    value === 11 ? '11/12' : `${value}/12`;

        return breakpoint ? `${breakpoint}:w-${width}` : `w-${width}`;
    };

    return (
        <div
            className={`
        ${getColClass(span.sm, '')}
        ${getColClass(span.md, 'md')}
        ${getColClass(span.lg, 'lg')}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

Col.propTypes = {
    children: PropTypes.node.isRequired,
    span: PropTypes.shape({
        sm: PropTypes.number,
        md: PropTypes.number,
        lg: PropTypes.number,
    }),
    className: PropTypes.string,
};

// Grid Component
// A CSS Grid container with responsive column support
export const Grid = ({
    children,
    cols = { sm: 1, md: 2, lg: 3 }, // Default columns for different breakpoints
    gap = 6,
    className = '',
    ...props
}) => {
    // Map gap values to Tailwind classes
    const gapClasses = {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
        16: 'gap-16',
    };

    return (
        <div
            className={`
        grid 
        grid-cols-${cols.sm} 
        md:grid-cols-${cols.md} 
        lg:grid-cols-${cols.lg} 
        ${gapClasses[gap] || 'gap-6'} 
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

Grid.propTypes = {
    children: PropTypes.node.isRequired,
    cols: PropTypes.shape({
        sm: PropTypes.number,
        md: PropTypes.number,
        lg: PropTypes.number,
    }),
    gap: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16]),
    className: PropTypes.string,
};

// Section Component
// A semantic section container with consistent spacing
export const Section = ({
    children,
    spacing = 'normal', // 'small', 'normal', 'large', 'none'
    bg = 'transparent', // 'white', 'gray', 'primary', 'transparent'
    className = '',
    ...props
}) => {
    // Map spacing values to padding classes
    const spacingClasses = {
        small: 'py-6 md:py-8',
        normal: 'py-12 md:py-16',
        large: 'py-16 md:py-24',
        none: '',
    };

    // Map background values to background color classes
    const bgClasses = {
        white: 'bg-white',
        gray: 'bg-gray-50',
        primary: 'bg-primary-50',
        transparent: '',
    };

    return (
        <section
            className={`
        ${spacingClasses[spacing] || 'py-12 md:py-16'} 
        ${bgClasses[bg] || ''} 
        ${className}
      `}
            {...props}
        >
            {children}
        </section>
    );
};

Section.propTypes = {
    children: PropTypes.node.isRequired,
    spacing: PropTypes.oneOf(['small', 'normal', 'large', 'none']),
    bg: PropTypes.oneOf(['white', 'gray', 'primary', 'transparent']),
    className: PropTypes.string,
};

// Divider Component
export const Divider = ({
    className = '',
    color = 'gray-200',
    vertical = false,
    ...props
}) => {
    return (
        <hr
            className={`
        ${vertical
                    ? `h-full w-px border-l border-${color} inline-block`
                    : `w-full h-px border-t border-${color}`} 
        ${className}
      `}
            {...props}
        />
    );
};

Divider.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    vertical: PropTypes.bool,
};

// Aspect Ratio Box - useful for responsively maintaining aspect ratios (like property images)
export const AspectRatio = ({
    children,
    ratio = '16/9',
    className = '',
    ...props
}) => {
    // Calculate the aspect ratio to apply
    const paddingBottom = ratio === '16/9' ? '56.25%' :
        ratio === '4/3' ? '75%' :
            ratio === '1/1' ? '100%' :
                ratio === '3/2' ? '66.67%' :
                    ratio === '2/1' ? '50%' :
                        ratio;

    return (
        <div
            className={`relative ${className}`}
            style={{ paddingBottom }}
            {...props}
        >
            <div className="absolute inset-0">
                {children}
            </div>
        </div>
    );
};

AspectRatio.propTypes = {
    children: PropTypes.node.isRequired,
    ratio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
};

// Responsive Hidden Component - hides content at specified breakpoints
export const Hidden = ({
    children,
    on = [], // Array of breakpoints to hide on: 'sm', 'md', 'lg'
    className = '',
    ...props
}) => {
    const breakpointClasses = {
        sm: 'sm:hidden',
        md: 'md:hidden',
        lg: 'lg:hidden',
    };

    // Calculate the visibility classes
    const visibilityClasses = on.map(breakpoint => breakpointClasses[breakpoint]).join(' ');

    return (
        <div
            className={`${visibilityClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Hidden.propTypes = {
    children: PropTypes.node.isRequired,
    on: PropTypes.arrayOf(PropTypes.oneOf(['sm', 'md', 'lg'])),
    className: PropTypes.string,
};

// Responsive Visible Component - shows content only at specified breakpoints
export const Visible = ({
    children,
    on = [], // Array of breakpoints to show on: 'sm', 'md', 'lg'
    className = '',
    ...props
}) => {
    const breakpointClasses = {
        sm: 'hidden sm:block',
        md: 'hidden md:block',
        lg: 'hidden lg:block',
    };

    // For a single breakpoint, hide on others
    if (on.length === 1) {
        return (
            <div
                className={`${breakpointClasses[on[0]]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }

    // For multiple breakpoints, this gets complex
    // We'll use a basic implementation that works for common cases
    if (on.includes('sm') && on.includes('md') && !on.includes('lg')) {
        return (
            <div
                className={`block lg:hidden ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }

    if (!on.includes('sm') && on.includes('md') && on.includes('lg')) {
        return (
            <div
                className={`hidden md:block ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }

    // Default case - visible on all specified breakpoints but not others
    const visibilityClass = on.length === 0 ? 'block' : 'hidden';
    const showClasses = on.map(breakpoint => `${breakpoint}:block`).join(' ');

    return (
        <div
            className={`${visibilityClass} ${showClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Visible.propTypes = {
    children: PropTypes.node.isRequired,
    on: PropTypes.arrayOf(PropTypes.oneOf(['sm', 'md', 'lg'])),
    className: PropTypes.string,
};

// Export layout components
export default {
    Container,
    Row,
    Col,
    Grid,
    Section,
    Divider,
    AspectRatio,
    Hidden,
    Visible,
};