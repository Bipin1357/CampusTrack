import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const departments = ['Computer Science', 'Business', 'Engineering', 'Arts', 'Science'];
const semesters = ['Fall 2026', 'Spring 2026', 'Summer 2026'];
const statuses = ['Active', 'Inactive'];

export default function CourseModal({ isOpen, onClose, onSubmit, course, title }) {
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    credits: 3,
    department: departments[0],
    semester: semesters[0],
    description: '',
    assigned_faculty: '',
    status: statuses[0],
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        course_code: '',
        course_name: '',
        credits: 3,
        department: departments[0],
        semester: semesters[0],
        description: '',
        assigned_faculty: '',
        status: statuses[0],
      });
    }
  }, [course, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Course Code"
            name="course_code"
            value={formData.course_code}
            onChange={handleChange}
            placeholder="e.g., CS101"
            required
            disabled={!!course} // Cannot change course code after creation usually
          />
          <Input
            label="Course Name"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            placeholder="Introduction to Programming"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Credits"
            name="credits"
            type="number"
            min="1"
            max="6"
            value={formData.credits}
            onChange={handleChange}
            required
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text)]">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-violet)]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text)]">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-violet)]"
            >
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text)]">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-violet)]"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Assigned Faculty (Optional)"
          name="assigned_faculty"
          value={formData.assigned_faculty}
          onChange={handleChange}
          placeholder="Dr. John Doe"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-[var(--color-text)]">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-violet)]"
            placeholder="Course description..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
