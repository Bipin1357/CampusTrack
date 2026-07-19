import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';

const departments = ['Computer Science', 'Business', 'Engineering', 'Arts', 'Science'];
const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
const sections = ['A', 'B', 'C'];
const genders = ['Male', 'Female', 'Other'];
const statuses = ['Active', 'Inactive'];

export default function StudentModal({ isOpen, onClose, onSubmit, student, allStudents = [], title }) {
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    email: '',
    phone: '',
    gender: genders[0],
    dob: '',
    department: departments[0],
    semester: semesters[0],
    section: sections[0],
    status: statuses[0],
    password: '', // Only for creation
    confirmPassword: '', // Only for creation
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        password: '',
        confirmPassword: '',
      });
    } else {
      setFormData({
        student_id: '',
        full_name: '',
        email: '',
        phone: '',
        gender: genders[0],
        dob: '',
        department: departments[0],
        semester: semesters[0],
        section: sections[0],
        status: statuses[0],
        password: '',
        confirmPassword: '',
      });
    }
    setErrors({});
  }, [student, isOpen]);

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
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.student_id) newErrors.student_id = 'Student ID is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    // Duplicate Validation (only when creating)
    if (!student) {
      if (allStudents.some(s => s.student_id === formData.student_id)) {
        newErrors.student_id = 'Student ID already exists';
      }
      if (allStudents.some(s => s.email.toLowerCase() === formData.email.toLowerCase())) {
        newErrors.email = 'Email already exists';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
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
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>
            <div>
              <Input label="Student ID" name="student_id" value={formData.student_id} onChange={handleChange} required disabled={!!student} />
              {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
            </div>
            <div>
              <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required disabled={!!student} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Gender</label>
              <Select value={formData.gender} onValueChange={(val) => handleChange({ target: { name: 'gender', value: val } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <Input label="Date of Birth" type="date" name="dob" max={new Date().toISOString().split("T")[0]} value={formData.dob || ''} onChange={handleChange} />
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
            </div>
            
            <div className="space-y-1 md:col-span-3">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Semester</label>
              <Select value={formData.semester} onValueChange={(val) => handleChange({ target: { name: 'semester', value: val } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:col-span-3">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Section</label>
              <Select value={formData.section} onValueChange={(val) => handleChange({ target: { name: 'section', value: val } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Status</label>
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

        {/* Account Information (Only for new students) */}
        {!student && (
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required={!student} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required={!student} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {student ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
