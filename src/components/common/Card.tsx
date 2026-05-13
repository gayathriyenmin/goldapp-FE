import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  headerAction 
}) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className="text-xl font-bold text-text-light">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
