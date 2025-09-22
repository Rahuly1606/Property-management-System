import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Animations and Transitions for PropertyHub
 * 
 * This file contains animation utilities for consistent microinteractions
 * across the application, enhancing UX while maintaining brand consistency.
 */

// Fade animation utility component
export const Fade = ({
    children,
    show = true,
    duration = 'normal', // 'fast', 'normal', 'slow'
    delay = 0,
    className = '',
    onAnimationComplete = () => { },
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(show);
    const [shouldRender, setShouldRender] = useState(show);

    // Map duration values to transition duration in ms
    const durationValues = {
        fast: 150,
        normal: 300,
        slow: 500,
    };

    const transitionDuration = durationValues[duration] || 300;

    useEffect(() => {
        let timeout;

        if (show) {
            setShouldRender(true);
            // Slight delay to ensure DOM update before animation starts
            timeout = setTimeout(() => {
                setIsVisible(true);
            }, 10);
        } else {
            setIsVisible(false);
            timeout = setTimeout(() => {
                setShouldRender(false);
                onAnimationComplete();
            }, transitionDuration + delay);
        }

        return () => clearTimeout(timeout);
    }, [show, transitionDuration, delay, onAnimationComplete]);

    if (!shouldRender) return null;

    return (
        <div
            className={`transition-opacity ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${transitionDuration}ms`,
                transitionDelay: `${delay}ms`,
            }}
            {...props}
        >
            {children}
        </div>
    );
};

Fade.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool,
    duration: PropTypes.oneOf(['fast', 'normal', 'slow']),
    delay: PropTypes.number,
    className: PropTypes.string,
    onAnimationComplete: PropTypes.func,
};

// Slide animation utility component
export const Slide = ({
    children,
    show = true,
    direction = 'right', // 'right', 'left', 'up', 'down'
    distance = 'normal', // 'small', 'normal', 'large'
    duration = 'normal', // 'fast', 'normal', 'slow'
    delay = 0,
    className = '',
    onAnimationComplete = () => { },
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(show);
    const [shouldRender, setShouldRender] = useState(show);

    // Map duration values to transition duration in ms
    const durationValues = {
        fast: 150,
        normal: 300,
        slow: 500,
    };

    // Map distance values to pixel values
    const distanceValues = {
        small: 10,
        normal: 30,
        large: 60,
    };

    const transitionDuration = durationValues[duration] || 300;
    const slideDistance = distanceValues[distance] || 30;

    // Calculate transform based on direction
    const getTransform = (visible) => {
        if (visible) return 'translate3d(0, 0, 0)';

        switch (direction) {
            case 'right': return `translate3d(${slideDistance}px, 0, 0)`;
            case 'left': return `translate3d(-${slideDistance}px, 0, 0)`;
            case 'up': return `translate3d(0, -${slideDistance}px, 0)`;
            case 'down': return `translate3d(0, ${slideDistance}px, 0)`;
            default: return `translate3d(${slideDistance}px, 0, 0)`;
        }
    };

    useEffect(() => {
        let timeout;

        if (show) {
            setShouldRender(true);
            // Slight delay to ensure DOM update before animation starts
            timeout = setTimeout(() => {
                setIsVisible(true);
            }, 10);
        } else {
            setIsVisible(false);
            timeout = setTimeout(() => {
                setShouldRender(false);
                onAnimationComplete();
            }, transitionDuration + delay);
        }

        return () => clearTimeout(timeout);
    }, [show, transitionDuration, delay, onAnimationComplete]);

    if (!shouldRender) return null;

    return (
        <div
            className={`transition-all ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(isVisible),
                transitionDuration: `${transitionDuration}ms`,
                transitionDelay: `${delay}ms`,
                transitionProperty: 'opacity, transform',
            }}
            {...props}
        >
            {children}
        </div>
    );
};

Slide.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool,
    direction: PropTypes.oneOf(['right', 'left', 'up', 'down']),
    distance: PropTypes.oneOf(['small', 'normal', 'large']),
    duration: PropTypes.oneOf(['fast', 'normal', 'slow']),
    delay: PropTypes.number,
    className: PropTypes.string,
    onAnimationComplete: PropTypes.func,
};

// Scale animation utility component
export const Scale = ({
    children,
    show = true,
    origin = 'center', // 'center', 'top', 'bottom', 'left', 'right'
    factor = 'normal', // 'small', 'normal', 'large'
    duration = 'normal', // 'fast', 'normal', 'slow'
    delay = 0,
    className = '',
    onAnimationComplete = () => { },
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(show);
    const [shouldRender, setShouldRender] = useState(show);

    // Map duration values to transition duration in ms
    const durationValues = {
        fast: 150,
        normal: 300,
        slow: 500,
    };

    // Map factor values to scale factors
    const factorValues = {
        small: 0.95,
        normal: 0.85,
        large: 0.6,
    };

    const transitionDuration = durationValues[duration] || 300;
    const scaleFactor = factorValues[factor] || 0.85;

    // Map origin values to transform-origin CSS
    const originValues = {
        center: 'center',
        top: 'top center',
        bottom: 'bottom center',
        left: 'center left',
        right: 'center right',
    };

    useEffect(() => {
        let timeout;

        if (show) {
            setShouldRender(true);
            // Slight delay to ensure DOM update before animation starts
            timeout = setTimeout(() => {
                setIsVisible(true);
            }, 10);
        } else {
            setIsVisible(false);
            timeout = setTimeout(() => {
                setShouldRender(false);
                onAnimationComplete();
            }, transitionDuration + delay);
        }

        return () => clearTimeout(timeout);
    }, [show, transitionDuration, delay, onAnimationComplete]);

    if (!shouldRender) return null;

    return (
        <div
            className={`transition-all ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : `scale(${scaleFactor})`,
                transitionDuration: `${transitionDuration}ms`,
                transitionDelay: `${delay}ms`,
                transformOrigin: originValues[origin],
                transitionProperty: 'opacity, transform',
            }}
            {...props}
        >
            {children}
        </div>
    );
};

