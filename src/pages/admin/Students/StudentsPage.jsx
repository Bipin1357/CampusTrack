import { useState, useEffect } from 'react';
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
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [section, setSection] = useState('All Sections');
  const [status, setStatus] = useState('All Status');
  const [sort, setSort] = useState('Recently Added');
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableSortKey, setTableSortKey] = useState('');
  const [tableSortDir, setTableSortDir] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
  }, [department, semester, section, status, sort, pageSize]);

  const { students, totalCount, loading, error, addStudent, editStudent, removeStudent, refreshStudents } = useStudents({
    page,
    pageSize,
    search: debouncedSearch,
    filters: { department, semester, section, status },
    sortKey: sort,
    tableSortKey,
    tableSortDir,
  });

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));

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
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{totalCount || 0} students enrolled across all departments</p>
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
          students={students} 
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
