import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'btn-accent';
      case 'info':
        return 'btn-info';
      case 'success':
        return 'btn-success';
      case 'warning':
        return 'btn-warning';
      case 'error':
        return 'btn-error';
      case 'ghost':
        return 'btn-ghost';
      case 'link':
        return 'btn-link';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'xs':
        return 'btn-xs';
      case 'sm':
        return 'btn-sm';
      case 'md':
        return '';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 