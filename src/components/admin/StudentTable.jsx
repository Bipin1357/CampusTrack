import { useState, useMemo } from 'react'
import { Table, THead, TBody, TR, TH, TD } from '../common/Table'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Pagination from '../common/Pagination'
import EmptyState from '../common/EmptyState'
import Dropdown, { DropdownItem } from '../common/Dropdown'
import { MoreVertical, Eye, Pencil, Trash2, Users } from 'lucide-react'

const statusTone = { Active: 'success', Probation: 'warning', Graduated: 'neutral' }
const PAGE_SIZE = 8

export default function StudentTable({ students }) {
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const copy = [...students]
    copy.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [students, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  if (!students.length) {
    return <EmptyState icon={Users} title="No students found" description="Try adjusting your search or filters." />
  }

  return (
    <div>
      <Table>
        <THead>
          <TR>
            <TH sortable sortDir={sortKey === 'name' ? sortDir : null} onSort={() => toggleSort('name')}>Student</TH>
            <TH>Roll No.</TH>
            <TH sortable sortDir={sortKey === 'department' ? sortDir : null} onSort={() => toggleSort('department')}>Department</TH>
            <TH>Year</TH>
            <TH sortable sortDir={sortKey === 'gpa' ? sortDir : null} onSort={() => toggleSort('gpa')}>GPA</TH>
            <TH sortable sortDir={sortKey === 'attendance' ? sortDir : null} onSort={() => toggleSort('attendance')}>Attendance</TH>
            <TH>Status</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {pageItems.map((s) => (
            <TR key={s.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">{s.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{s.email}</p>
                  </div>
                </div>
              </TD>
              <TD className="text-[var(--color-text-secondary)] font-mono text-xs">{s.rollNo}</TD>
              <TD className="text-[var(--color-text-secondary)]">{s.department}</TD>
              <TD className="text-[var(--color-text-secondary)]">{s.year}</TD>
              <TD className="text-[var(--color-text-secondary)] font-mono text-xs">{s.gpa}</TD>
              <TD className="text-[var(--color-text-secondary)]">{s.attendance}%</TD>
              <TD><Badge tone={statusTone[s.status]} dot>{s.status}</Badge></TD>
              <TD>
                <Dropdown
                  align="right"
                  trigger={
                    <button className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                >
                  <DropdownItem icon={Eye}>View profile</DropdownItem>
                  <DropdownItem icon={Pencil}>Edit details</DropdownItem>
                  <DropdownItem icon={Trash2} className="text-rose-300 hover:text-rose-200">Remove student</DropdownItem>
                </Dropdown>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} pageSize={PAGE_SIZE} />
    </div>
  )
}
