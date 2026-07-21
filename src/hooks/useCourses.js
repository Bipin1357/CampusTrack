import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/courseService';
import toast from 'react-hot-toast';

export function useCourses(options = {}) {
  const [courses, setCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We stringify options so useCallback dependencies are stable
  const optionsString = JSON.stringify(options);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const parsedOptions = JSON.parse(optionsString);
      const { data, count } = await courseService.getCourses(parsedOptions);
      setCourses(data);
      setTotalCount(count);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [optionsString]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (courseData) => {
    try {
      const newCourse = await courseService.createCourse(courseData);
      setCourses(prev => [newCourse, ...prev]);
      toast.success('Course created successfully');
      return newCourse;
    } catch (err) {
      console.error('Error adding course:', err);
      toast.error(err.message || 'Failed to create course');
      throw err;
    }
  };

  const editCourse = async (id, courseData) => {
    try {
      const updatedCourse = await courseService.updateCourse(id, courseData);
      setCourses(prev => prev.map(c => c.id === id ? updatedCourse : c));
      toast.success('Course updated successfully');
      return updatedCourse;
    } catch (err) {
      console.error('Error updating course:', err);
      toast.error(err.message || 'Failed to update course');
      throw err;
    }
  };

  const removeCourse = async (id) => {
    console.log("useCourses.removeCourse called with id:", id);
    try {
      await courseService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success('Course deleted successfully');
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error(`Failed to delete course: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };

  return {
    courses,
    totalCount,
    loading,
    error,
    addCourse,
    editCourse,
    removeCourse,
    refreshCourses: fetchCourses
  };
}
