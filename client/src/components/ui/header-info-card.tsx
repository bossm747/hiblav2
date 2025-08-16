import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeaderInfoCardProps {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function HeaderInfoCard({
  icon: Icon,
  label,
  value,
  className = '',
  iconClassName = '',
  labelClassName = '',
  valueClassName = '',
}: HeaderInfoCardProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className={`flex items-center text-sm text-muted-foreground mb-1 ${labelClassName}`}>
        {Icon && <Icon className={`h-4 w-4 mr-1 ${iconClassName}`} />}
        {label}
      </div>
      <div className={`font-semibold ${valueClassName}`}>
        {value || 'N/A'}
      </div>
    </div>
  );
}