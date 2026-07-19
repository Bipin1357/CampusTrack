import { cn } from '@/lib/utils'

export default function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer py-1">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>}
          {description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors shrink-0',
          checked ? 'accent-gradient-bg' : 'bg-white/10'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </label>
  )
}
