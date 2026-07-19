import { Users, GraduationCap, CalendarCheck, BookOpen } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import { AnalyticsSection, QuickActions, ActivityTimeline, SystemStatus, UpcomingEvents } from '@/components/admin'
import { kpiStats } from '@/data/dashboardData'

const icons = { 'kpi-students': Users, 'kpi-faculty': GraduationCap, 'kpi-attendance': CalendarCheck, 'kpi-courses': BookOpen }

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back, Aditi</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Here's what's happening across campus today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiStats.map((k) => (
          <StatCard key={k.id} {...k} icon={icons[k.id]} />
        ))}
      </div>

      <AnalyticsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ActivityTimeline />
        </div>
        <div className="space-y-4">
          <QuickActions />
          <SystemStatus />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  )
}
