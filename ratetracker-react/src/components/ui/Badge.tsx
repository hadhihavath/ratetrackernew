import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-bg-subtle text-text-secondary border border-border-subtle',
      success: 'bg-success-bg text-success border border-success-border',
      danger: 'bg-danger-bg text-danger border border-danger-border',
      warning: 'bg-warning-bg text-warning border border-warning-border',
      primary: 'bg-primary-light text-primary border border-primary/20',
      outline: 'bg-transparent text-text-secondary border border-border-subtle',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-bold rounded-full border',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'