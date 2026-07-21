import { useState, useEffect } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import CourseTable from '../../../components/courses/CourseTable';
import CourseFilters from '../../../components/courses/CourseFilters';
import CourseModal from '../../../components/courses/CourseModal';
import DeleteCourseModal from '../../../components/courses/DeleteCourseModal';
import { useCourses } from '../../../hooks/useCourses';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [courseType, setCourseType] = useState('All Types');
  const [status, setStatus] = useState('All Status');
  const [sort, setSort] = useState('Recently Added');
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableSortKey, setTableSortKey] = useState('');
  const [tableSortDir, setTableSortDir] = useState('');

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [department, semester, courseType, status, sort, pageSize]);

  const { courses, totalCount, loading, error, addCourse, editCourse, removeCourse, refreshCourses } = useCourses({
    page,
    pageSize,
    search: debouncedSearch,
    filters: { department, semester, course_type: courseType, status },
    sortKey: sort,
    tableSortKey,
    tableSortDir,
  });

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));

  const handleAddClick = () => {
    setSelectedCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

 const handleDeleteClick = (course) => {
  console.log("Delete clicked", course);
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
    console.log("CoursesPage.handleCourseDelete called with id:", id);
    try {
      await removeCourse(id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("CoursesPage caught error during deletion:", err);
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
        <Button onClick={refreshCourses}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{totalCount || 0} courses managed across all departments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={RefreshCcw} size="md" onClick={refreshCourses}>Refresh</Button>
          <Button
            variant="primary"
            icon={Plus}
            size="md"
            onClick={handleAddClick}
          >
            Add Course
          </Button>
        </div>
      </div>

      <Card>
        <CourseFilters
          search={search} setSearch={setSearch}
          department={department} setDepartment={setDepartment}
          semester={semester} setSemester={setSemester}
          courseType={courseType} setCourseType={setCourseType}
          status={status} setStatus={setStatus}
          sort={sort} setSort={setSort}
        />
        <CourseTable 
          courses={courses} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          page={page}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          sortKey={tableSortKey}
          sortDir={tableSortDir}
          onSort={(key, dir) => {
            setTableSortKey(key);
            setTableSortDir(dir);
            setPage(1);
          }}
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
