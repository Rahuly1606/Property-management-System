import React from 'react';
import PropTypes from 'prop-types';
import { HoverEffect } from './Animations';
import { AspectRatio } from './ResponsiveLayout';

/**
 * Data Display Components for PropertyHub
 * 
 * This file contains components for displaying property data in various formats
 */

// Property Stats - for displaying key property statistics
export const PropertyStats = ({
    stats = [],
    className = '',
    ...props
}) => {
    return (
        <div
            className={`flex flex-wrap items-center gap-4 md:gap-6 ${className}`}
            {...props}
        >
            {stats.map((stat, index) => (
                <div key={index} className="flex items-center">
                    {stat.icon && (
                        <span className="mr-2 text-gray-500">{stat.icon}</span>
                    )}
                    <span className="font-medium">{stat.value}</span>
                    <span className="ml-1 text-gray-500 text-sm">{stat.label}</span>
                </div>
            ))}
        </div>
    );
};

PropertyStats.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.node,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
    })),
    className: PropTypes.string,
};

// Badge component - for property tags, status indicators
export const Badge = ({
    children,
    variant = 'default', // 'default', 'success', 'warning', 'error', 'info', 'outline'
    size = 'md', // 'sm', 'md', 'lg'
    className = '',
    ...props
}) => {
    // Map variant to color classes
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        primary: 'bg-primary-100 text-primary-800',
        accent: 'bg-accent-100 text-accent-800',
        outline: 'bg-white border border-gray-300 text-gray-800',
    };

    // Map size to padding and text size
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    };

    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant] || variantClasses.default}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
            {...props}
        >
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'success', 'warning', 'error', 'info', 'primary', 'accent', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
};

// Price Display component - for displaying property prices with formatting
export const PriceDisplay = ({
    amount,
    currency = 'USD',
    period = null, // 'month', 'year', null (for sale price)
    size = 'md', // 'sm', 'md', 'lg', 'xl'
    className = '',
    ...props
}) => {
    // Format the price with commas
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Map size to text size classes
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-xl font-semibold',
        lg: 'text-2xl font-semibold',
        xl: 'text-3xl font-semibold',
    };

    return (
        <span className={`${sizeClasses[size] || sizeClasses.md} ${className}`} {...props}>
            {formatPrice(amount)}
            {period && <span className="text-gray-500 text-base font-normal ml-1">/ {period}</span>}
        </span>
    );
};

PriceDisplay.propTypes = {
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string,
    period: PropTypes.oneOf(['month', 'year', null]),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    className: PropTypes.string,
};

// Property Feature List - for displaying amenities and features
export const FeatureList = ({
    features = [],
    columns = 1, // 1, 2, 3
    className = '',
    ...props
}) => {
    // Map column count to grid columns
    const columnClasses = {
        1: '',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    };

    return (
        <div
            className={`
        ${columns > 1 ? `grid ${columnClasses[columns] || columnClasses[1]} gap-x-4 gap-y-2` : ''}
        ${className}
      `}
            {...props}
        >
            {features.map((feature, index) => (
                <div key={index} className="flex items-center py-1">
                    {feature.icon && (
                        <span className="mr-3 text-primary-500">{feature.icon}</span>
                    )}
                    <span>{feature.label}</span>
                </div>
            ))}
        </div>
    );
};

FeatureList.propTypes = {
    features: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.node,
        label: PropTypes.string.isRequired,
    })),
    columns: PropTypes.oneOf([1, 2, 3]),
    className: PropTypes.string,
};

// Address Display - for formatted property addresses
export const AddressDisplay = ({
    address = {},
    variant = 'full', // 'full', 'short', 'inline'
    className = '',
    ...props
}) => {
    // Format the address based on variant
    const formatAddress = () => {
        const { street, city, state, zipCode, country } = address;

        if (variant === 'inline') {
            return `${street}, ${city}, ${state} ${zipCode}${country ? `, ${country}` : ''}`;
        }

        if (variant === 'short') {
            return (
                <>
                    <div>{street}</div>
                    <div>{city}, {state} {zipCode}</div>
                </>
            );
        }

        // Full address
        return (
            <>
                <div>{street}</div>
                <div>{city}, {state} {zipCode}</div>
                {country && <div>{country}</div>}
            </>
        );
    };

    // Determine class based on variant
    const variantClasses = {
        full: 'text-left',
        short: 'text-left',
        inline: 'inline',
    };

    return (
        <address
            className={`not-italic ${variantClasses[variant] || variantClasses.full} ${className}`}
            {...props}
        >
            {formatAddress()}
        </address>
    );
};

