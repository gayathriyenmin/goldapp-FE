import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-background border border-white/10 rounded-lg 
            text-text-light placeholder:text-slate-600 focus:outline-none 
            focus:ring-2 focus:ring-primary/50 focus:border-primary 
            transition-all duration-200
            ${error ? 'border-danger focus:ring-danger/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
