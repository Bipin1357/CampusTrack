import { CalendarCheck, GraduationCap, Users, Building2, Download, FileText } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ChartCard from '@/components/common/ChartCard'
import AttendanceLineChart from '@/components/charts/AttendanceLineChart'
import DepartmentPieChart from '@/components/charts/DepartmentPieChart'
import { reportCards, attendanceReportTrend, departmentBreakdown } from '@/data/reportsData'
import { formatDate } from '@/lib/utils'

const icons = { CalendarCheck, GraduationCap, Users, Building2 }

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Generate and export institutional reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportCards.map((r) => {
          const Icon = icons[r.icon]
          return (
            <Card key={r.id} hover>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-violet-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold text-[var(--color-text-primary)] mb-1">{r.title}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">{r.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--color-text-muted)]">Last generated {formatDate(r.lastGenerated)}</span>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="sm" icon={FileText}>PDF</Button>
                      <Button variant="ghost" size="sm" icon={Download}>Excel</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Attendance Trend" subtitle="6-month overview" className="lg:col-span-2">
          <AttendanceLineChart data={attendanceReportTrend} />
        </ChartCard>
        <ChartCard title="Enrollment Breakdown" subtitle="By department">
          <DepartmentPieChart data={departmentBreakdown} />
        </ChartCard>
      </div>
    </div>
  )
}