AddressDisplay.propTypes = {
    address: PropTypes.shape({
        street: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        zipCode: PropTypes.string.isRequired,
        country: PropTypes.string,
    }).isRequired,
    variant: PropTypes.oneOf(['full', 'short', 'inline']),
    className: PropTypes.string,
};

// Property Media Gallery - for displaying property images
export const Gallery = ({
    images = [],
    aspectRatio = '3/2',
    maxVisible = 5,
    className = '',
    onImageClick = () => { },
    ...props
}) => {
    // Determine how many images to display
    const visibleImages = images.slice(0, maxVisible);
    const remainingCount = images.length - maxVisible;

    return (
        <div className={`grid grid-cols-2 gap-2 ${className}`} {...props}>
            {/* Main large image */}
            {visibleImages.length > 0 && (
                <div className="col-span-2 row-span-2">
                    <GalleryImage
                        image={visibleImages[0]}
                        aspectRatio={aspectRatio}
                        onClick={() => onImageClick(0)}
                    />
                </div>
            )}

            {/* Secondary images */}
            {visibleImages.slice(1).map((image, index) => (
                <div key={index} className="col-span-1">
                    <GalleryImage
                        image={image}
                        aspectRatio={aspectRatio}
                        onClick={() => onImageClick(index + 1)}
                    />

                    {/* Show remaining count on the last visible image */}
                    {index === visibleImages.length - 2 && remainingCount > 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">+{remainingCount} more</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

Gallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string,
    })).isRequired,
    aspectRatio: PropTypes.string,
    maxVisible: PropTypes.number,
    className: PropTypes.string,
    onImageClick: PropTypes.func,
};

// Helper component for Gallery
const GalleryImage = ({ image, aspectRatio, onClick }) => {
    return (
        <HoverEffect effect="grow" intensity="subtle">
            <AspectRatio ratio={aspectRatio} className="overflow-hidden rounded-lg cursor-pointer">
                <img
                    src={image.src}
                    alt={image.alt || 'Property image'}
                    className="w-full h-full object-cover transition-transform duration-500"
                    onClick={onClick}
                />
            </AspectRatio>
        </HoverEffect>
    );
};

// Progress Bar - for search progress, completion indicators
export const ProgressBar = ({
    value = 0,
    max = 100,
    height = 'normal', // 'thin', 'normal', 'thick'
    variant = 'primary', // 'primary', 'accent', 'success', 'warning', 'error'
    showLabel = false,
    animated = false,
    className = '',
    ...props
}) => {
    // Calculate percentage
    const percentage = Math.round((value / max) * 100);

    // Height classes
    const heightClasses = {
        thin: 'h-1',
        normal: 'h-2',
        thick: 'h-4',
    };

    // Color classes
    const colorClasses = {
        primary: 'bg-primary-500',
        accent: 'bg-accent-500',
        success: 'bg-green-500',
        warning: 'bg-amber-500',
        error: 'bg-red-500',
    };

    return (
        <div className={className} {...props}>
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height] || heightClasses.normal}`}>
                <div
                    className={`${colorClasses[variant] || colorClasses.primary} ${animated ? 'animate-pulse' : ''} h-full rounded-full`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
            {showLabel && (
                <div className="mt-1 text-right text-sm text-gray-600">{percentage}%</div>
            )}
        </div>
    );
};

ProgressBar.propTypes = {
    value: PropTypes.number,
    max: PropTypes.number,
    height: PropTypes.oneOf(['thin', 'normal', 'thick']),
    variant: PropTypes.oneOf(['primary', 'accent', 'success', 'warning', 'error']),
    showLabel: PropTypes.bool,
    animated: PropTypes.bool,
    className: PropTypes.string,
};

// Rating Display - for property and user ratings
export const Rating = ({
    value = 0,
    maxRating = 5,
    size = 'md', // 'sm', 'md', 'lg'
    showValue = false,
    readOnly = true,
    onChange = () => { },
    className = '',
    ...props
}) => {
    // Size classes
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    // Generate stars
    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= maxRating; i++) {
            // Determine star state (filled, half-filled, or empty)
            let starType;
            if (i <= value) {
                starType = 'filled';
            } else if (i - 0.5 <= value) {
                starType = 'half';
            } else {
                starType = 'empty';
            }

            stars.push(
                <span
                    key={i}
                    className={`${!readOnly ? 'cursor-pointer' : ''} text-amber-400`}
                    onClick={() => !readOnly && onChange(i)}
                >
                    {starType === 'filled' && '★'}
                    {starType === 'half' && '★'} {/* This should be a half-star icon, using full for simplicity */}
                    {starType === 'empty' && '☆'}
                </span>
            );
        }

        return stars;
    };

    return (
        <div className={`flex items-center ${className}`} {...props}>
            <div className={`flex ${sizeClasses[size] || sizeClasses.md}`}>
                {renderStars()}
            </div>
            {showValue && (
                <span className="ml-2 text-gray-700">{value.toFixed(1)}</span>
            )}
        </div>
    );
};

Rating.propTypes = {
    value: PropTypes.number,
    maxRating: PropTypes.number,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    showValue: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
};

// Property Status Indicator - for displaying property statuses (available, sold, pending, etc)
export const PropertyStatus = ({
    status = 'available', // 'available', 'sold', 'pending', 'reserved', 'unavailable'
    variant = 'badge', // 'badge', 'text', 'icon'
    className = '',
    ...props
}) => {
    // Map status to appropriate colors and labels
    const statusConfig = {
        available: {
            color: 'success',
            label: 'Available',
            icon: '✓' // Replace with actual icon component
        },
        sold: {
            color: 'error',
            label: 'Sold',
            icon: '✕' // Replace with actual icon component
        },
        pending: {
            color: 'warning',
            label: 'Pending',
            icon: '⏱' // Replace with actual icon component
        },
        reserved: {
            color: 'info',
            label: 'Reserved',
            icon: '🔒' // Replace with actual icon component
        },
        unavailable: {
            color: 'default',
            label: 'Unavailable',
            icon: '✕' // Replace with actual icon component
        },
    };

    const config = statusConfig[status] || statusConfig.available;

    // Render as badge
    if (variant === 'badge') {
        return (
            <Badge variant={config.color} className={className} {...props}>
                {config.label}
            </Badge>
        );
    }

    // Render as text
    if (variant === 'text') {
        const textColorClass = `text-${config.color === 'default' ? 'gray-600' : `${config.color}-600`}`;

        return (
            <span className={`font-medium ${textColorClass} ${className}`} {...props}>
                {config.label}
            </span>
        );
    }

    // Render as icon
    if (variant === 'icon') {
        const iconColorClass = `text-${config.color === 'default' ? 'gray-600' : `${config.color}-600`}`;

        return (
            <span
                className={`${iconColorClass} ${className}`}
                title={config.label}
                {...props}
            >
                {config.icon}
            </span>
        );
    }

    return null;
};

PropertyStatus.propTypes = {
    status: PropTypes.oneOf(['available', 'sold', 'pending', 'reserved', 'unavailable']),
    variant: PropTypes.oneOf(['badge', 'text', 'icon']),
    className: PropTypes.string,
};

// Table component for structured data display
export const Table = ({
    columns = [],
    data = [],
    responsive = true,
    striped = false,
    bordered = false,
    hoverable = true,
    compact = false,
    className = '',
    ...props
}) => {
    // Style classes
    const tableClasses = [
        striped ? 'stripe-rows' : '',
        bordered ? 'bordered' : 'border',
        hoverable ? 'hoverable-rows' : '',
        compact ? 'compact' : '',
        responsive ? 'responsive' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={`overflow-x-auto ${responsive ? 'responsive-table' : ''}`}>
            <table
                className={`min-w-full divide-y divide-gray-200 ${tableClasses}`}
                {...props}
            >
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                                style={column.style}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                                >
                                    {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
        .responsive-table {
          width: 100%;
          overflow-x: auto;
        }
        
        .hoverable-rows tr:hover {
          background-color: rgba(243, 244, 246, 0.7);
        }
        
        .bordered th, .bordered td {
          border: 1px solid #e5e7eb;
        }
        
        .compact th {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        
        .compact td {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
      `}</style>
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.node.isRequired,
        accessor: PropTypes.string.isRequired,
        render: PropTypes.func,
        className: PropTypes.string,
        cellClassName: PropTypes.string,
        style: PropTypes.object,
    })),
    data: PropTypes.arrayOf(PropTypes.object),
    responsive: PropTypes.bool,
    striped: PropTypes.bool,
    bordered: PropTypes.bool,
    hoverable: PropTypes.bool,
    compact: PropTypes.bool,
    className: PropTypes.string,
};

// Export all data display components
export default {
    PropertyStats,
    Badge,
    PriceDisplay,
    FeatureList,
    AddressDisplay,
    Gallery,
    ProgressBar,
    Rating,
    PropertyStatus,
    Table,
};