import { Users, GraduationCap, Calendar } from 'lucide-react'
import Card from '../common/Card'
import Avatar from '../common/Avatar'

export default function DepartmentCard({ department }) {
  return (
    <Card hover className="relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${department.color}, transparent)` }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center font-display font-semibold text-sm"
          style={{ background: `${department.color}22`, color: department.color }}
        >
          {department.code}
        </div>
        <span className="text-xs text-[var(--color-text-muted)] inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Est. {department.established}
        </span>
      </div>
      <h3 className="font-display font-semibold text-[var(--color-text-primary)] mb-1">{department.name}</h3>
      <div className="flex items-center gap-2 mb-4">
        <Avatar name={department.head} size="sm" />
        <div className="min-w-0">
          <p className="text-xs text-[var(--color-text-secondary)] truncate">{department.head}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">Department Head</p>
        </div>
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-[var(--color-border)]">
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
          <GraduationCap className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {department.faculty} Faculty
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
          <Users className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {department.students} Students
        </span>
      </div>
    </Card>
  )
}
