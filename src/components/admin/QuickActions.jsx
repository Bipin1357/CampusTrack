import { Link } from 'react-router-dom'
import { UserPlus, BookPlus, Building2, CalendarPlus, ClipboardCheck } from 'lucide-react'
import Card from '../common/Card'

const actionItems = [
  { id: 'qa-add-student', label: 'Add Student', icon: UserPlus, to: '/admin/students' },
  { id: 'qa-add-course', label: 'Add Course', icon: BookPlus, to: '/admin/courses' },
  { id: 'qa-add-dept', label: 'Add Department', icon: Building2, to: '/admin/departments' },
  { id: 'qa-create-timetable', label: 'Create Timetable', icon: CalendarPlus, to: '/admin/timetable' },
  { id: 'qa-take-attendance', label: 'Take Attendance', icon: ClipboardCheck, to: '/admin/attendance' },
]

export default function QuickActions() {
  return (
    <Card className="space-y-4">
      <div className="pb-2 border-b border-[var(--color-border)]">
        <h3 className="font-display font-semibold text-lg text-white">Quick Actions</h3>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Frequent administrative shortcuts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {actionItems.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.id}
              to={action.to}
              className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/[0.02] hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-200 shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-white transition-colors block truncate">
                  {action.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}