Scale.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool,
    origin: PropTypes.oneOf(['center', 'top', 'bottom', 'left', 'right']),
    factor: PropTypes.oneOf(['small', 'normal', 'large']),
    duration: PropTypes.oneOf(['fast', 'normal', 'slow']),
    delay: PropTypes.number,
    className: PropTypes.string,
    onAnimationComplete: PropTypes.func,
};

// Pulse animation - useful for drawing attention to elements
export const Pulse = ({
    children,
    active = false,
    count = 'infinite', // 'infinite' or a number
    duration = 'normal', // 'fast', 'normal', 'slow'
    className = '',
    ...props
}) => {
    // Map duration values to animation duration in ms
    const durationValues = {
        fast: 700,
        normal: 1200,
        slow: 2000,
    };

    const animationDuration = durationValues[duration] || 1200;

    // Define animation style based on active state
    const animationStyle = active ? {
        animation: `pulse ${animationDuration}ms ${count === 'infinite' ? 'infinite' : count} cubic-bezier(0.4, 0, 0.6, 1)`,
    } : {};

    return (
        <div
            className={className}
            style={animationStyle}
            {...props}
        >
            <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.05);
          }
        }
      `}</style>
            {children}
        </div>
    );
};

Pulse.propTypes = {
    children: PropTypes.node.isRequired,
    active: PropTypes.bool,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['infinite'])]),
    duration: PropTypes.oneOf(['fast', 'normal', 'slow']),
    className: PropTypes.string,
};

// Hover animation effect - applies subtle transform on hover
export const HoverEffect = ({
    children,
    effect = 'float', // 'float', 'grow', 'shrink', 'glow'
    intensity = 'normal', // 'subtle', 'normal', 'strong'
    disabled = false,
    className = '',
    ...props
}) => {
    // Base class for all hover effects
    const baseClass = 'transition-all duration-300';

    // Map intensity values to effect strength
    const intensityValues = {
        subtle: {
            float: 'hover:-translate-y-1',
            grow: 'hover:scale-[1.02]',
            shrink: 'hover:scale-[0.98]',
            glow: 'hover:shadow-md',
        },
        normal: {
            float: 'hover:-translate-y-2',
            grow: 'hover:scale-[1.05]',
            shrink: 'hover:scale-[0.95]',
            glow: 'hover:shadow-lg',
        },
        strong: {
            float: 'hover:-translate-y-3',
            grow: 'hover:scale-[1.1]',
            shrink: 'hover:scale-[0.9]',
            glow: 'hover:shadow-xl',
        },
    };

    // Get the appropriate effect class based on effect type and intensity
    const effectClass = disabled ? '' : (intensityValues[intensity] || intensityValues.normal)[effect];

    return (
        <div
            className={`${baseClass} ${effectClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

HoverEffect.propTypes = {
    children: PropTypes.node.isRequired,
    effect: PropTypes.oneOf(['float', 'grow', 'shrink', 'glow']),
    intensity: PropTypes.oneOf(['subtle', 'normal', 'strong']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

// Staggered children animation component
export const StaggeredGroup = ({
    children,
    show = true,
    staggerDelay = 100, // ms between each child animation
    duration = 'normal', // 'fast', 'normal', 'slow'
    animation = 'fade', // 'fade', 'slide', 'scale'
    direction = 'right', // for slide animations: 'right', 'left', 'up', 'down'
    className = '',
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    // Clone children and add staggered delay prop
    const staggeredChildren = React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const delay = index * staggerDelay;

        // Choose animation component based on animation prop
        if (animation === 'fade') {
            return (
                <Fade
                    show={isVisible}
                    duration={duration}
                    delay={delay}
                >
                    {child}
                </Fade>
            );
        }

        if (animation === 'slide') {
            return (
                <Slide
                    show={isVisible}
                    duration={duration}
                    delay={delay}
                    direction={direction}
                >
                    {child}
                </Slide>
            );
        }

        if (animation === 'scale') {
            return (
                <Scale
                    show={isVisible}
                    duration={duration}
                    delay={delay}
                >
                    {child}
                </Scale>
            );
        }

        return child;
    });

    return (
        <div className={className} {...props}>
            {staggeredChildren}
        </div>
    );
};

StaggeredGroup.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool,
    staggerDelay: PropTypes.number,
    duration: PropTypes.oneOf(['fast', 'normal', 'slow']),
    animation: PropTypes.oneOf(['fade', 'slide', 'scale']),
    direction: PropTypes.oneOf(['right', 'left', 'up', 'down']),
    className: PropTypes.string,
};

// Higher-order component to add transitions to elements on mount/unmount
export const withTransition = (Component, animationProps = {}) => {
    const WithTransition = ({ show = true, ...props }) => {
        const {
            type = 'fade',
            duration = 'normal',
            ...otherAnimationProps
        } = animationProps;

        if (type === 'fade') {
            return (
                <Fade show={show} duration={duration} {...otherAnimationProps}>
                    <Component {...props} />
                </Fade>
            );
        }

        if (type === 'slide') {
            return (
                <Slide show={show} duration={duration} {...otherAnimationProps}>
                    <Component {...props} />
                </Slide>
            );
        }

        if (type === 'scale') {
            return (
                <Scale show={show} duration={duration} {...otherAnimationProps}>
                    <Component {...props} />
                </Scale>
            );
        }

        return <Component {...props} />;
    };

    WithTransition.displayName = `withTransition(${Component.displayName || Component.name || 'Component'})`;
    return WithTransition;
};

// Export animations and transitions
export default {
    Fade,
    Slide,
    Scale,
    Pulse,
    HoverEffect,
    StaggeredGroup,
    withTransition,
};