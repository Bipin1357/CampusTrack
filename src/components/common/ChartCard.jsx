import { cn } from '@/lib/utils'
import Card from './Card'
import { MoreHorizontal } from 'lucide-react'

export default function ChartCard({ title, subtitle, children, action, className, height = 'h-72' }) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-[var(--color-text-primary)]">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>
        {action ?? (
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className={cn('w-full', height)}>{children}</div>
    </Card>
  )
}
