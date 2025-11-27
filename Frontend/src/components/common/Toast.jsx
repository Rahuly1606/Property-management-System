import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * Toast Component using Tailwind CSS for the PropertyHub design system
 */
const Toast = ({
    message,
    type = 'info',
    duration = 5000,
    position = 'bottom-right',
    onClose,
    showCloseButton = true,
    icon = true,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    // Handle close
    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // Wait for the exit animation to complete
    }, [onClose]);

    // Auto close after duration
    useEffect(() => {
        if (duration !== 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, handleClose]);

    // Position classes
    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
    };

    // Type-specific classes and icons
    const typeStyles = {
        success: {
            bgColor: 'bg-success-100',
            borderColor: 'border-success-500',
            textColor: 'text-success-800',
            iconColor: 'text-success-500',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
        },
        error: {
            bgColor: 'bg-error-100',
            borderColor: 'border-error-500',
            textColor: 'text-error-800',
            iconColor: 'text-error-500',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            ),
        },
        warning: {
            bgColor: 'bg-warning-100',
            borderColor: 'border-warning-500',
            textColor: 'text-warning-800',
            iconColor: 'text-warning-500',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            ),
        },
        info: {
            bgColor: 'bg-primary-100',
            borderColor: 'border-primary-500',
            textColor: 'text-primary-800',
            iconColor: 'text-primary-500',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            ),
        },
    };

    const { bgColor, borderColor, textColor, iconColor, icon: typeIcon } = typeStyles[type];

    return createPortal(
        <div
            className={`
        fixed ${positionClasses[position]} z-50
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        pointer-events-auto
      `}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div
                className={`
          ${bgColor} ${borderColor} ${textColor}
          border-l-4 p-4 shadow-lg rounded-r
          flex items-start w-full max-w-xs md:max-w-sm
        `}
            >
                {icon && (
                    <div className={`mr-3 ${iconColor}`}>
                        {typeIcon}
                    </div>
                )}
                <div className="flex-1">
                    <p className="text-sm">{message}</p>
                </div>
                {showCloseButton && (
                    <button
                        onClick={handleClose}
                        className={`ml-4 -mt-1 -mr-1 ${textColor} hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded`}
                        aria-label="Close"
                    >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>,
        document.body
    );
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    duration: PropTypes.number,
    position: PropTypes.oneOf([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
    ]),
    onClose: PropTypes.func,
    showCloseButton: PropTypes.bool,
    icon: PropTypes.bool,
};

/**
 * ToastContainer Component - Manages multiple toasts
 */
export const ToastContainer = ({
    position = 'bottom-right',
    toasts = []
}) => {
    const positionClasses = {
        'top-left': 'top-0 left-0',
        'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-0 right-0',
    };

    const isTop = position.startsWith('top');

    return createPortal(
        <div
            className={`fixed ${positionClasses[position]} z-50 p-4 flex flex-col space-y-4 items-${position.includes('center') ? 'center' : position.includes('right') ? 'end' : 'start'}`}
            style={{
                pointerEvents: 'none',
                flexDirection: isTop ? 'column' : 'column-reverse'
            }}
        >
            {toasts.map((toast) => (
                <Toast key={toast.id} position={position} {...toast} />
            ))}
        </div>,
        document.body
    );
};

ToastContainer.propTypes = {
    position: PropTypes.oneOf([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
    ]),
    toasts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            message: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
            duration: PropTypes.number,
            onClose: PropTypes.func,
            showCloseButton: PropTypes.bool,
            icon: PropTypes.bool,
        })
    ),
};

/**
 * Toast Context and Provider for easy application-wide toast management
 */
export const ToastContext = React.createContext({
    showToast: () => { },
    hideToast: () => { },
    hideAllToasts: () => { },
});

export const ToastProvider = ({ children, position = 'bottom-right' }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ message, type = 'info', duration = 5000 }) => {
        const id = Date.now();
        setToasts((prevToasts) => [
            ...prevToasts,
            {
                id,
                message,
                type,
                duration,
                onClose: () => hideToast(id),
            },
        ]);
        return id;
    }, []);

    const hideToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const hideAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts }}>
            {children}
            <ToastContainer position={position} toasts={toasts} />
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
    ]),
};

// Custom hook to use the toast context
export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default Toast;