import { useState, useEffect, useCallback } from 'react';
import { departmentService } from '../services/departmentService';
import toast from 'react-hot-toast';

export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err.message || 'Failed to load departments.');
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const addDepartment = async (departmentData) => {
    try {
      const newDept = await departmentService.createDepartment(departmentData);
      toast.success('Department created successfully');
      await fetchDepartments();
      return newDept;
    } catch (err) {
      console.error('Error adding department:', err);
      toast.error(err.message || 'Failed to create department');
      throw err;
    }
  };

  const editDepartment = async (id, departmentData) => {
    try {
      const updatedDept = await departmentService.updateDepartment(id, departmentData);
      toast.success('Department updated successfully');
      await fetchDepartments();
      return updatedDept;
    } catch (err) {
      console.error('Error updating department:', err);
      toast.error(err.message || 'Failed to update department');
      throw err;
    }
  };

  const removeDepartment = async (id, name, code) => {
    try {
      await departmentService.deleteDepartment(id, name, code);
      toast.success('Department deleted successfully');
      await fetchDepartments();
    } catch (err) {
      console.error('Error deleting department:', err);
      toast.error(err.message || 'Failed to delete department');
      throw err;
    }
  };

  return {
    departments,
    loading,
    error,
    addDepartment,
    editDepartment,
    removeDepartment,
    refreshDepartments: fetchDepartments
  };
}
