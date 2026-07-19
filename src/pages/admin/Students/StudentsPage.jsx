import { useState, useMemo } from 'react';
import { Plus, Download, RefreshCcw } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import { TableSkeleton } from '../../../components/students/LoadingSkeleton';
import ErrorState from '../../../components/students/ErrorState';
import StudentTable from '../../../components/students/StudentTable';
import StudentFilters from '../../../components/students/StudentFilters';
import StudentModal from '../../../components/students/StudentModal';
import DeleteStudentModal from '../../../components/students/DeleteStudentModal';
import { useStudents } from '../../../hooks/useStudents';

export default function StudentsPage() {
  const { students, loading, error, addStudent, editStudent, removeStudent, refreshStudents } = useStudents();
  
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [section, setSection] = useState('All Sections');
  const [status, setStatus] = useState('All Status');
  const [sort, setSort] = useState('Recently Added');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    const filtered = students.filter((s) => {
      const matchesSearch = 
        s.full_name.toLowerCase().includes(search.toLowerCase()) || 
        s.student_id.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesDept = department === 'All Departments' || s.department === department;
      const matchesSem = semester === 'All Semesters' || s.semester === semester;
      const matchesSec = section === 'All Sections' || s.section === section;
      const matchesStatus = status === 'All Status' || s.status === status;
      
      return matchesSearch && matchesDept && matchesSem && matchesSec && matchesStatus;
    });
    
    // Apply sorting
    if (sort === 'Name (A-Z)') {
      filtered.sort((a, b) => a.full_name.localeCompare(b.full_name));
    } else if (sort === 'Name (Z-A)') {
      filtered.sort((a, b) => b.full_name.localeCompare(a.full_name));
    } else if (sort === 'Oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sort === 'Semester') {
      filtered.sort((a, b) => (a.semester || '').localeCompare(b.semester || ''));
    } else {
      // Default: Recently Added
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return filtered;
  }, [students, search, department, semester, section, status, sort]);

  const handleAddClick = () => {
    console.log("Add Student clicked");
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (studentData) => {
    try {
      if (selectedStudent) {
        await editStudent(selectedStudent.id, studentData);
      } else {
        await addStudent(studentData);
      }
      setIsModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeStudent(id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  if (loading && students.length === 0) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error} 
        onRetry={() => {
          refreshStudents();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Students</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{students.length} students enrolled across all departments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={RefreshCcw} size="md" onClick={refreshStudents}>Refresh</Button>
          <Button variant="primary" icon={Plus} size="md" onClick={handleAddClick}>
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <StudentFilters
          search={search} setSearch={setSearch}
          department={department} setDepartment={setDepartment}
          semester={semester} setSemester={setSemester}
          section={section} setSection={setSection}
          status={status} setStatus={setStatus}
          sort={sort} setSort={setSort}
        />
        <StudentTable 
          students={filteredStudents} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Card>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        student={selectedStudent}
        allStudents={students}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
      />

      <DeleteStudentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        student={selectedStudent}
      />
    </div>
  );
}
