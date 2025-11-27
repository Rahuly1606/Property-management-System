import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ size = 'md', fullScreen = false, message = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const LoadingSpinner = () => (
        <div className="relative" style={{ width: sizeClasses[size].split(' ')[0].replace('w-', '') + 'rem', height: sizeClasses[size].split(' ')[1].replace('h-', '') + 'rem' }}>
            {/* Outer Circle */}
            <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/30"
                style={{
                    borderTopColor: 'hsl(var(--primary))',
                    borderRightColor: 'hsl(var(--primary))',
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Inner Circle */}
            <motion.div
                className="absolute inset-2 rounded-full border-4 border-primary/20"
                style={{
                    borderBottomColor: 'hsl(var(--primary))',
                    borderLeftColor: 'hsl(var(--primary))',
                }}
                animate={{ rotate: -360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Center Dot */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
                style={{ transform: 'translate(-50%, -50%)' }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
            >
                <LoadingSpinner />
                {message && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-lg font-medium text-foreground"
                    >
                        {message}
                    </motion.p>
                )}

                {/* Animated dots */}
                <div className="flex gap-2 mt-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner />
            {message && (
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    );
};

export default Loading;
