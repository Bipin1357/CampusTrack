import { useState, useMemo } from 'react'
import { Download, SlidersHorizontal } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import SearchBar from '@/components/common/SearchBar'
import ChartCard from '@/components/common/ChartCard'
import StatCard from '@/components/common/StatCard'
import { AttendanceTable } from '@/components/admin'
import AttendanceLineChart from '@/components/charts/AttendanceLineChart'
import { attendanceRecords, monthlyAttendanceTrend, attendanceByDepartment } from '@/data/attendanceData'
import { CalendarCheck, CalendarX, TrendingUp } from 'lucide-react'

const departments = ['All Departments', ...new Set(attendanceRecords.map((r) => r.department))]
const statuses = ['All Status', 'Present', 'Absent', 'Late']

export default function Attendance() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All Departments')
  const [status, setStatus] = useState('All Status')

  const filtered = useMemo(() => {
    return attendanceRecords.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
      const matchesDept = dept === 'All Departments' || r.department === dept
      const matchesStatus = status === 'All Status' || r.status === status
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [search, dept, status])

  const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length
  const absentCount = attendanceRecords.filter((r) => r.status === 'Absent').length
  const rate = Math.round((presentCount / attendanceRecords.length) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Track and manage daily attendance records</p>
        </div>
        <Button variant="secondary" icon={Download} size="md">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Overall Rate" value={rate} unit="%" delta={2.1} trend="up" icon={TrendingUp} sparkline={monthlyAttendanceTrend.map((m) => m.rate)} />
        <StatCard label="Present Today" value={presentCount} delta={1.4} trend="up" icon={CalendarCheck} sparkline={[18, 20, 19, 22, 21, presentCount]} />
        <StatCard label="Absent Today" value={absentCount} delta={0.8} trend="down" icon={CalendarX} sparkline={[9, 8, 10, 7, 8, absentCount]} />
      </div>

      <ChartCard title="Attendance Trend" subtitle="Monthly attendance rate across campus">
        <AttendanceLineChart data={monthlyAttendanceTrend} />
      </ChartCard>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by student name…" className="flex-1" />
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-text-muted)] hidden sm:block" />
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <AttendanceTable records={filtered} />
      </Card>
    </div>
  )
}
