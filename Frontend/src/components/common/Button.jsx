import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component using Tailwind CSS for the PropertyHub design system
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'active:transform',
    'active:translate-y-px',
    'rounded',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    fullWidth ? 'w-full' : '',
  ];

  // Classes based on button variant
  const variantClasses = {
    primary: [
      'bg-primary-600',
      'hover:bg-primary-700',
      'text-white',
      'focus:ring-primary-500',
      'shadow-sm',
    ],
    secondary: [
      'bg-gray-600',
      'hover:bg-gray-700',
      'text-white',
      'focus:ring-gray-500',
      'shadow-sm',
    ],
    accent: [
      'bg-accent-500',
      'hover:bg-accent-600',
      'text-white',
      'focus:ring-accent-400',
      'shadow-sm',
    ],
    outline: [
      'bg-transparent',
      'border',
      'border-primary-600',
      'text-primary-600',
      'hover:bg-primary-50',
      'focus:ring-primary-500',
    ],
    'outline-accent': [
      'bg-transparent',
      'border',
      'border-accent-500',
      'text-accent-500',
      'hover:bg-accent-50',
      'focus:ring-accent-400',
    ],
    ghost: [
      'bg-transparent',
      'text-primary-600',
      'hover:bg-primary-50',
      'focus:ring-primary-500',
    ],
    'ghost-accent': [
      'bg-transparent',
      'text-accent-500',
      'hover:bg-accent-50',
      'focus:ring-accent-400',
    ],
    link: [
      'bg-transparent',
      'underline',
      'text-primary-600',
      'hover:text-primary-700',
      'p-0',
      'focus:ring-0',
      'shadow-none',
    ],
    success: [
      'bg-success-500',
      'hover:bg-success-600',
      'text-white',
      'focus:ring-success-400',
      'shadow-sm',
    ],
    error: [
      'bg-error-500',
      'hover:bg-error-600',
      'text-white',
      'focus:ring-error-400',
      'shadow-sm',
    ],
    warning: [
      'bg-warning-500',
      'hover:bg-warning-600',
      'text-white',
      'focus:ring-warning-400',
      'shadow-sm',
    ],
  };

  // Classes based on button size
  const sizeClasses = {
    xs: ['text-xs', 'py-1', 'px-2'],
    sm: ['text-sm', 'py-1.5', 'px-3'],
    md: ['text-base', 'py-2', 'px-4'],
    lg: ['text-lg', 'py-2.5', 'px-5'],
    xl: ['text-xl', 'py-3', 'px-6'],
  };

  // Combine all classes
  const buttonClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'outline',
    'outline-accent',
    'ghost',
    'ghost-accent',
    'link',
    'success',
    'error',
    'warning'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default Button;