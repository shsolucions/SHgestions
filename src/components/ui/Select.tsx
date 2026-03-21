import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-3.5 py-2.5 rounded-xl border text-sm appearance-none
          bg-white dark:bg-surface-800
          border-surface-300 dark:border-surface-600
          text-surface-900 dark:text-surface-100
          focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500
          transition-colors duration-150
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
