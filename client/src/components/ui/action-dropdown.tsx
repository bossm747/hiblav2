import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, LucideIcon } from 'lucide-react';

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void | Promise<void>;
  color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning';
  separator?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

interface ActionDropdownProps {
  actions: ActionItem[];
  trigger?: React.ReactNode;
  label?: string;
  align?: 'start' | 'center' | 'end';
}

export function ActionDropdown({ 
  actions, 
  trigger, 
  label = 'Actions',
  align = 'end' 
}: ActionDropdownProps) {
  const colorClasses = {
    default: '',
    primary: 'text-primary',
    secondary: 'text-secondary',
    destructive: 'text-destructive',
    success: 'text-green-600 dark:text-green-500',
    warning: 'text-yellow-600 dark:text-yellow-500',
  };

  const filteredActions = actions.filter(action => !action.hidden);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-9">
            {label}
            <MoreVertical className="h-4 w-4 ml-2" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {filteredActions.map((action, index) => {
          if (action.separator) {
            return <DropdownMenuSeparator key={`separator-${index}`} />;
          }

          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={`action-${index}`}
              onClick={action.onClick}
              disabled={action.disabled}
              className={colorClasses[action.color || 'default']}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}