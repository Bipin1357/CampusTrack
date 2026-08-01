import { Users, BookOpen, Calendar, Edit2, Trash2 } from 'lucide-react'
import Card from '../common/Card'

export default function DepartmentCard({ department, onEdit, onDelete }) {
  if (!department) return null;

  const color = department.color || '#6366f1';
  const name = department.name || 'Unnamed Department';
  const code = department.code || 'N/A';
  const description = department.description || '';
  const studentCount = department.student_count ?? 0;
  const courseCount = department.course_count ?? 0;

  const createdDate = department.created_at
    ? new Date(department.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <Card hover className="relative overflow-hidden flex flex-col justify-between h-full group">
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      
      <div>
        <div className="flex items-start justify-between mb-3">
          <div
            className="px-2.5 py-1 rounded-[var(--radius-sm)] font-display font-semibold text-xs border border-white/10"
            style={{ background: `${color}22`, color: color }}
          >
            {code}
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(department)}
                className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 transition-colors"
                title="Edit Department"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(department)}
                className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Department"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <h3 className="font-display font-semibold text-base text-[var(--color-text-primary)] mb-1">
          {name}
        </h3>

        {description && (
          <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-3">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-[var(--color-border)] mt-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="w-7 h-7 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)] font-medium">Students</p>
              <p className="text-sm font-semibold text-white">{studentCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="w-7 h-7 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)] font-medium">Courses</p>
              <p className="text-sm font-semibold text-white">{courseCount}</p>
            </div>
          </div>
        </div>

        {createdDate && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
            <Calendar className="w-3 h-3 text-[var(--color-text-muted)]" />
            <span>Created {createdDate}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
