import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import Card from './Card'

export default function StatCard({ label, value, unit, delta, trend, sparkline = [], icon: Icon }) {
  const max = Math.max(...sparkline, 1)
  const min = Math.min(...sparkline, 0)
  const range = max - min || 1
  const points = sparkline
    .map((v, i) => `${(i / (sparkline.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(' ')

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5">{label}</p>
          <p className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            {typeof value === 'number' ? formatNumber(value) : value}
            {unit && <span className="text-base text-[var(--color-text-secondary)]">{unit}</span>}
          </p>
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-violet-300" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        {delta != null && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(delta)}%
          </span>
        )}
        {sparkline.length > 0 && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-20 h-8">
            <polyline
              points={points}
              fill="none"
              stroke={trend === 'up' ? '#34d399' : '#fb7185'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>
    </Card>
  )
}
