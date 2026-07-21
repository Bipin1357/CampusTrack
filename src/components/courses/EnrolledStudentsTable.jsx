import { Table, THead, TBody, TR, TH, TD } from '../common/Table';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { Users, Trash2 } from 'lucide-react';
import Button from '../common/Button';

export default function EnrolledStudentsTable({ enrollments, onRemove }) {
  if (!enrollments || enrollments.length === 0) {
    return (
      <EmptyState 
        icon={Users} 
        title="No students are enrolled in this course yet." 
        description="Click the button above to start enrolling students." 
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <Table>
        <THead>
          <TR>
            <TH>Student</TH>
            <TH>Roll Number</TH>
            <TH>Department</TH>
            <TH>Enrollment Date</TH>
            <TH>Status</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {enrollments.map((enrollment) => (
            <TR key={enrollment.enrollment_id}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={enrollment.full_name} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">{enrollment.full_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{enrollment.email}</p>
                  </div>
                </div>
              </TD>
              <TD className="text-[var(--color-text-secondary)] font-mono text-xs">{enrollment.student_id}</TD>
              <TD className="text-[var(--color-text-secondary)]">{enrollment.department}</TD>
              <TD className="text-[var(--color-text-secondary)]">
                {new Date(enrollment.enrolled_at).toLocaleDateString()}
              </TD>
              <TD>
                <Badge tone={enrollment.enrollment_status === 'active' ? 'success' : 'neutral'} dot>
                  {enrollment.enrollment_status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </TD>
              <TD className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                  onClick={() => onRemove(enrollment.enrollment_id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
