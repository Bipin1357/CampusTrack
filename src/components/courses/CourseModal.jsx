import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { departments } from '../../data/departments';
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
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    department: departments[0],
    semester: semesters[0].value,
    course_type: courseTypes[0],
    credits: 3,
    assigned_faculty: '',
    description: '',
    status: statuses[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
      });
    } else {
      setFormData({
        course_code: '',
        course_name: '',
        department: departments[0],
        semester: semesters[0],
        course_type: courseTypes[0],
        credits: 3,
        assigned_faculty: '',
        description: '',
        status: statuses[0],
      });
    }
    setErrors({});
  }, [course, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic Validation
    if (!formData.course_name) newErrors.course_name = 'Course name is required';
    if (!formData.course_code) newErrors.course_code = 'Course code is required';
    if (!formData.credits) newErrors.credits = 'Credits is required';
    else if (formData.credits < 1 || formData.credits > 6) newErrors.credits = 'Credits must be between 1 and 6';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.course_type) newErrors.course_type = 'Course type is required';

    // Duplicate Validation (only when creating)
    if (!course) {
      if (allCourses.some(c => c.course_code === formData.course_code)) {
        newErrors.course_code = 'Course Code already exists';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Information */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
            Course Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input label="Course Name" name="course_name" value={formData.course_name} onChange={handleChange} required />
              {errors.course_name && <p className="text-red-500 text-xs mt-1">{errors.course_name}</p>}
            </div>
            <div>
              <Input label="Course Code" name="course_code" value={formData.course_code} onChange={handleChange} required disabled={!!course} />
              {errors.course_code && <p className="text-red-500 text-xs mt-1">{errors.course_code}</p>}
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
            Academic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="space-y-1 md:col-span-6">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Department</label>
              <Select value={formData.department} onValueChange={(val) => handleChange({ target: { name: 'department', value: val } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>
            
            <div className="space-y-1 md:col-span-3">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Semester</label>
              <Select value={formData.semester?.toString()} onValueChange={(val) => handleChange({ target: { name: 'semester', value: parseInt(val, 10) } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => <SelectItem key={s.value} value={s.value.toString()}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
            </div>

            <div className="space-y-1 md:col-span-3">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Course Type</label>
              <Select value={formData.course_type} onValueChange={(val) => handleChange({ target: { name: 'course_type', value: val } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.course_type && <p className="text-red-500 text-xs mt-1">{errors.course_type}</p>}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
               <Input label="Credits" type="number" name="credits" min="1" max="6" value={formData.credits} onChange={handleChange} required />
               {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits}</p>}
             </div>
          </div>
        </div>

        {/* Faculty Information */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
            Faculty Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input label="Assigned Faculty" name="assigned_faculty" value={formData.assigned_faculty} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
            Course Description
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
             <div className="space-y-1">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-violet)]"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Course Status */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
            Course Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
              <Select value={formData.status} onValueChange={(val) => handleChange({ target: { name: 'status', value: val } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
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
