import Card from '../common/Card'
import { upcomingEvents } from '@/data/dashboardData'
import { formatDate } from '@/lib/utils'
import { MapPin, Clock } from 'lucide-react'

export default function UpcomingEvents() {
  return (
    <Card>
      <h3 className="font-display font-semibold mb-4">Upcoming Events</h3>
      <div className="space-y-3">
        {upcomingEvents.map((e) => {
          const d = new Date(e.date)
          return (
            <div key={e.id} className="flex gap-3 items-start">
              <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--color-border)] flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-violet-300 uppercase leading-none">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-sm font-semibold leading-none mt-0.5">{d.getDate()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{e.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
                  <span className="inline-flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" />{e.location}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
