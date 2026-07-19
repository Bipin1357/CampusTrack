import { useState } from 'react'
import { Table, THead, TBody, TR, TH, TD } from '../common/Table'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Pagination from '../common/Pagination'
import EmptyState from '../common/EmptyState'
import { CalendarCheck } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const statusTone = { Present: 'success', Absent: 'danger', Late: 'warning' }
const PAGE_SIZE = 8

export default function AttendanceTable({ records }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const pageItems = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (!records.length) {
    return <EmptyState icon={CalendarCheck} title="No attendance records" description="Try adjusting your search or filters." />
  }

  return (
    <div>
      <Table>
        <THead>
          <TR>
            <TH>Student</TH>
            <TH>Course</TH>
            <TH>Department</TH>
            <TH>Date</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {pageItems.map((r) => (
            <TR key={r.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={r.name} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">{r.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] font-mono">{r.rollNo}</p>
                  </div>
                </div>
              </TD>
              <TD className="text-[var(--color-text-secondary)]">{r.course}</TD>
              <TD className="text-[var(--color-text-secondary)]">{r.department}</TD>
              <TD className="text-[var(--color-text-secondary)]">{formatDate(r.date)}</TD>
              <TD><Badge tone={statusTone[r.status]} dot>{r.status}</Badge></TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={records.length} pageSize={PAGE_SIZE} />
    </div>
  )
}
