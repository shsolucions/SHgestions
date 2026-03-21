import React from 'react';
import { useToast } from '@/context/ToastContext';

const typeStyles: Record<string, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-brand-600 text-white',
};

const typeIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-80 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`animate-slide-down rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 ${typeStyles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          <span className="text-lg font-bold flex-shrink-0">{typeIcons[toast.type]}</span>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
