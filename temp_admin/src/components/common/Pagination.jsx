import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null

  const pages = []
  const window = 1
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
      {totalItems != null && (
        <p className="text-xs text-[var(--color-text-muted)]">
          Showing {Math.min((page - 1) * pageSize + 1, totalItems)}–{Math.min(page * pageSize, totalItems)} of {totalItems}
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-[var(--color-text-muted)]">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                'w-8 h-8 rounded-[var(--radius-sm)] text-xs font-medium transition-colors',
                p === page ? 'accent-gradient-bg text-white' : 'text-[var(--color-text-secondary)] hover:bg-white/5'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
