import Card from '../common/Card'
import { systemStatus } from '@/data/dashboardData'
import { cn } from '@/lib/utils'

const statusConfig = {
  operational: { label: 'Operational', color: 'bg-emerald-400', text: 'text-emerald-300' },
  degraded: { label: 'Degraded', color: 'bg-amber-400', text: 'text-amber-300' },
  outage: { label: 'Outage', color: 'bg-rose-400', text: 'text-rose-300' },
}

export default function SystemStatus() {
  return (
    <Card>
      <h3 className="font-display font-semibold mb-4">System Status</h3>
      <div className="space-y-3">
        {systemStatus.map((s) => {
          const cfg = statusConfig[s.status]
          return (
            <div key={s.id} className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">{s.name}</span>
              <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', cfg.text)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', cfg.color, s.status === 'operational' && 'animate-pulse')} />
                {cfg.label}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
