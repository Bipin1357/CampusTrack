import { useState, useMemo } from 'react'
import { Plus, Download, SlidersHorizontal } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import SearchBar from '@/components/common/SearchBar'
import { StudentTable } from '@/components/admin'
import { students } from '@/data/studentsData'

const departments = ['All Departments', ...new Set(students.map((s) => s.department))]
const statuses = ['All Status', 'Active', 'Probation', 'Graduated']

export default function Students() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All Departments')
  const [status, setStatus] = useState('All Status')

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
      const matchesDept = dept === 'All Departments' || s.department === dept
      const matchesStatus = status === 'All Status' || s.status === status
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [search, dept, status])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Students</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{students.length} students enrolled across all departments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Download} size="md">Export</Button>
          <Button variant="primary" icon={Plus} size="md">Add Student</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or roll number…" className="flex-1" />
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-text-muted)] hidden sm:block" />
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]"
            >
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]"
            >
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <StudentTable students={filtered} />
      </Card>
    </div>
  )
}
