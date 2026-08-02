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
  return <thead className="bg-[#111827] border-b border-white/[0.08]">{children}</thead>
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-white/[0.08] bg-[#1E293B]">{children}</tbody>
}

export function TR({ children, className, ...props }) {
  return (
    <tr className={cn('transition-colors hover:bg-[#10B981]/[0.05]', className)} {...props}>
      {children}
    </tr>
  )
}

export function TH({ children, sortable, sortDir, onSort, className }) {
  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={cn(
        'text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8] whitespace-nowrap',
        sortable && 'cursor-pointer select-none hover:text-[#CBD5E1]',
        className
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <span className="inline-flex flex-col -space-y-1">
            <ChevronUp className={cn('w-3 h-3', sortDir === 'asc' ? 'text-[#10B981]' : 'text-[#94A3B8]')} />
            <ChevronDown className={cn('w-3 h-3', sortDir === 'desc' ? 'text-[#10B981]' : 'text-[#94A3B8]')} />
          </span>
        )}
      </span>
    </th>
  )
}

export function TD({ children, className }) {
  return <td className={cn('px-4 py-3.5 align-middle', className)}>{children}</td>
}
