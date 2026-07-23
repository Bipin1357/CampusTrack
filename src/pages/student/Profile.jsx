import React from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const profile = currentUser?.studentProfile;

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
             <h2 className="text-xl font-bold font-display text-[var(--color-text-primary)]">{profile?.full_name || currentUser?.name || 'Not Available'}</h2>
             <p className="text-sm text-[var(--color-text-secondary)] mt-1">{currentUser?.email || 'Not Available'}</p>
             <div className="mt-4 flex flex-wrap gap-2">
                 <span className="px-3 py-1 rounded-full bg-[var(--color-accent-soft)] text-white text-xs font-medium">{profile?.department || 'Not Available'}</span>
                 <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-medium">{profile?.semester ? `Semester ${String(profile.semester).replace(/^Semester\s*/i, '').trim()}` : 'Semester Not Available'}</span>
                 <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-medium">Section {profile?.section || 'Not Available'}</span>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-6">
             <h3 className="text-lg font-semibold font-display mb-4 text-[var(--color-text-primary)]">Personal Information</h3>
             <div className="space-y-3">
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Full Name</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.full_name || currentUser?.name || 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Email</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{currentUser?.email || 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Phone</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.phone || 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Date of Birth</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.dob || 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Gender</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.gender || 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Department</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.department || 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Semester</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.semester ? `Semester ${String(profile.semester).replace(/^Semester\s*/i, '').trim()}` : 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Section</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.section || 'Not Available'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm text-[var(--color-text-secondary)]">Student ID</span>
                     <span className="text-sm font-medium text-[var(--color-text-primary)]">{profile?.student_id || 'Not Available'}</span>
                 </div>
             </div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-6 h-64 flex items-center justify-center">
             <p className="text-[var(--color-text-muted)]">Emergency Contacts Placeholder</p>
          </div>
      </div>
    </div>
  )
}
