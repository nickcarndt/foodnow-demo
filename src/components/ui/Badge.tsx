import type { ReactNode } from 'react';

interface BadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  children: ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  const colors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {children}
    </span>
  );
}
