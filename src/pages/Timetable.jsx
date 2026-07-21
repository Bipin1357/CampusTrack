import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/common/Select';
import { Table, THead, TBody, TR, TH, TD } from '../components/common/Table';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Calendar, Plus, Search, Edit2, Trash2, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { timetableService } from '../services/timetableService';
import { courseService } from '../services/courseService';
import ClassModal from '../components/timetable/ClassModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { weekDays } from '../data/timetableData';

const semesters = [
  { label: 'All Semesters', value: 'All Semesters' },
  { label: 'Semester 1', value: '1' },
  { label: 'Semester 2', value: '2' },
  { label: 'Semester 3', value: '3' },
  { label: 'Semester 4', value: '4' },
  { label: 'Semester 5', value: '5' },
  { label: 'Semester 6', value: '6' },
  { label: 'Semester 7', value: '7' },
  { label: 'Semester 8', value: '8' }
];

export default function TimetableDashboard() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterDay, setFilterDay] = useState('All Days');
  const [filterCourse, setFilterCourse] = useState('All Courses');
  const [filterSemester, setFilterSemester] = useState('All Semesters');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Delete Modal State
  const [classToDelete, setClassToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [filterDay, filterCourse, filterSemester]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [timetableData, courseData] = await Promise.all([
        timetableService.getWeeklyTimetable({
          day_of_week: filterDay,
          course_id: filterCourse,
          semester: filterSemester
        }),
        courseService.getCourses({ pageSize: 100 }) // fetch lots of courses for dropdown
      ]);
      setClasses(timetableData);
      setCourses(courseData.data || []);
    } catch (error) {
      toast.error('Failed to load timetable data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cls) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cls) => {
    setClassToDelete(cls);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    setIsDeleting(true);
    try {
      await timetableService.deleteClass(classToDelete.id);
      toast.success('Class deleted successfully');
      fetchInitialData();
      setClassToDelete(null);
    } catch (error) {
      toast.error('Failed to delete class');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingClass) {
        await timetableService.updateClass(editingClass.id, formData);
        toast.success('Class updated successfully');
      } else {
        await timetableService.createClass(formData);
        toast.success('Class added successfully');
      }
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error) {
      toast.error(error.message || 'Failed to save class');
    }
  };

  // Client-side search
  const filteredClasses = classes.filter(cls => {
    const term = search.toLowerCase();
    return (
      cls.course?.course_name?.toLowerCase().includes(term) ||
      cls.faculty_name?.toLowerCase().includes(term) ||
      cls.classroom?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Timetable Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage weekly class schedules across all departments.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleAddClick}>
          Add Class
        </Button>
      </div>

      <Card className="p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input 
            placeholder="Search classes, faculty, rooms..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-40">
             <Select value={filterDay} onValueChange={setFilterDay}>
              <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Days">All Days</SelectItem>
                {weekDays.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger><SelectValue placeholder="Course" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Courses">All Courses</SelectItem>
                {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.course_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-40">
             <Select value={filterSemester} onValueChange={setFilterSemester}>
              <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
              <SelectContent>
                {semesters.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center h-64 items-center"><Loader size="lg" /></div>
      ) : filteredClasses.length === 0 ? (
        <EmptyState icon={Calendar} title="No classes found" description="Adjust your filters or add a new class to the timetable." />
      ) : (
        <Card className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Course</TH>
                <TH>Faculty</TH>
                <TH>Classroom</TH>
                <TH>Day</TH>
                <TH>Time</TH>
                <TH>Sem & Sec</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredClasses.map((cls) => (
                <TR key={cls.id}>
                  <TD className="font-medium text-white">{cls.course?.course_name}</TD>
                  <TD className="text-[var(--color-text-secondary)]">{cls.faculty_name}</TD>
                  <TD>
                    <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                      <MapPin className="w-3.5 h-3.5" /> {cls.classroom}
                    </span>
                  </TD>
                  <TD>
                    <Badge tone="accent">{cls.day_of_week}</Badge>
                  </TD>
                  <TD>
                    <span className="flex items-center gap-1.5 text-sm font-mono text-[var(--color-text-secondary)]">
                      <Clock className="w-3.5 h-3.5" /> 
                      {cls.start_time.substring(0,5)} - {cls.end_time.substring(0,5)}
                    </span>
                  </TD>
                  <TD className="text-[var(--color-text-secondary)]">
                    {cls.semester} (Sec {cls.section})
                  </TD>
                  <TD className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(cls)}>
                        <Edit2 className="w-4 h-4 text-[var(--color-text-muted)] hover:text-white" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(cls)}>
                        <Trash2 className="w-4 h-4 text-rose-400 hover:text-rose-300" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingClass}
        courses={courses}
        title={editingClass ? "Edit Class" : "Add Class"}
      />

      <ConfirmModal
        open={!!classToDelete}
        title="Delete Class"
        description="Are you sure you want to delete this class from the timetable?\n\nThis action cannot be undone."
        confirmText="Delete Class"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !isDeleting && setClassToDelete(null)}
      />
    </div>
  );
}
