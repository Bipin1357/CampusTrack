import { Link } from 'react-router-dom'
import { UserPlus, Building2, CalendarClock, BarChart3 } from 'lucide-react'
import Card from '../common/Card'
import { quickActions } from '@/data/dashboardData'

const icons = { UserPlus, Building2, CalendarClock, BarChart3 }

export default function QuickActions() {
  return (
    <Card>
      <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((a) => {
          const Icon = icons[a.icon]
          return (
            <Link
              key={a.id}
              to={a.to}
              className="flex flex-col items-start gap-3 p-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/[0.02] hover:bg-white/5 hover:border-[var(--color-border-strong)] transition-colors group"
            >
              <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] flex items-center justify-center group-hover:accent-gradient-bg transition-colors">
                <Icon className="w-4.5 h-4.5 text-violet-300 group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-white transition-colors">{a.label}</span>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}
