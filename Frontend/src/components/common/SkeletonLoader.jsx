import React from 'react';
import { motion } from 'framer-motion';

export const PropertyCardSkeleton = () => (
    <div className="property-card overflow-hidden bg-white rounded-lg shadow-md">
        <div className="relative">
            {/* Image Skeleton */}
            <motion.div
                className="w-full h-48"
                style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%'
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>

        <div className="p-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Title Skeleton */}
            <motion.div
                className="h-6 rounded"
                style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    width: '75%'
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Location Skeleton */}
            <motion.div
                className="h-4 rounded"
                style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    width: '50%'
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.1
                }}
            />

            {/* Price Skeleton */}
            <motion.div
                className="h-8 rounded"
                style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    width: '40%'
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.2
                }}
            />

            {/* Details Skeleton */}
            <div style={{ display: 'flex', gap: '16px', paddingTop: '8px' }}>
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="h-4 rounded"
                        style={{
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            width: '60px'
                        }}
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.3 + i * 0.1
                        }}
                    />
                ))}
            </div>
        </div>
    </div>
);

export const DashboardCardSkeleton = () => (
    <div className="card p-6 bg-white rounded-lg shadow-md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <motion.div
                    className="h-4 rounded"
                    style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        width: '100px'
                    }}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="h-5 w-5 rounded"
                    style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        width: '20px',
                        height: '20px'
                    }}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.1
                    }}
                />
            </div>

            {/* Value */}
            <motion.div
                className="h-8 rounded"
                style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    width: '60%'
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.2
                }}
            />
        </div>
    </div>
);

export const TableRowSkeleton = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
        {[1, 2, 3, 4].map((i) => (
            <motion.div
                key={i}
                className="h-4 rounded"
                style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    flex: 1
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.1
                }}
            />
        ))}
    </div>
);

export default {
    PropertyCardSkeleton,
    DashboardCardSkeleton,
    TableRowSkeleton
};
