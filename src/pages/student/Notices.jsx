import React from 'react'

export default function StudentNotices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Campus Notices</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Stay updated with latest announcements.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-5 hover:border-[var(--color-border-hover)] transition-colors cursor-pointer">
             <div className="flex items-center justify-between mb-2">
                 <span className="px-3 py-1 rounded-full bg-[var(--color-accent-soft)] text-white text-xs font-medium">Important</span>
                 <span className="text-xs text-[var(--color-text-muted)]">2 days ago</span>
             </div>
             <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Notice Title Placeholder {i}</h3>
             <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2">
                 This is a brief summary of the notice. It contains information that is relevant to students. Click to read the full details of this announcement.
             </p>
          </div>
        ))}
      </div>
    </div>
  )
}
