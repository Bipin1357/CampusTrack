import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/studentService';
import toast from 'react-hot-toast';

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = async (studentData) => {
    try {
      const newStudent = await studentService.createStudent(studentData);
      setStudents(prev => [newStudent, ...prev]);
      toast.success('Student created successfully');
      return newStudent;
    } catch (err) {
      console.error('Error adding student:', err);
      toast.error(err.message || 'Failed to create student');
      throw err;
    }
  };

  const editStudent = async (id, studentData) => {
    try {
      const updatedStudent = await studentService.updateStudent(id, studentData);
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      toast.success('Student updated successfully');
      return updatedStudent;
    } catch (err) {
      console.error('Error updating student:', err);
      toast.error(err.message || 'Failed to update student');
      throw err;
    }
  };

  const removeStudent = async (id) => {
    try {
      await studentService.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      console.error('Error deleting student:', err);
      toast.error('Failed to delete student');
      throw err;
    }
  };

  return {
    students,
    loading,
    error,
    addStudent,
    editStudent,
    removeStudent,
    refreshStudents: fetchStudents
  };
}
