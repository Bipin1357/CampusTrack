import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { useDepartments } from '@/hooks/useDepartments';

const semesters = [
  { label: 'Semester 1', value: '1' },
  { label: 'Semester 2', value: '2' },
  { label: 'Semester 3', value: '3' },
  { label: 'Semester 4', value: '4' },
  { label: 'Semester 5', value: '5' },
  { label: 'Semester 6', value: '6' },
  { label: 'Semester 7', value: '7' },
  { label: 'Semester 8', value: '8' }
];
const sections = ['A', 'B', 'C'];
const genders = ['Male', 'Female', 'Other'];
const statuses = ['Active', 'Inactive'];

export default function StudentModal({ isOpen, onClose, onSubmit, student, allStudents = [], title }) {
  const { departments: deptList } = useDepartments();

  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    email: '',
    phone: '',
    gender: genders[0],
    dob: '',
    department_id: '',
    department: '',
    semester: semesters[0].value,
    section: sections[0],
    status: statuses[0],
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        ...student,
        student_id: student.student_id || '',
        department_id: student.department_id || (deptList[0]?.id || ''),
        department: student.department || (deptList[0]?.code || deptList[0]?.name || ''),
        semester: String(student.semester ?? semesters[0].value),
        password: '',
        confirmPassword: '',
      });
    } else if (isOpen) {
      const defaultDept = deptList[0];
      setFormData({
        student_id: '',
        full_name: '',
        email: '',
        phone: '',
        gender: genders[0],
        dob: '',
        department_id: defaultDept?.id || '',
        department: defaultDept?.code || defaultDept?.name || '',
        semester: semesters[0].value,
        section: sections[0],
        status: statuses[0],
        password: '',
        confirmPassword: '',
      });
    }
    setErrors({});
  }, [student, isOpen, deptList]);

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

    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!student) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
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
      title={title || (student ? 'Edit Student' : 'Add New Student')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Student ID *"
            name="student_id"
            placeholder="e.g. STU-2026-001"
            value={formData.student_id}
            onChange={handleChange}
            error={errors.student_id}
            required
          />

          <Input
            label="Full Name *"
            name="full_name"
            placeholder="e.g. Maya Novak"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address *"
            name="email"
            type="email"
            placeholder="student@university.edu"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {!student && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password *"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password *"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
          </div>
        )}

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
              value={String(formData.semester)}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, semester: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Section</label>
            <Select
              value={formData.section}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, section: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s} value={s}>Section {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Gender</label>
            <Select
              value={formData.gender}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
