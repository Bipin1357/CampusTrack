import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[var(--color-border)] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[var(--color-text-muted)]" strokeWidth={1.5} />
      </div>
      <h4 className="font-display font-semibold text-[var(--color-text-primary)] mb-1">{title}</h4>
      {description && <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  )
}
