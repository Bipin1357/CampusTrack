import { useState, useMemo } from 'react'
import { Plus, SlidersHorizontal } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import SearchBar from '@/components/common/SearchBar'
import Badge from '@/components/common/Badge'
import EmptyState from '@/components/common/EmptyState'
import { Table, THead, TBody, TR, TH, TD } from '@/components/common/Table'
import { examinations } from '@/data/examinationsData'
import { formatDate } from '@/lib/utils'
import { FileSpreadsheet } from 'lucide-react'

const departments = ['All Departments', ...new Set(examinations.map((e) => e.department))]
const statuses = ['All Status', 'Scheduled', 'Ongoing', 'Completed']
const statusTone = { Scheduled: 'info', Ongoing: 'warning', Completed: 'success' }

export default function Examinations() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All Departments')
  const [status, setStatus] = useState('All Status')

  const filtered = useMemo(() => {
    return examinations.filter((e) => {
      const matchesSearch = e.course.toLowerCase().includes(search.toLowerCase())
      const matchesDept = dept === 'All Departments' || e.department === dept
      const matchesStatus = status === 'All Status' || e.status === status
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [search, dept, status])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Examinations</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{examinations.length} exams scheduled this term</p>
        </div>
        <Button variant="primary" icon={Plus} size="md">Schedule Exam</Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by course…" className="flex-1" />
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

        {filtered.length === 0 ? (
          <EmptyState icon={FileSpreadsheet} title="No exams found" description="Try adjusting your search or filters." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Course</TH>
                <TH>Department</TH>
                <TH>Semester</TH>
                <TH>Date &amp; Time</TH>
                <TH>Duration</TH>
                <TH>Room</TH>
                <TH>Invigilator</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((e) => (
                <TR key={e.id}>
                  <TD className="font-medium text-[var(--color-text-primary)]">{e.course}</TD>
                  <TD className="text-[var(--color-text-secondary)]">{e.department}</TD>
                  <TD className="text-[var(--color-text-secondary)]">{e.semester}</TD>
                  <TD className="text-[var(--color-text-secondary)]">{formatDate(e.date)}, {e.time}</TD>
                  <TD className="text-[var(--color-text-secondary)]">{e.duration}</TD>
                  <TD className="text-[var(--color-text-secondary)] font-mono text-xs">{e.room}</TD>
                  <TD className="text-[var(--color-text-secondary)]">{e.invigilator}</TD>
                  <TD><Badge tone={statusTone[e.status]} dot>{e.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
