import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import toast from 'react-hot-toast';
import { attendanceService } from '../../services/attendanceService';
import { courseService } from '../../services/courseService';
import { Search, UserCheck } from 'lucide-react';

export default function TakeAttendanceModal({ isOpen, onClose, onSuccess }) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(attendanceService.getTodayDateString());
  
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [attendanceState, setAttendanceState] = useState({}); // { student_id: 'Present' | 'Absent' | 'Late' }

  // Search in student list
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setSelectedCourse('');
    setSelectedDate(attendanceService.getTodayDateString());
    setStudents([]);
    setAttendanceState({});
    setSearch('');
  };

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await courseService.getCourses({ pageSize: 100 });
      setCourses(res.data || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleLoadStudents = async () => {
    if (!selectedCourse || !selectedDate) {
      toast.error('Please select a course and date');
      return;
    }
    
    try {
      setLoadingStudents(true);
      const data = await attendanceService.getStudentsForAttendance(selectedCourse, selectedDate);
      setStudents(data);
      
      const newState = {};
      data.forEach(s => {
        if (s.status) newState[s.student_id] = s.status;
      });
      setAttendanceState(newState);
      
    } catch (error) {
      toast.error('Failed to load students for this class');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarkAllPresent = () => {
    const newState = { ...attendanceState };
    students.forEach(s => {
      newState[s.student_id] = 'Present';
    });
    setAttendanceState(newState);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    // Validate that all loaded students have a status if we want to enforce it, 
    // or just save the ones that are marked.
    const recordsToSave = Object.entries(attendanceState).map(([studentId, status]) => ({
      student_id: studentId,
      course_id: selectedCourse,
      date: selectedDate,
      status: status,
      marked_at: new Date().toISOString()
    }));

    if (recordsToSave.length === 0) {
      toast.error('No attendance to save');
      return;
    }

    try {
      setSaving(true);
      await attendanceService.markBulkAttendance(recordsToSave);
      toast.success('Attendance saved successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to save attendance');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.student_name.toLowerCase().includes(search.toLowerCase()) || 
    s.student_roll.toLowerCase().includes(search.toLowerCase())
  );

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
      <Button variant="primary" onClick={handleSave} disabled={saving || students.length === 0}>
        {saving ? 'Saving...' : 'Save Attendance'}
      </Button>
    </>
  );

  return (
    <Modal open={isOpen} onClose={saving ? undefined : onClose} title="Take Attendance" size="lg" footer={footer}>
      <div className="space-y-6">
        {/* Selection Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder={loadingCourses ? 'Loading courses...' : 'Select a course'} />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.course_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Date</label>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)} 
              max={attendanceService.getTodayDateString()} 
            />
          </div>
        </div>

        <div className="flex justify-end border-b border-[var(--color-border)] pb-4">
          <Button variant="secondary" onClick={handleLoadStudents} disabled={loadingStudents || !selectedCourse || !selectedDate}>
            {loadingStudents ? <Loader size="sm" /> : 'Load Students'}
          </Button>
        </div>

        {/* Students List */}
        {students.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <Input 
                  placeholder="Search students..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" onClick={handleMarkAllPresent} icon={UserCheck}>
                Mark All Present
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredStudents.map(student => (
                <div key={student.student_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--color-border)] hover:border-white/10 transition-colors gap-3">
                  <div>
                    <p className="font-medium text-white">{student.student_name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{student.student_roll}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleStatusChange(student.student_id, 'Present')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                        attendanceState[student.student_id] === 'Present' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-transparent text-[var(--color-text-muted)] border-transparent hover:bg-white/5'
                      }`}
                    >
                      Present
                    </button>
                    <button 
                      onClick={() => handleStatusChange(student.student_id, 'Absent')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                        attendanceState[student.student_id] === 'Absent' 
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                          : 'bg-transparent text-[var(--color-text-muted)] border-transparent hover:bg-white/5'
                      }`}
                    >
                      Absent
                    </button>
                    <button 
                      onClick={() => handleStatusChange(student.student_id, 'Late')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                        attendanceState[student.student_id] === 'Late' 
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                          : 'bg-transparent text-[var(--color-text-muted)] border-transparent hover:bg-white/5'
                      }`}
                    >
                      Late
                    </button>
                  </div>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-[var(--color-text-muted)]">
                  No students found matching "{search}"
                </div>
              )}
            </div>
          </div>
        )}
        
        {loadingStudents && (
          <div className="flex justify-center py-12">
            <Loader size="md" />
          </div>
        )}
      </div>
    </Modal>
  );
}
