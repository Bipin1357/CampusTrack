import { useState, useMemo, useEffect } from 'react'
import { Download, SlidersHorizontal, CalendarCheck, CalendarX, TrendingUp, UserCheck } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import SearchBar from '@/components/common/SearchBar'
import ChartCard from '@/components/common/ChartCard'
import StatCard from '@/components/common/StatCard'
import { AttendanceTable } from '@/components/admin'
import AttendanceLineChart from '@/components/charts/AttendanceLineChart'
import Loader from '@/components/common/Loader'
import TakeAttendanceModal from '@/components/admin/TakeAttendanceModal'
import { attendanceService } from '@/services/attendanceService'
import toast from 'react-hot-toast'
import { departments as departmentList } from '@/data/departments'

export default function Attendance() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All Departments')
  const [status, setStatus] = useState('All Status')
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, rate: 0, total: 0 })
  const [trendData, setTrendData] = useState([])
  const [records, setRecords] = useState([])
  
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const today = attendanceService.getTodayDateString()
      const [statsData, trend, recordsData] = await Promise.all([
        attendanceService.getAdminAttendanceStats(today),
        attendanceService.getMonthlyAttendanceTrend(),
        attendanceService.getAttendanceRecords()
      ])
      
      setStats(statsData)
      setTrendData(trend)
      
      const mappedRecords = (recordsData.data || []).map(r => ({
        id: r.id,
        name: r.student?.full_name || 'Unknown',
        rollNo: r.student?.student_id || 'Unknown',
        department: r.student?.department || 'Unknown',
        course: r.course?.course_name || 'N/A',
        date: r.date,
        status: r.status
      }))
      setRecords(mappedRecords)
      
    } catch (error) {
      toast.error('Failed to load attendance data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const departments = ['All Departments', ...departmentList]
  const statuses = ['All Status', 'Present', 'Absent', 'Late']

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.rollNo.toLowerCase().includes(search.toLowerCase())
      const matchesDept = dept === 'All Departments' || r.department === dept
      const matchesStatus = status === 'All Status' || r.status === status
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [search, dept, status, records])

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error('No records to export')
      return
    }
    const headers = ['Student Name', 'Roll No', 'Course', 'Department', 'Date', 'Status']
    const csvContent = [
      headers.join(','),
      ...filtered.map(r => `"${r.name}","${r.rollNo}","${r.course}","${r.department}","${r.date}","${r.status}"`)
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `attendance_report_${attendanceService.getTodayDateString()}.csv`
    link.click()
    toast.success('Report exported successfully')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader size="lg" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Track and manage daily attendance records</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={Download} onClick={handleExport}>Export Report</Button>
          <Button variant="primary" icon={UserCheck} onClick={() => setIsModalOpen(true)}>Take Attendance</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Today's Overall Rate" value={stats.rate} unit="%" delta={0} trend="neutral" icon={TrendingUp} />
        <StatCard label="Present Today" value={stats.present + stats.late} delta={0} trend="neutral" icon={CalendarCheck} />
        <StatCard label="Absent Today" value={stats.absent} delta={0} trend="neutral" icon={CalendarX} />
      </div>

      <ChartCard title="Attendance Trend" subtitle="Monthly attendance rate across campus">
        <AttendanceLineChart data={trendData.length > 0 ? trendData : [{ month: 'Jan', rate: 0 }]} />
      </ChartCard>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5 p-4 border-b border-[var(--color-border)]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by student name or roll no…" className="flex-1" />
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
        <div className="p-4 pt-0">
          <AttendanceTable records={filtered} />
        </div>
      </Card>
      
      <TakeAttendanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  )
}
