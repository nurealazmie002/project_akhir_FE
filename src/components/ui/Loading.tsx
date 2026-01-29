import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'fullscreen';
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  className,
  size = 'md',
  text,
  variant = 'spinner',
  color = 'currentColor',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-3',
    variant === 'fullscreen' ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' : '',
    className
  );

  if (variant === 'spinner' || variant === 'fullscreen') {
    return (
      <div className={containerClasses}>
        <motion.div
          className={cn(
            'border-2 border-current border-t-transparent rounded-full',
            sizeClasses[size],
            color !== 'currentColor' ? color : ''
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground font-medium"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={containerClasses}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn('rounded-full bg-current', size === 'sm' ? 'w-1.5 h-1.5' : 'w-3 h-3', color !== 'currentColor' ? color : '')}
              animate={{
                y: ['0%', '-50%', '0%'],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
        {text && <p className="text-sm text-muted-foreground font-medium">{text}</p>}
      </div>
    );
  }

  return null;
};

export default Loading;
