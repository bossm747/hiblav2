import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit,
  PlayCircle,
  PauseCircle,
  Package,
  Truck,
  LucideIcon,
} from 'lucide-react';

export type StatusType = 
  | 'approved' | 'success' | 'completed' | 'delivered' | 'paid'
  | 'pending' | 'processing' | 'awaiting'
  | 'rejected' | 'cancelled' | 'failed' | 'error'
  | 'draft' | 'inactive'
  | 'in-progress' | 'active' | 'running'
  | 'paused' | 'on-hold'
  | 'warning' | 'attention'
  | 'shipped' | 'in-transit';

interface StatusConfig {
  icon: LucideIcon;
  className: string;
  label?: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  // Success states
  approved: {
    icon: CheckCircle,
    className: 'badge-success',
    label: 'Approved',
  },
  success: {
    icon: CheckCircle,
    className: 'badge-success',
    label: 'Success',
  },
  completed: {
    icon: CheckCircle,
    className: 'badge-success',
    label: 'Completed',
  },
  delivered: {
    icon: CheckCircle,
    className: 'badge-success',
    label: 'Delivered',
  },
  paid: {
    icon: CheckCircle,
    className: 'badge-success',
    label: 'Paid',
  },
  
  // Pending states
  pending: {
    icon: Clock,
    className: 'badge-warning',
    label: 'Pending',
  },
  processing: {
    icon: Clock,
    className: 'badge-warning',
    label: 'Processing',
  },
  awaiting: {
    icon: Clock,
    className: 'badge-warning',
    label: 'Awaiting',
  },
  
  // Error states
  rejected: {
    icon: XCircle,
    className: 'badge-error',
    label: 'Rejected',
  },
  cancelled: {
    icon: XCircle,
    className: 'badge-error',
    label: 'Cancelled',
  },
  failed: {
    icon: XCircle,
    className: 'badge-error',
    label: 'Failed',
  },
  error: {
    icon: XCircle,
    className: 'badge-error',
    label: 'Error',
  },
  
  // Draft states
  draft: {
    icon: Edit,
    className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
    label: 'Draft',
  },
  inactive: {
    icon: Edit,
    className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
    label: 'Inactive',
  },
  
  // Active states
  'in-progress': {
    icon: PlayCircle,
    className: 'badge-info',
    label: 'In Progress',
  },
  active: {
    icon: PlayCircle,
    className: 'badge-info',
    label: 'Active',
  },
  running: {
    icon: PlayCircle,
    className: 'badge-info',
    label: 'Running',
  },
  
  // Paused states
  paused: {
    icon: PauseCircle,
    className: 'badge-pending',
    label: 'Paused',
  },
  'on-hold': {
    icon: PauseCircle,
    className: 'badge-pending',
    label: 'On Hold',
  },
  
  // Warning states
  warning: {
    icon: AlertTriangle,
    className: 'badge-warning',
    label: 'Warning',
  },
  attention: {
    icon: AlertTriangle,
    className: 'badge-warning',
    label: 'Attention',
  },
  
  // Shipping states
  shipped: {
    icon: Truck,
    className: 'badge-info',
    label: 'Shipped',
  },
  'in-transit': {
    icon: Truck,
    className: 'badge-info',
    label: 'In Transit',
  },
};

interface StatusBadgeProps {
  status: StatusType | string;
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
}

export function StatusBadge({ 
  status, 
  showIcon = true, 
  className = '',
  customLabel
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/[\s_]/g, '-') as StatusType;
  const config = statusConfigs[normalizedStatus];
  
  if (!config) {
    // Fallback for unknown statuses
    return (
      <Badge className={`bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800 ${className}`}>
        <Package className="h-3 w-3 mr-1" />
        {customLabel || status}
      </Badge>
    );
  }
  
  const Icon = config.icon;
  const label = customLabel || config.label || status;
  
  return (
    <Badge className={`${config.className} ${className}`}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {label}
    </Badge>
  );
}