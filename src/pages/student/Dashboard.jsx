import React from 'react'
import { CalendarCheck, BookOpen, Clock, Bell, FileText, UserCheck } from 'lucide-react'
import TodayClasses from '../../components/student/TodayClasses'

export default function StudentDashboard() {
  const cards = [
    { title: 'Attendance Percentage', value: '85%', desc: 'Good standing', icon: CalendarCheck, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: "Today's Classes", value: '4', desc: 'Next: Data Structures at 10 AM', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Upcoming Exams', value: '2', desc: 'Midterms starting next week', icon: BookOpen, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { title: 'Latest Notices', value: '3', desc: '2 Unread notices', icon: Bell, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { title: 'Recent Results', value: 'CGPA: 3.8', desc: 'Last updated 2 days ago', icon: FileText, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { title: 'Profile Completion', value: '100%', desc: 'All records updated', icon: UserCheck, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Student Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Overview of your academic progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-5 flex flex-col hover:border-[var(--color-border-hover)] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="font-medium text-[var(--color-text-secondary)]">{card.title}</h3>
            </div>
            <div className="mt-auto">
              <div className="text-2xl font-bold font-display text-[var(--color-text-primary)]">{card.value}</div>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodayClasses />
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-6 h-64 flex items-center justify-center">
          <p className="text-[var(--color-text-muted)]">Recent Announcements Placeholder</p>
        </div>
      </div>
    </div>
  )
}
