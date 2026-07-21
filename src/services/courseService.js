import { supabase } from '../supabase/supabaseClient';

export const courseService = {
  async getCourses(options = {}) {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      filters = {},
      sortKey = 'Recently Added',
      tableSortKey = '',
      tableSortDir = ''
    } = options;

    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' });

    // 1. Search
    if (search) {
      const safeSearch = search.replace(/"/g, '""');
      query = query.or(`course_name.ilike."%${safeSearch}%",course_code.ilike."%${safeSearch}%",faculty.ilike."%${safeSearch}%"`);
    }

    // 2. Filters
    if (filters.department && filters.department !== 'All Departments') {
      query = query.eq('department', filters.department);
    }
    if (filters.semester && filters.semester !== 'All Semesters') {
      query = query.eq('semester', filters.semester);
    }
    if (filters.course_type && filters.course_type !== 'All Types') {
      query = query.eq('course_type', filters.course_type);
    }
    if (filters.status && filters.status !== 'All Status') {
      query = query.eq('status', filters.status);
    }

    // 3. Sorting
    let dbSortKey = 'created_at';
    let dbSortDir = false; // desc by default

    if (tableSortKey) {
      dbSortKey = tableSortKey;
      dbSortDir = tableSortDir === 'asc';
    } else {
      if (sortKey === 'Course Name (A-Z)' || sortKey === 'Course Name (Z-A)') dbSortKey = 'course_name';
      else if (sortKey === 'Oldest' || sortKey === 'Recently Added') dbSortKey = 'created_at';
      else if (sortKey === 'Credits') dbSortKey = 'credits';
      
      dbSortDir = sortKey.includes('(A-Z)') || sortKey === 'Oldest' || sortKey === 'Credits'; // adjust asc as needed
      if (sortKey === 'Course Name (Z-A)' || sortKey === 'Recently Added') dbSortDir = false;
    }

    query = query.order(dbSortKey, { ascending: dbSortDir });

    // 4. Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    
    if (error) throw error;
    
    // Map faculty back to assigned_faculty for the frontend
    const mappedData = data.map(course => ({
      ...course,
      assigned_faculty: course.faculty
    }));

    return { data: mappedData, count };
  },

  async getCourseById(id) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      assigned_faculty: data.faculty
    };
  },

  async createCourse(courseData) {
    const payload = { ...courseData };
    if ('assigned_faculty' in payload) {
      payload.faculty = payload.assigned_faculty;
      delete payload.assigned_faculty;
    }
    
    const { data, error } = await supabase
      .from('courses')
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    return {
      ...data,
      assigned_faculty: data.faculty
    };
  },

  async updateCourse(id, courseData) {
    const payload = { ...courseData };
    if ('assigned_faculty' in payload) {
      payload.faculty = payload.assigned_faculty;
      delete payload.assigned_faculty;
    }
    
    const { data, error } = await supabase
      .from('courses')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return {
      ...data,
      assigned_faculty: data.faculty
    };
  },

  async deleteCourse(id) {
    console.log("courseService.deleteCourse called with id:", id);
    const { data, error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .select();
      
    console.log("Delete response data:", data, "error:", error);
    
    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      const rlsError = new Error("Course not found or deletion blocked by RLS policy");
      console.error(rlsError);
      throw rlsError;
    }
    
    return true;
  }
};
