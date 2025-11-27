import React from 'react';
import PropTypes from 'prop-types';

/**
 * Skeleton Loader Components using Tailwind CSS for the PropertyHub design system
 * These components provide placeholder loading states for UI elements
 */

// Base Skeleton Component
const Skeleton = ({ className = '', ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded ${className}`}
            {...props}
        />
    );
};

Skeleton.propTypes = {
    className: PropTypes.string,
};

// Property Card Skeleton
export const PropertyCardSkeleton = ({ className = '' }) => {
    return (
        <div
            className={`bg-white rounded shadow overflow-hidden ${className}`}
            aria-busy="true"
            aria-label="Loading property card"
        >
            {/* Image Placeholder - 3:2 ratio as in the Card component */}
            <div className="relative w-full pb-[66.67%]">
                <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
            </div>

            <div className="p-4">
                {/* Title & Price Row */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-2/3">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Essentials row */}
                <div className="mb-4 flex space-x-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-10 w-1/2" />
                </div>
            </div>
        </div>
    );
};

PropertyCardSkeleton.propTypes = {
    className: PropTypes.string,
};

// Grid of Property Card Skeletons
export const PropertyGridSkeleton = ({ count = 6, columns = 3, className = '' }) => {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 ${className}`}
            aria-busy="true"
            aria-label="Loading property grid"
        >
            {Array.from({ length: count }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
            ))}
        </div>
    );
};

PropertyGridSkeleton.propTypes = {
    count: PropTypes.number,
    columns: PropTypes.number,
    className: PropTypes.string,
};

// Property Detail Skeleton
export const PropertyDetailSkeleton = ({ className = '' }) => {
    return (
        <div
            className={`${className}`}
            aria-busy="true"
            aria-label="Loading property details"
        >
            {/* Image Gallery Placeholder */}
            <div className="relative w-full h-64 md:h-96 mb-6">
                <Skeleton className="absolute inset-0 w-full h-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Property Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Price */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-32" />
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton key={index} className="h-8 w-full" />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <div className="grid grid-cols-2 gap-2">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Skeleton key={index} className="h-5 w-full" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Contact Card */}
                    <div className="bg-white rounded shadow p-4">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Map */}
                    <div className="relative w-full h-48">
                        <Skeleton className="absolute inset-0 w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

PropertyDetailSkeleton.propTypes = {
    className: PropTypes.string,
};

// Profile Skeleton
export const ProfileSkeleton = ({ className = '' }) => {
    return (
        <div
            className={`bg-white rounded shadow p-6 ${className}`}
            aria-busy="true"
            aria-label="Loading profile"
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex justify-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full max-w-md" />

                    <div className="pt-4 flex gap-3">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                <Skeleton className="h-6 w-40" />

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>

                <div className="pt-4">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
};

ProfileSkeleton.propTypes = {
    className: PropTypes.string,
};

// Table Skeleton
export const TableSkeleton = ({
    rows = 5,
    columns = 4,
    showHeader = true,
    className = ''
}) => {
    return (
        <div
            className={`bg-white rounded shadow overflow-hidden ${className}`}
            aria-busy="true"
            aria-label="Loading table"
        >
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {showHeader && (
                        <thead className="bg-gray-50">
                            <tr>
                                {Array.from({ length: columns }).map((_, index) => (
                                    <th key={index} className="px-6 py-3">
                                        <Skeleton className="h-5 w-full max-w-[120px]" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}

                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        <Skeleton
                                            className={`h-4 ${colIndex === 0 ? 'w-1/2' : 'w-full max-w-[150px]'
                                                }`}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

TableSkeleton.propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
    showHeader: PropTypes.bool,
    className: PropTypes.string,
};

// Form Skeleton
export const FormSkeleton = ({
    fields = 4,
    columns = 1,
    withButton = true,
    className = ''
}) => {
    return (
        <div
            className={`space-y-6 ${className}`}
            aria-busy="true"
            aria-label="Loading form"
        >
            <div className={`grid grid-cols-1 ${columns > 1 ? `md:grid-cols-${columns}` : ''} gap-6`}>
                {Array.from({ length: fields }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>

            {withButton && (
                <div className="pt-4">
                    <Skeleton className="h-10 w-32" />
                </div>
            )}
        </div>
    );
};

FormSkeleton.propTypes = {
    fields: PropTypes.number,
    columns: PropTypes.number,
    withButton: PropTypes.bool,
    className: PropTypes.string,
};

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = ({ count = 4, className = '' }) => {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(count, 4)} gap-6 ${className}`}
            aria-busy="true"
            aria-label="Loading dashboard stats"
        >
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded shadow p-6">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-9 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ))}
        </div>
    );
};

DashboardStatsSkeleton.propTypes = {
    count: PropTypes.number,
    className: PropTypes.string,
};

export default {
    Skeleton,
    PropertyCardSkeleton,
    PropertyGridSkeleton,
    PropertyDetailSkeleton,
    ProfileSkeleton,
    TableSkeleton,
    FormSkeleton,
    DashboardStatsSkeleton,
};