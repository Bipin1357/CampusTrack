import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { useDepartments } from '@/hooks/useDepartments';

const semesters = [
  { label: "Semester 1", value: 1 },
  { label: "Semester 2", value: 2 },
  { label: "Semester 3", value: 3 },
  { label: "Semester 4", value: 4 },
  { label: "Semester 5", value: 5 },
  { label: "Semester 6", value: 6 },
  { label: "Semester 7", value: 7 },
  { label: "Semester 8", value: 8 },
];
const courseTypes = ['Theory', 'Lab'];
const statuses = ['Active', 'Inactive'];

export default function CourseModal({ isOpen, onClose, onSubmit, course, allCourses = [], title }) {
  const { departments: deptList } = useDepartments();

  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    department_id: '',
    department: '',
    semester: semesters[0].value,
    course_type: courseTypes[0],
    credits: 3,
    assigned_faculty: '',
    description: '',
    status: statuses[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course && isOpen) {
      setFormData({
        ...course,
        course_code: course.course_code || '',
        course_name: course.course_name || '',
        department_id: course.department_id || (deptList[0]?.id || ''),
        department: course.department || (deptList[0]?.code || deptList[0]?.name || ''),
        semester: Number(course.semester || semesters[0].value),
        course_type: course.course_type || courseTypes[0],
        credits: Number(course.credits || 3),
        assigned_faculty: course.assigned_faculty || course.faculty || '',
        description: course.description || '',
        status: course.status || statuses[0],
      });
    } else if (isOpen) {
      const defaultDept = deptList[0];
      setFormData({
        course_code: '',
        course_name: '',
        department_id: defaultDept?.id || '',
        department: defaultDept?.code || defaultDept?.name || '',
        semester: semesters[0].value,
        course_type: courseTypes[0],
        credits: 3,
        assigned_faculty: '',
        description: '',
        status: statuses[0],
      });
    }
    setErrors({});
  }, [course, isOpen, deptList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDepartmentChange = (deptId) => {
    const selectedDept = deptList.find((d) => d.id === deptId || d.code === deptId || d.name === deptId);
    setFormData((prev) => ({
      ...prev,
      department_id: selectedDept?.id || deptId,
      department: selectedDept?.code || selectedDept?.name || deptId
    }));
    if (errors.department) {
      setErrors((prev) => ({ ...prev, department: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.course_code.trim()) newErrors.course_code = 'Course Code is required';
    if (!formData.course_name.trim()) newErrors.course_name = 'Course Name is required';

    if (!formData.credits || Number(formData.credits) <= 0) {
      newErrors.credits = 'Credits must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        credits: Number(formData.credits),
        semester: Number(formData.semester)
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (course ? 'Edit Course' : 'Add New Course')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Course Code *"
            name="course_code"
            placeholder="e.g. CS-201"
            value={formData.course_code}
            onChange={handleChange}
            error={errors.course_code}
            required
          />

          <Input
            label="Course Name *"
            name="course_name"
            placeholder="e.g. Data Structures & Algorithms"
            value={formData.course_name}
            onChange={handleChange}
            error={errors.course_name}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Department</label>
            <Select
              value={formData.department_id || formData.department}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {deptList.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Semester</label>
            <Select
              value={formData.semester.toString()}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, semester: Number(val) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.value} value={s.value.toString()}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Course Type</label>
            <Select
              value={formData.course_type}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, course_type: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Course Type" />
              </SelectTrigger>
              <SelectContent>
                {courseTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Credits *"
            name="credits"
            type="number"
            min="1"
            max="10"
            value={formData.credits}
            onChange={handleChange}
            error={errors.credits}
            required
          />

          <Input
            label="Assigned Faculty"
            name="assigned_faculty"
            placeholder="e.g. Dr. Ananya Rao"
            value={formData.assigned_faculty}
            onChange={handleChange}
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Status</label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Description (Optional)</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Overview of syllabus, prerequisites, or outcomes..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/[0.03] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : course ? 'Update Course' : 'Add Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
