import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700
        ${hoverable ? 'hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
