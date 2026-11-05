import { forwardRef, type ReactNode, useRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive' | 'hero';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'shine' | 'magnetic' | 'none';
  clickable?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-white/70 dark:bg-slate-900/70',
  elevated: 'bg-white/80 dark:bg-slate-900/80 shadow-xl',
  outlined: 'bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-700/50',
  interactive: 'bg-white/70 dark:bg-slate-900/70 cursor-pointer',
  hero: 'bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-slate-800/30 dark:via-slate-900/20 dark:to-slate-900/10',
};

const blurStyles = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const hoverStyles = {
  lift: 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-out',
  glow: 'hover:shadow-[0_0_30px_-5px_rgba(30,98,254,0.4)] transition-all duration-300',
  scale: 'hover:scale-[1.02] transition-transform duration-200 ease-out',
  shine: 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-500',
  magnetic: 'transition-all duration-300 ease-out',
  none: '',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = 'default',
      blur = 'md',
      opacity,
      border = false,
      hoverEffect = 'lift',
      clickable = false,
      className = '',
      style,
      onClick,
      ...props
    },
    _ref
  ) => {
    const magneticRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverEffect !== 'magnetic' || !magneticRef.current) return;
      const rect = magneticRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      magneticRef.current.style.transform = `
        perspective(1000px)
        rotateY(${x * 0.05}deg)
        rotateX(${-y * 0.05}deg)
        translateZ(10px)
      `;
    };

    const handleMouseLeave = () => {
      if (magneticRef.current) {
        magneticRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
      }
    };

    const baseStyles = `
      relative rounded-2xl
      ${variantStyles[variant]}
      ${blurStyles[blur]}
      ${hoverStyles[hoverEffect]}
      ${border ? 'border border-white/20 dark:border-slate-700/30' : ''}
      ${clickable ? 'cursor-pointer' : ''}
    `;

    return (
      <motion.div
        ref={magneticRef}
        {...props}
        className={cn(baseStyles, className)}
        style={{
          ...style,
          background: variant === 'hero'
            ? undefined
            : style?.background,
          opacity: opacity ?? 1,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileTap={clickable ? { scale: 0.98 } : undefined}
        whileHover={hoverEffect === 'lift' ? { y: -4 } : hoverEffect === 'scale' ? { scale: 1.02 } : undefined}
      >
        {/* Shine overlay for shine effect */}
        {hoverEffect === 'shine' && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full" />
          </div>
        )}

        {/* Inner glow for elevated variant */}
        {variant === 'elevated' && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        )}

        {/* Subtle border highlight */}
        {border && (
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
        )}

        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// Specialized glass components
export const GlassCardElevated = (props: Omit<GlassCardProps, 'variant'>) => (
  <GlassCard variant="elevated" {...props} />
);

export const GlassCardOutlined = (props: Omit<GlassCardProps, 'variant'>) => (
  <GlassCard variant="outlined" {...props} />
);

export const GlassCardInteractive = (props: Omit<GlassCardProps, 'variant' | 'hoverEffect'> & { hoverEffect?: GlassCardProps['hoverEffect'] }) => (
  <GlassCard variant="interactive" hoverEffect={props.hoverEffect || 'lift'} clickable {...props} />
);

export const GlassCardHero = (props: Omit<GlassCardProps, 'variant'>) => (
  <GlassCard variant="hero" blur="xl" {...props} />
);

// Glass morphism container for sections
export interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'lg' | 'xl' | '2xl' | 'full';
  gradient?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const roundedStyles = {
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
  full: 'rounded-full',
};

export function GlassContainer({
  children,
  className = '',
  padding = 'md',
  rounded = 'xl',
  gradient = false,
}: GlassContainerProps) {
  return (
    <div
      className={cn(
        'relative',
        'bg-white/60 dark:bg-slate-900/60',
        'backdrop-blur-xl',
        'border border-white/20 dark:border-slate-700/30',
        'shadow-2xl',
        paddingStyles[padding],
        roundedStyles[rounded],
        gradient && 'bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-slate-800/30 dark:via-slate-900/20 dark:to-slate-900/10',
        className
      )}
    >
      {gradient && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-primary/10 via-transparent to-success/10 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Glass button component
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: GlassButtonProps) {
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/30',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-primary hover:bg-primary/10',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3 text-lg gap-2.5',
    xl: 'px-10 py-4 text-xl gap-3',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center font-bold',
        'rounded-full',
        'backdrop-blur-md',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </button>
  );
}

// Glass input component
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function GlassInput({
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  className = '',
  id,
  ...props
}: GlassInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {iconLeft}
          </div>
        )}
        <input
          id={inputId}
          {...props}
          className={cn(
            'w-full',
            'bg-white/60 dark:bg-slate-800/60',
            'backdrop-blur-md',
            'border border-white/30 dark:border-slate-700/50',
            'rounded-xl',
            'text-slate-900 dark:text-white',
            'placeholder:text-slate-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent',
            'disabled:bg-slate-100/50 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger/50',
            iconLeft && 'pl-10',
            iconRight && 'pr-10',
            'py-3 px-4',
            className
          )}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {iconRight}
          </div>
        )}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-danger">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-danger flex items-center gap-1">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
}

// Glass modal/overlay
export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function GlassModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
}: GlassModalProps) {
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className={cn(
          'relative w-full',
          'bg-white/95 dark:bg-slate-900/95',
          'backdrop-blur-xl',
          'rounded-3xl',
          'border border-white/20 dark:border-slate-700/30',
          'shadow-2xl',
          'overflow-hidden',
          sizeStyles[size],
          className
        )}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-700/30">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// Glass tooltip
export interface GlassTooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function GlassTooltip({
  children,
  content,
  position = 'top',
  delay = 200,
}: GlassTooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => setShow(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setShow(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-primary',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-primary',
    left: 'right-full top-1/2 -translate-y-1/2 border-r-primary',
    right: 'left-full top-1/2 -translate-y-1/2 border-l-primary',
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0, x: position === 'left' ? 4 : position === 'right' ? -4 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            'absolute z-50',
            'bg-slate-900/95 dark:bg-slate-900/95',
            'backdrop-blur-xl',
            'border border-white/20 dark:border-slate-700/30',
            'rounded-lg',
            'px-3 py-2',
            'text-sm font-medium text-white',
            'shadow-xl',
            'whitespace-nowrap',
            positions[position]
          )}
        >
          {content}
          <div
            className={cn(
              'absolute w-0 h-0 border-4 border-transparent',
              arrows[position]
            )}
          />
        </motion.div>
      )}
    </div>
  );
}