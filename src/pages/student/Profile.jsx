import React from 'react';
import { User, CheckCircle2, Circle, Mail, GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAcademicRecords } from '../../hooks/useAcademicRecords';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import Badge from '../../components/common/Badge';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const profile = currentUser?.studentProfile;
  const { stats } = useAcademicRecords(profile?.id);
  const completion = useProfileCompletion();

  // Student data points
  const fullName = profile?.full_name || currentUser?.name || 'Not Available';
  const email = currentUser?.email || 'Not Available';
  const phone = profile?.phone || '';
  const dob = profile?.dob || '';
  const gender = profile?.gender || '';
  const department = profile?.department || '';
  const semester = profile?.semester ? String(profile.semester).replace(/^Semester\s*/i, '').trim() : '';
  const section = profile?.section || '';
  const studentId = profile?.student_id || '';

  // Synchronized dynamic academic values from database
  const cgpa = stats.completedSemesters > 0 ? stats.cgpa : 'N/A';
  const creditsEarned = stats.totalCredits;

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-purple-400" />
          My Profile
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          View and manage your personal details and academic record.
        </p>
      </div>

      {/* Header Overview Card */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[24px] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden backdrop-blur-xl shadow-xl hover:border-purple-500/30 transition-all duration-300">
        {/* Glow effect background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 relative">
          <User className="w-12 h-12 text-white" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[var(--color-bg-secondary)] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold font-display text-white truncate">{fullName}</h2>
            <Badge tone="accent">Student</Badge>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-purple-400" />
            {email}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {department && (
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {department}
              </span>
            )}
            {semester && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-medium">
                Semester {semester}
              </span>
            )}
            {section && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-medium">
                Section {section}
              </span>
            )}
            {studentId && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-mono">
                ID: {studentId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Balanced Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on LG): Personal & Academic Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[24px] p-6 hover:border-purple-500/30 transition-all duration-300 space-y-4">
            <h3 className="text-lg font-semibold font-display text-white border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Full Name</span>
                <span className="text-sm font-medium text-white">{fullName}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Email Address</span>
                <span className="text-sm font-medium text-white truncate block">{email}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Phone Number</span>
                <span className="text-sm font-medium text-white">{phone || 'Not Available'}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Date of Birth</span>
                <span className="text-sm font-medium text-white">{dob || 'Not Available'}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl sm:col-span-2">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Gender</span>
                <span className="text-sm font-medium text-white">{gender || 'Not Available'}</span>
              </div>
            </div>
          </div>

          {/* Academic Information Card (Synchronized CGPA & Credits, NO Advisor field) */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[24px] p-6 hover:border-purple-500/30 transition-all duration-300 space-y-4">
            <h3 className="text-lg font-semibold font-display text-white border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              Academic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Department</span>
                <span className="text-sm font-medium text-white">{department || 'Not Available'}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Semester</span>
                <span className="text-sm font-medium text-white">
                  {semester ? `Semester ${semester}` : 'Not Available'}
                </span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Section</span>
                <span className="text-sm font-medium text-white">{section || 'Not Available'}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Student ID / Roll No</span>
                <span className="text-sm font-mono font-medium text-white">{studentId || 'Not Available'}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Calculated CGPA</span>
                <span className="text-sm font-semibold text-emerald-400">{cgpa}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Credits Earned</span>
                <span className="text-sm font-medium text-purple-300">{creditsEarned} Credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col on LG): Dynamic Shared Profile Completion Card */}
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[24px] p-6 hover:border-purple-500/30 transition-all duration-300 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h3 className="text-lg font-semibold font-display text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Profile Completion
              </h3>
              <span className="text-sm font-bold text-purple-400 font-mono">{completion.percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>
                  {completion.completedCount} of {completion.totalCount} fields
                </span>
                <span className="truncate max-w-[160px] text-right">{completion.statusText}</span>
              </div>
            </div>

            {/* Dynamic Checklist Generated From Shared Logic */}
            <div className="space-y-2.5 pt-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {completion.items.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    task.completed
                      ? 'bg-purple-950/20 border-purple-500/30 text-white'
                      : 'bg-white/[0.02] border-white/5 text-[var(--color-text-secondary)]'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        task.completed ? 'text-white' : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {task.label}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
