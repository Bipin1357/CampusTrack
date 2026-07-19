import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchBar({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-[var(--color-border)] rounded-full py-2 pl-9 pr-4 text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-violet)] focus:bg-white/[0.07] transition-colors"
      />
    </div>
  )
}
