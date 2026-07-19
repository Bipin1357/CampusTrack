import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import CourseTable from '../../../components/courses/CourseTable';
import CourseFilters from '../../../components/courses/CourseFilters';
import CourseModal from '../../../components/courses/CourseModal';
import DeleteCourseModal from '../../../components/courses/DeleteCourseModal';
import { useCourses } from '../../../hooks/useCourses';

export default function CoursesPage() {
  const { courses, loading, error, addCourse, editCourse, removeCourse } = useCourses();
  
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [status, setStatus] = useState('All Status');
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch = 
        c.course_name.toLowerCase().includes(search.toLowerCase()) || 
        c.course_code.toLowerCase().includes(search.toLowerCase());
      
      const matchesDept = department === 'All Departments' || c.department === department;
      const matchesSem = semester === 'All Semesters' || c.semester === semester;
      const matchesStatus = status === 'All Status' || c.status === status;
      
      return matchesSearch && matchesDept && matchesSem && matchesStatus;
    });
  }, [courses, search, department, semester, status]);

  const handleAddClick = () => {
    setSelectedCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleCourseSubmit = async (courseData) => {
    try {
      if (selectedCourse) {
        await editCourse(selectedCourse.id, courseData);
      } else {
        await addCourse(courseData);
      }
      setIsCourseModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleCourseDelete = async (id) => {
    try {
      await removeCourse(id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  if (loading && courses.length === 0) {
    return <div className="flex h-64 items-center justify-center"><Loader size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center flex-col gap-4">
        <p className="text-red-400">Failed to load courses: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage university courses and curricula</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Plus} size="md" onClick={handleAddClick}>
            Add Course
          </Button>
        </div>
      </div>

      <Card>
        <CourseFilters
          search={search} setSearch={setSearch}
          department={department} setDepartment={setDepartment}
          semester={semester} setSemester={setSemester}
          status={status} setStatus={setStatus}
        />
        <CourseTable 
          courses={filteredCourses} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Card>

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSubmit={handleCourseSubmit}
        course={selectedCourse}
        title={selectedCourse ? "Edit Course" : "Add New Course"}
      />

      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleCourseDelete}
        course={selectedCourse}
      />
    </div>
  );
}
