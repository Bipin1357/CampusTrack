import { supabase } from '../supabase/supabaseClient';

export const timetableService = {
  /**
   * Helper to format today's date as YYYY-MM-DD
   */
  getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Helper to get current weekday as string (e.g., "Monday")
   */
  getCurrentWeekday() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  },

  /**
   * Checks for overlapping classes for the same section.
   */
  async _checkOverlap(classData, excludeId = null) {
    let query = supabase
      .from('timetable')
      .select('id')
      .eq('day_of_week', classData.day_of_week)
      .eq('semester', classData.semester)
      .eq('section', classData.section)
      // Check if the new class overlaps with any existing class time
      // An overlap occurs if (new_start < existing_end) AND (new_end > existing_start)
      .lt('start_time', classData.end_time)
      .gt('end_time', classData.start_time);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data && data.length > 0;
  },

  /**
   * Checks for duplicate exact entries (same course, day, time).
   */
  async _checkDuplicate(classData, excludeId = null) {
    let query = supabase
      .from('timetable')
      .select('id')
      .eq('course_id', classData.course_id)
      .eq('day_of_week', classData.day_of_week)
      .eq('start_time', classData.start_time)
      .eq('end_time', classData.end_time);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data && data.length > 0;
  },

  async createClass(classData) {
    if (classData.start_time >= classData.end_time) {
      throw new Error("Start time must be before end time.");
    }

    const isDuplicate = await this._checkDuplicate(classData);
    if (isDuplicate) throw new Error("A duplicate class for this course, day, and time already exists.");

    const isOverlap = await this._checkOverlap(classData);
    if (isOverlap) throw new Error("This class overlaps with an existing class for the same semester and section.");

    const { data, error } = await supabase
      .from('timetable')
      .insert([classData])
      .select(`*, course:courses(course_name, course_code)`)
      .single();

    if (error) throw error;
    return data;
  },

  async updateClass(id, classData) {
    if (classData.start_time >= classData.end_time) {
      throw new Error("Start time must be before end time.");
    }

    const isDuplicate = await this._checkDuplicate(classData, id);
    if (isDuplicate) throw new Error("A duplicate class for this course, day, and time already exists.");

    const isOverlap = await this._checkOverlap(classData, id);
    if (isOverlap) throw new Error("This class overlaps with an existing class for the same semester and section.");

    const { data, error } = await supabase
      .from('timetable')
      .update(classData)
      .eq('id', id)
      .select(`*, course:courses(course_name, course_code)`)
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClass(id) {
    const { error } = await supabase
      .from('timetable')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async getWeeklyTimetable(filters = {}) {
    let query = supabase
      .from('timetable')
      .select(`
        *,
        course:courses(course_name, course_code)
      `);

    if (filters.day_of_week && filters.day_of_week !== 'All Days') {
      query = query.eq('day_of_week', filters.day_of_week);
    }
    if (filters.course_id && filters.course_id !== 'All Courses') {
      query = query.eq('course_id', filters.course_id);
    }
    if (filters.semester && filters.semester !== 'All Semesters') {
      query = query.eq('semester', filters.semester);
    }
    if (filters.section && filters.section !== 'All Sections') {
      query = query.eq('section', filters.section);
    }

    // Sorting by day, then by start_time
    // Supabase order supports multiple columns
    // However, sorting by day name alphabetically isn't logical (Friday before Monday)
    // We'll fetch and sort in JavaScript for simplicity if needed, but we can just order by start_time here.
    query = query.order('start_time', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    return data;
  },

  async getTodayClasses(studentId) {
    const todayStr = this.getCurrentWeekday();

    // Student should only see classes for their enrolled courses, matching their semester/section.
    // Fetch student's profile to get their semester and section.
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('semester, section')
      .eq('user_id', studentId)
      .single();

    if (studentError) {
      console.error("Error fetching student profile for timetable:", studentError);
      throw studentError;
    }

    const { semester, section } = studentData;

    if (!semester || !section) {
      return [];
    }

    // Now fetch timetable for today, matching semester & section, and where student is enrolled in the course
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        *,
        course:courses!inner (
          id,
          course_name,
          course_code,
          enrollments!inner (
            student_id,
            status
          )
        )
      `)
      .eq('day_of_week', todayStr)
      .eq('semester', semester)
      .eq('section', section)
      .eq('course.enrollments.student_id', studentId)
      .eq('course.enrollments.status', 'active')
      .order('start_time', { ascending: true });

    if (error) {
      console.error("Error fetching today's student classes:", error);
      throw error;
    }

    return data;
  },

  async getWeeklyClasses(studentId) {
    // Fetch student's profile to get their semester and section.
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('semester, section')
      .eq('user_id', studentId)
      .single();

    if (studentError) {
      console.error("Error fetching student profile for timetable:", studentError);
      throw studentError;
    }

    const { semester, section } = studentData;

    if (!semester || !section) {
      return [];
    }

    // Now fetch timetable for the whole week, matching semester & section, and where student is enrolled
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        *,
        course:courses!inner (
          id,
          course_name,
          course_code,
          enrollments!inner (
            student_id,
            status
          )
        )
      `)
      .eq('semester', semester)
      .eq('section', section)
      .eq('course.enrollments.student_id', studentId)
      .eq('course.enrollments.status', 'active')
      .order('start_time', { ascending: true });

    if (error) {
      console.error("Error fetching student weekly classes:", error);
      throw error;
    }

    return data;
  },

  async getClassesByCourse(courseId) {
    const { data, error } = await supabase
      .from('timetable')
      .select(`*, course:courses(course_name)`)
      .eq('course_id', courseId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getClassesByDay(dayOfWeek) {
    const { data, error } = await supabase
      .from('timetable')
      .select(`*, course:courses(course_name)`)
      .eq('day_of_week', dayOfWeek)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },
  
  /**
   * Helper for determining class status (Upcoming, Ongoing, Completed)
   * Also returns diffs for future attendance usage.
   */
  getClassStatus(startTimeStr, endTimeStr) {
    const now = new Date();
    
    // Parse times
    const [startH, startM, startS = 0] = startTimeStr.split(':').map(Number);
    const [endH, endM, endS = 0] = endTimeStr.split(':').map(Number);
    
    const startTime = new Date(now);
    startTime.setHours(startH, startM, startS, 0);
    
    const endTime = new Date(now);
    endTime.setHours(endH, endM, endS, 0);
    
    // Setup attendance window for future compatibility
    const attendanceStart = new Date(endTime.getTime() - 10 * 60 * 1000);
    const attendanceEnd = new Date(endTime.getTime() + 30 * 60 * 1000);

    if (now < startTime) {
      return { status: 'Upcoming', label: 'Upcoming', tone: 'info', attendanceStart, attendanceEnd };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'Ongoing', label: 'Ongoing', tone: 'warning', attendanceStart, attendanceEnd };
    } else {
      return { status: 'Completed', label: 'Completed', tone: 'success', attendanceStart, attendanceEnd };
    }
  }
};
