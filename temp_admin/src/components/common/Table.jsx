import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown } from 'lucide-react'

export function Table({ children, className }) {
  return (
    <div className="overflow-x-auto scrollbar-none">
      <table className={cn('w-full text-sm border-collapse', className)}>{children}</table>
    </div>
  )
}

export function THead({ children }) {
  return <thead className="border-b border-[var(--color-border)]">{children}</thead>
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-[var(--color-border)]">{children}</tbody>
}

export function TR({ children, className, ...props }) {
  return (
    <tr className={cn('transition-colors hover:bg-white/[0.03]', className)} {...props}>
      {children}
    </tr>
  )
}

export function TH({ children, sortable, sortDir, onSort, className }) {
  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={cn(
        'text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] whitespace-nowrap',
        sortable && 'cursor-pointer select-none hover:text-[var(--color-text-secondary)]',
        className
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <span className="inline-flex flex-col -space-y-1">
            <ChevronUp className={cn('w-3 h-3', sortDir === 'asc' ? 'text-violet-400' : 'text-[var(--color-text-muted)]')} />
            <ChevronDown className={cn('w-3 h-3', sortDir === 'desc' ? 'text-violet-400' : 'text-[var(--color-text-muted)]')} />
          </span>
        )}
      </span>
    </th>
  )
}

export function TD({ children, className }) {
  return <td className={cn('px-4 py-3.5 align-middle', className)}>{children}</td>
}
