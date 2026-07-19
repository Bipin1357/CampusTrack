import { cn } from '@/lib/utils'

export default function Input({ label, icon: Icon, className, containerClassName, ...props }) {
  return (
    <label className={cn('block', containerClassName)}>
      {label && <span className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</span>}
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />}
        <input
          className={cn(
            'w-full bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-violet)] focus:bg-white/[0.07] transition-colors',
            Icon ? 'pl-9 pr-3' : 'px-3',
            className
          )}
          {...props}
        />
      </div>
    </label>
  )
}
