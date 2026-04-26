import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

const variants = {
  default: 'bg-muted/10 border-muted text-muted-foreground',
  success: 'bg-success/10 border-success text-success',
  warning: 'bg-warning/10 border-warning text-warning',
  destructive: 'bg-destructive/10 border-destructive text-destructive',
  primary: 'bg-primary/10 border-primary text-primary',
};

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
