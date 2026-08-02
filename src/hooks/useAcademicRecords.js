import { useState, useEffect, useCallback } from 'react';
import { academicRecordService } from '../services/academicRecordService';
import toast from 'react-hot-toast';

export function useAcademicRecords(studentId) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!studentId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await academicRecordService.getStudentAcademicRecords(studentId);
      setRecords(data || []);
    } catch (err) {
      console.error('Error in useAcademicRecords:', err);
      setError(err.message || 'Failed to fetch academic records.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (recordData) => {
    try {
      const newRecord = await academicRecordService.createAcademicRecord({
        ...recordData,
        student_id: studentId,
      });
      toast.success(`Semester ${recordData.semester} record added successfully!`);
      await fetchRecords();
      return newRecord;
    } catch (err) {
      toast.error(err.message || 'Failed to add academic record');
      throw err;
    }
  };

  const editRecord = async (id, recordData) => {
    try {
      const updatedRecord = await academicRecordService.updateAcademicRecord(id, recordData);
      toast.success(`Semester ${recordData.semester} record updated successfully!`);
      await fetchRecords();
      return updatedRecord;
    } catch (err) {
      toast.error(err.message || 'Failed to update academic record');
      throw err;
    }
  };

  const removeRecord = async (id, semester) => {
    try {
      await academicRecordService.deleteAcademicRecord(id);
      toast.success(`Semester ${semester || ''} record deleted.`);
      await fetchRecords();
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete academic record');
      throw err;
    }
  };

  const stats = academicRecordService.calculateStatistics(records);

  return {
    records,
    stats,
    loading,
    error,
    refresh: fetchRecords,
    addRecord,
    editRecord,
    removeRecord,
    deleteRecord: removeRecord,
  };
}
