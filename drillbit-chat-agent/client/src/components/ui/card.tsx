import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
   className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
   <div className={`md:rounded-lg shadow ${className}`} {...props}>
       {children}
   </div>
);

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
   className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => (
   <div className={`${className}`} {...props}>
       {children}
   </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
   children: React.ReactNode;
   className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => (
   <h3 className={`text-lg font-semibold ${className}`} {...props}>
       {children}
   </h3>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
   className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '', ...props }) => (
   <div className={`${className}`} {...props}>
       {children}
   </div>
);

export { Card, CardHeader, CardTitle, CardContent };