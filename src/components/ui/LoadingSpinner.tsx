interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-white/60 border-t-white ${sizeClasses[size]}`}
      aria-label="Loading"
      role="status"
    />
  );
}
