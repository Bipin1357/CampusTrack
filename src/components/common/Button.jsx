import { cn } from '@/lib/utils'

const variants = {
  primary: 'accent-gradient-bg text-white shadow-lg shadow-indigo-950/40 hover:brightness-110',
  secondary: 'bg-white/5 text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-white/10 hover:border-[var(--color-border-strong)]',
  ghost: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5',
  danger: 'bg-[var(--color-danger-soft)] text-rose-300 border border-rose-500/20 hover:bg-rose-500/20',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-[var(--radius-sm)] transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" strokeWidth={2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" strokeWidth={2} />}
    </button>
  )
}
