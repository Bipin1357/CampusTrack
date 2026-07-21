import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Pagination({ page, totalPages, onChange, totalItems, pageSize, onPageSizeChange, pageSizeOptions = [10, 25, 50] }) {
  if (totalItems === 0) return null;
  // Always render pagination if onPageSizeChange is provided, otherwise only if totalPages > 1
  if (totalPages <= 1 && !onPageSizeChange) return null

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
      <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
        {totalItems != null && (
          <p>
            Showing {Math.min((page - 1) * pageSize + 1, totalItems)}–{Math.min(page * pageSize, totalItems)} of {totalItems}
          </p>
        )}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-[var(--color-background)] border border-[var(--color-border)] rounded px-1 py-0.5 text-xs text-[var(--color-text-primary)] focus:outline-none"
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>
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
