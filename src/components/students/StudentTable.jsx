import { useState, useMemo } from 'react';
import { Table, THead, TBody, TR, TH, TD } from '../common/Table';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Dropdown, { DropdownItem } from '../common/Dropdown';
import { MoreVertical, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusTone = { Active: 'success', Inactive: 'neutral' };
const PAGE_SIZE = 8;

export default function StudentTable({ students, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('full_name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...students];
    copy.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = String(av || '').localeCompare(String(bv || ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [students, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  if (!students || !students.length) {
    return <EmptyState icon={Users} title="No students found" description="Try adjusting your search or filters." />;
  }

  return (
    <div>
      <Table>
        <THead>
          <TR>
            <TH sortable sortDir={sortKey === 'full_name' ? sortDir : null} onSort={() => toggleSort('full_name')}>Student</TH>
            <TH sortable sortDir={sortKey === 'student_id' ? sortDir : null} onSort={() => toggleSort('student_id')}>Student ID</TH>
            <TH sortable sortDir={sortKey === 'department' ? sortDir : null} onSort={() => toggleSort('department')}>Department</TH>
            <TH sortable sortDir={sortKey === 'semester' ? sortDir : null} onSort={() => toggleSort('semester')}>Semester</TH>
            <TH sortable sortDir={sortKey === 'status' ? sortDir : null} onSort={() => toggleSort('status')}>Status</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {pageItems.map((s) => (
            <TR key={s.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={s.full_name} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">{s.full_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{s.email}</p>
                  </div>
                </div>
              </TD>
              <TD className="text-[var(--color-text-secondary)] font-mono text-xs">{s.student_id}</TD>
              <TD className="text-[var(--color-text-secondary)]">{s.department}</TD>
              <TD className="text-[var(--color-text-secondary)]">{s.semester}</TD>
              <TD><Badge tone={statusTone[s.status] || 'neutral'} dot>{s.status}</Badge></TD>
              <TD>
                <Dropdown
                  align="right"
                  trigger={
                    <button className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                >
                  <DropdownItem icon={Eye} onClick={() => navigate(`/admin/students/${s.id}`)}>
                    View profile
                  </DropdownItem>
                  <DropdownItem icon={Pencil} onClick={() => onEdit(s)}>
                    Edit details
                  </DropdownItem>
                  <DropdownItem icon={Trash2} className="text-rose-300 hover:text-rose-200" onClick={() => onDelete(s)}>
                    Remove student
                  </DropdownItem>
                </Dropdown>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
