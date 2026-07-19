import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import { useNavigate } from 'react-router-dom';

export default function CourseTable({ courses, onEdit, onDelete }) {
  const navigate = useNavigate();

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-secondary)]">
        No courses found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)]">Course Code</th>
            <th className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)]">Course Name</th>
            <th className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)]">Credits</th>
            <th className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)]">Department</th>
            <th className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)]">Semester</th>
            <th className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)]">Status</th>
            <th className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">{course.course_code}</td>
              <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{course.course_name}</td>
              <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{course.credits}</td>
              <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{course.department}</td>
              <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{course.semester}</td>
              <td className="px-4 py-3 text-sm">
                <Badge variant={course.status === 'Active' ? 'success' : 'default'}>
                  {course.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Dropdown
                  trigger={
                    <Button variant="secondary" size="sm" className="px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  }
                  items={[
                    {
                      label: 'View Details',
                      icon: <Eye className="w-4 h-4" />,
                      onClick: () => navigate(`/admin/courses/${course.id}`),
                    },
                    {
                      label: 'Edit Course',
                      icon: <Edit2 className="w-4 h-4" />,
                      onClick: () => onEdit(course),
                    },
                    {
                      label: 'Delete Course',
                      icon: <Trash2 className="w-4 h-4 text-red-500" />,
                      onClick: () => onDelete(course),
                      danger: true,
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
