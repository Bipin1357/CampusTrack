import { cn } from '@/lib/utils'

const tones = {
  neutral: 'bg-white/8 text-[var(--color-text-secondary)] border-white/10',
  success: 'bg-[var(--color-success-soft)] text-emerald-300 border-emerald-500/20',
  warning: 'bg-[var(--color-warning-soft)] text-amber-300 border-amber-500/20',
  danger: 'bg-[var(--color-danger-soft)] text-rose-300 border-rose-500/20',
  info: 'bg-[var(--color-info-soft)] text-cyan-300 border-cyan-500/20',
  accent: 'bg-[var(--color-accent-soft)] text-violet-300 border-violet-500/20',
}

export default function Badge({ children, tone = 'neutral', dot = false, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        tones[tone],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-[var(--color-text-muted)]': tone === 'neutral',
        'bg-emerald-400': tone === 'success',
        'bg-amber-400': tone === 'warning',
        'bg-rose-400': tone === 'danger',
        'bg-cyan-400': tone === 'info',
        'bg-violet-400': tone === 'accent',
      })} />}
      {children}
    </span>
  )
}
