import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white shadow-sm shadow-emerald-950/20',
  secondary: 'bg-[#1E293B] text-[var(--color-text-primary)] border border-white/10 hover:bg-[#334155] hover:border-white/20',
  ghost: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5',
  danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/20 hover:bg-rose-500/25',
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
