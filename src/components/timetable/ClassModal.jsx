import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { weekDays } from '../../data/timetableData';

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
const sections = ['A', 'B', 'C', 'D'];

export default function ClassModal({ isOpen, onClose, onSubmit, initialData, courses, title }) {
  const [formData, setFormData] = useState({
    course_id: '',
    faculty_name: '',
    classroom: '',
    day_of_week: weekDays[0],
    start_time: '09:00',
    end_time: '10:00',
    semester: semesters[0].value,
    section: sections[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        course_id: initialData.course_id || '',
        faculty_name: initialData.faculty_name || '',
        classroom: initialData.classroom || '',
        day_of_week: initialData.day_of_week || weekDays[0],
        start_time: initialData.start_time ? initialData.start_time.substring(0, 5) : '09:00',
        end_time: initialData.end_time ? initialData.end_time.substring(0, 5) : '10:00',
        semester: String(initialData.semester ?? semesters[0].value),
        section: initialData.section || sections[0]
      });
    } else if (isOpen && courses && courses.length > 0) {
      setFormData({
        course_id: courses[0].id,
        faculty_name: courses[0].assigned_faculty || '',
        classroom: '',
        day_of_week: weekDays[0],
        start_time: '09:00',
        end_time: '10:00',
        semester: semesters[0].value,
        section: sections[0]
      });
    }
    setErrors({});
  }, [initialData, isOpen, courses]);

  // When course changes, we can auto-fill faculty if we want, but letting them change is fine
  const handleCourseChange = (val) => {
    const selectedCourse = courses.find(c => c.id === val);
    setFormData(prev => ({ 
      ...prev, 
      course_id: val,
      faculty_name: selectedCourse?.assigned_faculty || prev.faculty_name
    }));
    if (errors.course_id) setErrors(prev => ({ ...prev, course_id: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.course_id) newErrors.course_id = 'Course is required';
    if (!formData.faculty_name) newErrors.faculty_name = 'Faculty name is required';
    if (!formData.classroom) newErrors.classroom = 'Classroom is required';
    
    // Time validation
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.end_time) newErrors.end_time = 'End time is required';
    
    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.start_time = 'Start time must be before end time';
        newErrors.end_time = 'Start time must be before end time';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Ensure seconds are appended for DB
    const submitData = {
      ...formData,
      semester: Number(formData.semester),
      start_time:
        formData.start_time.length === 5
          ? `${formData.start_time}:00`
          : formData.start_time,
      end_time:
        formData.end_time.length === 5
          ? `${formData.end_time}:00`
          : formData.end_time,
    };

    onSubmit(submitData);
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Course & Faculty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Course</label>
            <Select value={formData.course_id} onValueChange={handleCourseChange} disabled={!courses || courses.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((c) => <SelectItem key={c.id} value={c.id}>{c.course_name} ({c.course_code})</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id}</p>}
          </div>

          <div>
            <Input label="Faculty Name" name="faculty_name" value={formData.faculty_name} onChange={handleChange} required />
            {errors.faculty_name && <p className="text-red-500 text-xs mt-1">{errors.faculty_name}</p>}
          </div>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Semester</label>
            <Select value={formData.semester} onValueChange={(val) => handleSelectChange('semester', val)}>
              <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
              <SelectContent>
                {semesters.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Section</label>
            <Select value={formData.section} onValueChange={(val) => handleSelectChange('section', val)}>
              <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
              <SelectContent>
                {sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input label="Classroom" name="classroom" value={formData.classroom} onChange={handleChange} required placeholder="e.g. CS-101" />
            {errors.classroom && <p className="text-red-500 text-xs mt-1">{errors.classroom}</p>}
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Day of Week</label>
            <Select value={formData.day_of_week} onValueChange={(val) => handleSelectChange('day_of_week', val)}>
              <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
              <SelectContent>
                {weekDays.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input label="Start Time" name="start_time" type="time" value={formData.start_time} onChange={handleChange} required />
            {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
          </div>

          <div>
            <Input label="End Time" name="end_time" type="time" value={formData.end_time} onChange={handleChange} required />
            {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Class' : 'Add Class'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
