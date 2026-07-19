import { useState, Fragment } from 'react'
import Card from '@/components/common/Card'
import { timeSlots, weekDays, timetableGrid, departmentOptions } from '@/data/timetableData'
import { Clock, MapPin } from 'lucide-react'

export default function Timetable() {
  const [dept, setDept] = useState(departmentOptions[0])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Timetable</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Weekly class schedule across departments</p>
        </div>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]"
        >
          {departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <Card className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2">
            <div />
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider pb-2">
                {day}
              </div>
            ))}

            {timeSlots.map((slot) => (
              <Fragment key={slot}>
                <div className="flex items-center justify-end pr-2 text-xs text-[var(--color-text-muted)] font-mono">
                  {slot}
                </div>
                {weekDays.map((day) => {
                  const entry = timetableGrid[day][slot]
                  return (
                    <div key={day + slot} className="min-h-[74px]">
                      {entry ? (
                        <div
                          className="h-full rounded-[var(--radius-sm)] p-2.5 border transition-colors hover:brightness-110 cursor-pointer"
                          style={{ background: `${entry.color}14`, borderColor: `${entry.color}33` }}
                        >
                          <p className="text-xs font-semibold leading-snug" style={{ color: entry.color }}>{entry.course}</p>
                          <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">{entry.faculty}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 inline-flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" /> {entry.room}
                          </p>
                        </div>
                      ) : (
                        <div className="h-full rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] flex items-center justify-center">
                          <span className="text-[10px] text-[var(--color-text-muted)]">Free</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
        <Clock className="w-3.5 h-3.5" /> All times shown in campus local time. Tap a slot to view full section details.
      </div>
    </div>
  )
}
