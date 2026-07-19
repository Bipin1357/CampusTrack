import { UserPlus, Megaphone, GraduationCap, CalendarCheck, FileSpreadsheet, BarChart3 } from 'lucide-react'
import Card from '../common/Card'
import { recentActivity } from '@/data/dashboardData'

const icons = {
  enrollment: UserPlus, notice: Megaphone, faculty: GraduationCap,
  attendance: CalendarCheck, exam: FileSpreadsheet, report: BarChart3,
}
const tones = {
  enrollment: 'text-emerald-300 bg-[var(--color-success-soft)]',
  notice: 'text-violet-300 bg-[var(--color-accent-soft)]',
  faculty: 'text-cyan-300 bg-[var(--color-info-soft)]',
  attendance: 'text-amber-300 bg-[var(--color-warning-soft)]',
  exam: 'text-rose-300 bg-[var(--color-danger-soft)]',
  report: 'text-indigo-300 bg-[var(--color-accent-soft)]',
}

export default function ActivityTimeline() {
  return (
    <Card>
      <h3 className="font-display font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-1">
        {recentActivity.map((a, i) => {
          const Icon = icons[a.type]
          return (
            <div key={a.id} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tones[a.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-[var(--color-border)] my-1" />}
              </div>
              <div className="pb-5">
                <p className="text-sm text-[var(--color-text-primary)] leading-snug">{a.text}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{a.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
