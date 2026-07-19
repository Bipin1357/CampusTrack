import React from 'react'

export default function StudentResults() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Academic Results</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">View your grades and performance reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-5">
             <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Semester {i}</p>
             <p className="text-2xl font-bold text-[var(--color-text-primary)]">SGPA: 3.{9-i}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-6 min-h-[400px] flex items-center justify-center">
         <p className="text-[var(--color-text-muted)]">Detailed Grade Sheet Table Placeholder</p>
      </div>
    </div>
  )
}
