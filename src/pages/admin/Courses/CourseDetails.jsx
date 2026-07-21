import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Clock, MapPin, Edit2, Monitor, Plus } from 'lucide-react';
import { courseService } from '../../../services/courseService';
import { enrollmentService } from '../../../services/enrollmentService';
import toast from 'react-hot-toast';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import Loader from '../../../components/common/Loader';
import CourseModal from '../../../components/courses/CourseModal';
import EnrolledStudentsTable from '../../../components/courses/EnrolledStudentsTable';
import EnrollStudentsModal from '../../../components/courses/EnrollStudentsModal';
import { useCourses } from '../../../hooks/useCourses';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editCourse } = useCourses();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentService.getEnrollmentsByCourse(id);
      setEnrollments(data);
    } catch (err) {
      toast.error('Failed to load enrollments');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCourse();
      fetchEnrollments();
    }
  }, [id]);

  const handleEditSubmit = async (courseData) => {
    try {
      const updated = await editCourse(id, courseData);
      setCourse(updated);
      setIsEditModalOpen(false);
    } catch (err) {
      // Handled in hook
    }
  };

  const handleOpenEnrollModal = async () => {
    setIsEnrollModalOpen(true);
    setLoadingStudents(true);
    try {
      const students = await enrollmentService.getAvailableStudents(id);
      setAvailableStudents(students);
    } catch (err) {
      toast.error('Failed to load available students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleEnrollSubmit = async (studentIds) => {
    try {
      await enrollmentService.enrollStudents(id, studentIds);
      toast.success(`Successfully enrolled ${studentIds.length} student(s)`);
      setIsEnrollModalOpen(false);
      fetchEnrollments();
    } catch (err) {
      toast.error(err.message || 'Failed to enroll students');
    }
  };

  const handleRemoveEnrollment = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to remove this student from the course?')) return;
    try {
      await enrollmentService.removeEnrollment(enrollmentId);
      toast.success('Student removed from course');
      fetchEnrollments();
    } catch (err) {
      toast.error('Failed to remove student');
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader size="lg" /></div>;
  }

  if (error || !course) {
    return (
      <div className="flex h-64 items-center justify-center flex-col gap-4">
        <p className="text-red-400">Failed to load course details: {error}</p>
        <Button onClick={() => navigate('/admin/courses')}>Back to Courses</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate('/admin/courses')}
            className="mt-1 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold">{course.course_name}</h1>
              <Badge variant={course.status === 'Active' ? 'success' : 'default'}>{course.status}</Badge>
            </div>
            <p className="text-[var(--color-text-secondary)] mt-1">{course.course_code}</p>
          </div>
        </div>
        <Button variant="secondary" icon={Edit2} onClick={() => setIsEditModalOpen(true)}>
          Edit Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Course Overview</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {course.description || 'No description provided for this course.'}
              </p>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Enrolled Students</h2>
              <Button size="sm" icon={Plus} onClick={handleOpenEnrollModal}>
                Enroll Students
              </Button>
            </div>
            <EnrolledStudentsTable 
              enrollments={enrollments} 
              onRemove={handleRemoveEnrollment} 
            />
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
              Course Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-accent-violet)]/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Credits</p>
                  <p className="text-sm font-medium text-white">{course.credits} Credits</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-accent-violet)]/10 rounded-lg">
                  <Monitor className="w-5 h-5 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Type</p>
                  <p className="text-sm font-medium text-white">{course.course_type || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-accent-violet)]/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Department</p>
                  <p className="text-sm font-medium text-white">{course.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-accent-violet)]/10 rounded-lg">
                  <Clock className="w-5 h-5 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Semester</p>
                  <p className="text-sm font-medium text-white">Semester {course.semester}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-accent-violet)]/10 rounded-lg">
                  <Users className="w-5 h-5 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Faculty</p>
                  <p className="text-sm font-medium text-white">{course.assigned_faculty || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <CourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        course={course}
        title="Edit Course"
      />

      <EnrollStudentsModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSubmit={handleEnrollSubmit}
        students={availableStudents}
        loading={loadingStudents}
      />
    </div>
  );
}
