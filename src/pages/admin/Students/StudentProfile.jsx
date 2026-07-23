import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, Edit2, Users, BookOpen, Clock, Activity } from 'lucide-react';
import { studentService } from '../../../services/studentService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import Loader from '../../../components/common/Loader';
import Avatar from '../../../components/common/Avatar';
import StudentModal from '../../../components/students/StudentModal';
import { ProfileSkeleton } from '../../../components/students/LoadingSkeleton';
import ErrorState from '../../../components/students/ErrorState';
import { useStudents } from '../../../hooks/useStudents';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editStudent } = useStudents();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await studentService.getStudentById(id);
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchStudent();
  }, [id]);

  const handleEditSubmit = async (studentData) => {
    try {
      console.log("Submitting update:", {
          selectedStudent: student,
          id: student.id,
          user_id: student.user_id,
          student_id: student.student_id
      });
      const updated = await editStudent(student.user_id, studentData);
      setStudent(updated);
      setIsEditModalOpen(false);
    } catch (err) {
      // Handled in hook
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>
        <ErrorState 
          message={error || "Student not found"} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[var(--color-accent-violet)] to-indigo-600 opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <button 
            onClick={() => navigate('/admin/students')}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="mt-8 md:mt-12 w-24 h-24 md:w-32 md:h-32 shrink-0 border-4 border-[var(--color-bg-elevated)] rounded-full overflow-hidden shadow-xl bg-[var(--color-bg-base)] flex items-center justify-center">
            {student.profile_url ? (
              <img src={student.profile_url} alt={student.full_name} className="w-full h-full object-cover" />
            ) : (
              <Avatar name={student.full_name} size="lg" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left md:mt-14">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-white">{student.full_name}</h1>
                <p className="text-[var(--color-text-secondary)] mt-1 text-lg">{student.student_id}</p>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-3">
                <Badge variant={student.status === 'Active' ? 'success' : 'default'} className="text-sm px-3 py-1">
                  {student.status}
                </Badge>
                <Button variant="secondary" icon={Edit2} size="sm" onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Academic Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-[var(--color-text-muted)]">Email</p>
                  <p className="text-sm font-medium text-white truncate">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Phone</p>
                  <p className="text-sm font-medium text-white">{student.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Date of Birth</p>
                  <p className="text-sm font-medium text-white">{student.dob || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Gender</p>
                  <p className="text-sm font-medium text-white">{student.gender || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">
              Academic Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-violet)]/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Department</p>
                  <p className="text-sm font-medium text-white">{student.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-violet)]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Semester</p>
                  <p className="text-sm font-medium text-white">{student.semester ? `Semester ${String(student.semester).replace(/^Semester\s*/i, '').trim()}` : 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-violet)]/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[var(--color-accent-violet)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Section</p>
                  <p className="text-sm font-medium text-white">{student.section}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Statistics & Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-2xl font-bold text-white">--%</h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Attendance</p>
            </Card>
            <Card className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="text-2xl font-bold text-white">--</h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Courses Enrolled</p>
            </Card>
            <Card className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5 text-purple-500" />
              </div>
              <h4 className="text-2xl font-bold text-white">--</h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Current GPA</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Enrolled Courses</h3>
            <div className="flex items-center justify-center h-48 border border-dashed border-[var(--color-border)] rounded-lg">
              <p className="text-sm text-[var(--color-text-muted)]">Course enrollment data will appear here.</p>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Assignment Progress</h3>
            <div className="flex items-center justify-center h-48 border border-dashed border-[var(--color-border)] rounded-lg">
              <p className="text-sm text-[var(--color-text-muted)]">Assignment data will appear here.</p>
            </div>
          </Card>
        </div>
      </div>
      
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        student={student}
        title="Edit Student"
      />
    </div>
  );
}
