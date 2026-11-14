import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald' | 'blue' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

/**
 * Reusable Badge for Categories, Statuses, and Qualifications
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'amber',
  size = 'md',
  pulse = false,
}) => {
  const variantStyles = {
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
};

