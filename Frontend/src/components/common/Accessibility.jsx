import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Accessibility Utilities for PropertyHub
 * 
 * This file contains components and hooks to enhance accessibility
 * across the application, helping to meet WCAG standards.
 */

// Visually hidden text - for screen readers only
export const VisuallyHidden = ({
    children,
    as = 'span',
    ...props
}) => {
    const Tag = as;

    return (
        <Tag
            className="sr-only"
            {...props}
        >
            {children}
        </Tag>
    );
};

VisuallyHidden.propTypes = {
    children: PropTypes.node.isRequired,
    as: PropTypes.oneOf(['span', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

// Skip to content link - for keyboard navigation
export const SkipToContent = ({
    targetId = 'main-content',
    label = 'Skip to main content',
    className = '',
    ...props
}) => {
    return (
        <a
            href={`#${targetId}`}
            className={`
        sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4
        focus:px-4 focus:py-2 focus:bg-white focus:text-primary-700 focus:shadow-lg
        focus:rounded focus:outline-none focus:ring-2 focus:ring-primary-500
        ${className}
      `}
            {...props}
        >
            {label}
        </a>
    );
};

SkipToContent.propTypes = {
    targetId: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
};

// Focus trap for modals and dialogs
export const FocusTrap = ({
    children,
    active = true,
    autoFocus = true,
    returnFocusOnDeactivate = true,
    ...props
}) => {
    const containerRef = useRef(null);
    const previousFocus = useRef(null);

    // Save current focus on mount
    useEffect(() => {
        if (active && returnFocusOnDeactivate) {
            previousFocus.current = document.activeElement;
        }

        return () => {
            if (returnFocusOnDeactivate && previousFocus.current) {
                // Return focus on unmount
                previousFocus.current.focus();
            }
        };
    }, [active, returnFocusOnDeactivate]);

    // Auto-focus first focusable element
    useEffect(() => {
        if (!active || !autoFocus || !containerRef.current) return;

        const focusableElements = containerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }, [active, autoFocus]);

    // Handle tab key to keep focus inside the container
    const handleKeyDown = (e) => {
        if (!active || !containerRef.current || e.key !== 'Tab') return;

        const focusableElements = Array.from(containerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.disabled && el.offsetParent !== null); // Ensure element is visible

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab on first element should go to last element
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // Tab on last element should go to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            tabIndex="-1"
            {...props}
        >
            {children}
        </div>
    );
};

FocusTrap.propTypes = {
    children: PropTypes.node.isRequired,
    active: PropTypes.bool,
    autoFocus: PropTypes.bool,
    returnFocusOnDeactivate: PropTypes.bool,
};

// Keyboard accessible element - adds keyboard support to clickable divs
export const KeyboardAccessible = ({
    children,
    onClick,
    role = 'button',
    tabIndex = 0,
    ...props
}) => {
    const handleKeyDown = (e) => {
        // Trigger click on Enter or Space
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
        }
    };

    return (
        <div
            role={role}
            tabIndex={tabIndex}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            {...props}
        >
            {children}
        </div>
    );
};

KeyboardAccessible.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    role: PropTypes.string,
    tabIndex: PropTypes.number,
};

// Live Region - for announcements to screen readers
export const LiveRegion = ({
    children,
    'aria-live': ariaLive = 'polite', // 'off', 'polite', 'assertive'
    'aria-atomic': ariaAtomic = true,
    role = 'status',
    className = '',
    ...props
}) => {
    return (
        <div
            aria-live={ariaLive}
            aria-atomic={ariaAtomic}
            role={role}
            className={`sr-only ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

LiveRegion.propTypes = {
    children: PropTypes.node,
    'aria-live': PropTypes.oneOf(['off', 'polite', 'assertive']),
    'aria-atomic': PropTypes.bool,
    role: PropTypes.oneOf(['status', 'alert', 'log']),
    className: PropTypes.string,
};

// useAnnounce hook - for dynamic screen reader announcements
export const useAnnounce = (initialMessage = '') => {
    const [message, setMessage] = React.useState(initialMessage);
    const timeoutRef = React.useRef(null);

    // Clear previous timeout on new announcement
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Function to announce messages to screen readers
    const announce = (newMessage, clearAfter = 5000) => {
        setMessage(newMessage);

        // Clear message after timeout
        if (clearAfter > 0) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setMessage('');
            }, clearAfter);
        }
    };

    // LiveRegion component pre-configured
    const Announcer = ({ role = 'status', 'aria-live': ariaLive = 'polite' }) => (
        <LiveRegion role={role} aria-live={ariaLive}>
            {message}
        </LiveRegion>
    );

    Announcer.propTypes = {
        role: PropTypes.oneOf(['status', 'alert', 'log']),
        'aria-live': PropTypes.oneOf(['off', 'polite', 'assertive']),
    };

    return [announce, Announcer];
};

// A11y Image - provides proper alt text handling
export const A11yImage = ({
    src,
    alt,
    decorative = false,
    className = '',
    ...props
}) => {
    // If image is decorative, use empty alt and aria-hidden
    const altText = decorative ? '' : alt;
    const ariaHidden = decorative ? true : undefined;

    return (
        <img
            src={src}
            alt={altText}
            aria-hidden={ariaHidden}
            className={className}
            {...props}
        />
    );
};

A11yImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    decorative: PropTypes.bool,
    className: PropTypes.string,
};

// Input label with proper accessibility attributes
export const A11yLabel = ({
    htmlFor,
    children,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium ${className}`}
            {...props}
        >
            {children}
            {required && (
                <span className="ml-1 text-red-500" aria-hidden="true">*</span>
            )}
            {required && (
                <VisuallyHidden> (required)</VisuallyHidden>
            )}
        </label>
    );
};

A11yLabel.propTypes = {
    htmlFor: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string,
};

// useMediaQuery hook - for responsive behavior based on accessibility preferences
export const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(false);

    useEffect(() => {
        // Default to false on SSR
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const listener = (e) => setMatches(e.matches);
        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

// Predefined media queries for common accessibility preferences
export const a11yMediaQueries = {
    prefersReducedMotion: '(prefers-reduced-motion: reduce)',
    prefersColorSchemeLight: '(prefers-color-scheme: light)',
    prefersColorSchemeDark: '(prefers-color-scheme: dark)',
    prefersReducedTransparency: '(prefers-reduced-transparency: reduce)',
    prefersReducedData: '(prefers-reduced-data: reduce)',
    prefersContrast: '(prefers-contrast: more)',
};

// Export all accessibility utilities
export default {
    VisuallyHidden,
    SkipToContent,
    FocusTrap,
    KeyboardAccessible,
    LiveRegion,
    useAnnounce,
    A11yImage,
    A11yLabel,
    useMediaQuery,
    a11yMediaQueries,
};