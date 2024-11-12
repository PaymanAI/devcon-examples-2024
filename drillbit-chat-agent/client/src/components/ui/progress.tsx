import React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
   value: number;
   className?: string;
   /** Optional color variants */
   variant?: 'default' | 'success' | 'warning' | 'error';
   /** Optional size variants */
   size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
   default: 'bg-primary',
   success: 'bg-green-500',
   warning: 'bg-yellow-500',
   error: 'bg-red-500'
} as const;

const sizeClasses = {
   sm: 'h-2',
   md: 'h-4',
   lg: 'h-6'
} as const;

const Progress: React.FC<ProgressProps> = ({ 
   value, 
   className = '', 
   variant = 'default',
   size = 'md',
   ...props 
}) => {
   // Ensure value is between 0 and 100
   const clampedValue = Math.max(0, Math.min(100, value));

   return (
       <div
           role="progressbar"
           aria-valuemin={0}
           aria-valuemax={100}
           aria-valuenow={clampedValue}
           className={`
               relative 
               w-full 
               overflow-hidden 
               rounded-full 
               bg-secondary
               ${sizeClasses[size]}
               ${className}
           `}
           {...props}
       >
           <div
               className={`
                   h-full 
                   w-full 
                   flex-1 
                   transition-all 
                   duration-300 
                   ease-in-out
                   ${variantClasses[variant]}
               `}
               style={{ transform: `translateX(-${100 - clampedValue}%)` }}
           />
       </div>
   );
};

export { Progress };