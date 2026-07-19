import React from 'react'
import { User } from 'lucide-react'

export default function StudentProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your personal and academic information.</p>
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
         <div className="w-24 h-24 rounded-2xl accent-gradient-bg flex items-center justify-center shrink-0">
             <User className="w-10 h-10 text-white" />
         </div>
         <div>
             <h2 className="text-xl font-bold font-display text-[var(--color-text-primary)]">Student Name Placeholder</h2>
             <p className="text-sm text-[var(--color-text-secondary)] mt-1">student@college.edu</p>
             <div className="mt-4 flex flex-wrap gap-2">
                 <span className="px-3 py-1 rounded-full bg-[var(--color-accent-soft)] text-white text-xs font-medium">B.Tech Computer Science</span>
                 <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-medium">Semester 6</span>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-6 h-64 flex items-center justify-center">
             <p className="text-[var(--color-text-muted)]">Personal Details Form Placeholder</p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-6 h-64 flex items-center justify-center">
             <p className="text-[var(--color-text-muted)]">Emergency Contacts Placeholder</p>
          </div>
      </div>
    </div>
  )
}
