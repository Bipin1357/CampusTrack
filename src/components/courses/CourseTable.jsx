import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Dropdown, { DropdownItem } from '../common/Dropdown';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import { Table, THead, TBody, TR, TH, TD } from '../common/Table';
import { useNavigate } from 'react-router-dom';

export default function CourseTable({ 
  courses, 
  onEdit, 
  onDelete,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortKey,
  sortDir,
  onSort 
}) {
  const navigate = useNavigate();

  function toggleSort(key) {
    if (onSort) {
      if (sortKey === key) {
        onSort(key, sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        onSort(key, 'asc');
      }
    }
  }

  if (!courses || courses.length === 0) {
    return (
      <EmptyState 
        title="No courses found" 
        description="Try adjusting your search or filters." 
      />
    );
  }

  return (
    <div>
      <Table>
        <THead>
          <TR>
            <TH sortable sortDir={sortKey === 'course_code' ? sortDir : null} onSort={() => toggleSort('course_code')}>Course Code</TH>
            <TH sortable sortDir={sortKey === 'course_name' ? sortDir : null} onSort={() => toggleSort('course_name')}>Course Name</TH>
            <TH sortable sortDir={sortKey === 'credits' ? sortDir : null} onSort={() => toggleSort('credits')}>Credits</TH>
            <TH>Type</TH>
            <TH sortable sortDir={sortKey === 'department' ? sortDir : null} onSort={() => toggleSort('department')}>Department</TH>
            <TH sortable sortDir={sortKey === 'semester' ? sortDir : null} onSort={() => toggleSort('semester')}>Semester</TH>
            <TH sortable sortDir={sortKey === 'status' ? sortDir : null} onSort={() => toggleSort('status')}>Status</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {courses.map((course) => (
            <TR key={course.id}>
              <TD className="font-medium text-[var(--color-text)]">{course.course_code}</TD>
              <TD className="text-[var(--color-text-secondary)]">{course.course_name}</TD>
              <TD className="text-[var(--color-text-secondary)]">{course.credits}</TD>
              <TD className="text-[var(--color-text-secondary)]">{course.course_type || '-'}</TD>
              <TD className="text-[var(--color-text-secondary)]">{course.department}</TD>
              <TD className="text-[var(--color-text-secondary)]">{course.semester ? `Semester ${String(course.semester).replace(/^Semester\s*/i, '').trim()}` : ''}</TD>
              <TD>
                <Badge variant={course.status === 'Active' ? 'success' : 'default'} dot>
                  {course.status}
                </Badge>
              </TD>
              <TD>
                <Dropdown
                  align="right"
                  trigger={
                    <button className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                >
                  <DropdownItem icon={Eye} onClick={() => navigate(`/admin/courses/${course.id}`)}>
                    View Details
                  </DropdownItem>
                  <DropdownItem icon={Edit2} onClick={() => onEdit(course)}>
                    Edit Course
                  </DropdownItem>
                  <DropdownItem icon={Trash2} className="text-rose-300 hover:text-rose-200" onClick={() => onDelete(course)}>
                    Delete Course
                  </DropdownItem>
                </Dropdown>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <Pagination 
        page={page} 
        totalPages={totalPages} 
        onChange={onPageChange} 
        totalItems={totalItems} 
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
