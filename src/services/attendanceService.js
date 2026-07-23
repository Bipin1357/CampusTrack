import { supabase } from '../supabase/supabaseClient';

export const attendanceService = {
  /**
   * Helper to get current weekday as string (e.g., "Monday")
   */
  getCurrentWeekday() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  },

  /**
   * Helper to format today's date as YYYY-MM-DD
   */
  getTodayDateString() {
    const today = new Date();
    // Use local timezone formatting to avoid UTC date shift issues
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Fetches today's classes for a specific student based on their enrollments.
   * Expects a 'timetable' table linked to 'courses'.
   */
  async getTodayClasses(studentId) {
    const todayStr = this.getCurrentWeekday();

    // Query timetable, join courses, join enrollments to filter by student
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        id,
        start_time,
        end_time,
        room,
        course:courses!inner (
          id,
          course_name,
          faculty,
          enrollments!inner (
            student_id,
            status
          )
        )
      `)
      .eq('weekday', todayStr)
      .eq('course.enrollments.student_id', studentId)
      .eq('course.enrollments.status', 'active');

    if (error) {
      console.error("Error fetching today's classes:", error);
      throw error;
    }

    // Map to a flatter structure
    return data.map(entry => ({
      timetable_id: entry.id,
      course_id: entry.course.id,
      course_name: entry.course.course_name,
      faculty: entry.course.faculty,
      start_time: entry.start_time,
      end_time: entry.end_time,
      room: entry.room
    })).sort((a, b) => a.start_time.localeCompare(b.start_time));
  },

  /**
   * Fetches all attendance records for a student for today.
   */
  async getTodayAttendance(studentId) {
    const todayDate = this.getTodayDateString();

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .eq('date', todayDate);

    if (error) {
      console.error("Error fetching today's attendance:", error);
      throw error;
    }

    // Map into an object for easier O(1) lookups by course_id
    const attendanceMap = {};
    data.forEach(record => {
      attendanceMap[record.course_id] = record;
    });

    return attendanceMap;
  },

  /**
   * Validates time logic.
   * attendance_start = endTime - 10 mins
   * attendance_end = endTime + 30 mins
   * 
   * @param {string} endTimeStr - Format "HH:mm:ss"
   * @returns {object} { isOpen, status, diffSeconds }
   */
  getAttendanceWindowStatus(endTimeStr) {
    const now = new Date();
    
    // Parse endTime string to a Date object for today
    const [hours, minutes, seconds = 0] = endTimeStr.split(':').map(Number);
    const endTime = new Date(now);
    endTime.setHours(hours, minutes, seconds, 0);

    // Calculate window bounds
    const windowStart = new Date(endTime.getTime() - 10 * 60 * 1000); // 10 mins before end
    const windowEnd = new Date(endTime.getTime() + 30 * 60 * 1000);   // 30 mins after end

    if (now < windowStart) {
      const diffSeconds = Math.floor((windowStart - now) / 1000);
      return { isOpen: false, status: 'Upcoming', diffSeconds };
    } else if (now >= windowStart && now <= windowEnd) {
      const diffSeconds = Math.floor((windowEnd - now) / 1000);
      return { isOpen: true, status: 'Open', diffSeconds };
    } else {
      return { isOpen: false, status: 'Closed', diffSeconds: 0 };
    }
  },

  /**
   * Marks a student as present.
   */
  async markAttendance(studentId, courseId, endTimeStr) {
    // 1. Validate window logic locally before sending to DB to avoid unnecessary calls
    const windowStatus = this.getAttendanceWindowStatus(endTimeStr);
    
    if (!windowStatus.isOpen) {
      throw new Error("Attendance window is not open.");
    }

    const todayDate = this.getTodayDateString();

    // 2. Insert record
    const { data, error } = await supabase
      .from('attendance')
      .insert([
        {
          student_id: studentId,
          course_id: courseId,
          date: todayDate,
          status: 'Present',
          marked_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Attendance already marked for this course today.');
      }
      throw error;
    }

    return data;
  },

  // --- ADMIN METHODS ---

  async getAdminAttendanceStats(date = this.getTodayDateString()) {
    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('date', date);

    if (error) throw error;

    let present = 0;
    let absent = 0;
    let late = 0;

    data.forEach(r => {
      if (r.status === 'Present') present++;
      else if (r.status === 'Absent') absent++;
      else if (r.status === 'Late') late++;
    });

    const total = data.length;
    const rate = total === 0 ? 0 : Math.round(((present + late) / total) * 100);

    return { present, absent, late, rate, total };
  },

  async getMonthlyAttendanceTrend(year = new Date().getFullYear()) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from('attendance')
      .select('date, status')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const monthlyStats = Array(12).fill(null).map(() => ({ present: 0, total: 0 }));

    data.forEach(r => {
      const monthIndex = new Date(r.date).getMonth();
      monthlyStats[monthIndex].total++;
      if (r.status === 'Present' || r.status === 'Late') {
        monthlyStats[monthIndex].present++;
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthlyStats.map((stat, i) => ({
      month: monthNames[i],
      rate: stat.total === 0 ? 0 : Math.round((stat.present / stat.total) * 100)
    }));
  },

  async getAttendanceRecords(filters = {}) {
    let query = supabase
      .from('attendance')
      .select(`
        id,
        date,
        status,
        marked_at,
        student:students!inner (id, full_name, student_id, department, semester, section),
        course:courses (id, course_name)
      `, { count: 'exact' });

    if (filters.date) query = query.eq('date', filters.date);
    if (filters.status && filters.status !== 'All Status') query = query.eq('status', filters.status);
    
    query = query.order('date', { ascending: false }).limit(1000);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, count };
  },

  async getStudentsForAttendance(courseId, date) {
    // 1. Get all students enrolled in the course
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        students (id, full_name, student_id)
      `)
      .eq('course_id', courseId)
      .eq('status', 'active');

    if (enrollError) throw enrollError;

    // 2. Get existing attendance for this course and date
    const { data: existingAttendance, error: attError } = await supabase
      .from('attendance')
      .select('*')
      .eq('course_id', courseId)
      .eq('date', date);

    if (attError) throw attError;

    const attendanceMap = {};
    existingAttendance.forEach(a => {
      attendanceMap[a.student_id] = a.status;
    });

    return enrollments.map(e => ({
      student_id: e.students.id,
      student_roll: e.students.student_id,
      student_name: e.students.full_name,
      status: attendanceMap[e.students.id] || null
    })).sort((a, b) => a.student_name.localeCompare(b.student_name));
  },

  async markBulkAttendance(records) {
    const { data, error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,course_id,date' }); // Fixed onConflict string format

    if (error) throw error;
    return data;
  },

  // --- STUDENT METHODS ---
  
  async getStudentAttendanceStats(studentId, currentSemesterOnly = true) {
    // Optionally filter by current semester if needed, using courses/enrollments logic. 
    // For now, fetching all records for this student.
    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('student_id', studentId);
      
    if (error) throw error;

    let present = 0;
    let absent = 0;
    let late = 0;

    data.forEach(r => {
      if (r.status === 'Present') present++;
      else if (r.status === 'Absent') absent++;
      else if (r.status === 'Late') late++;
    });

    const total = data.length;
    const rate = total === 0 ? 100 : Math.round(((present + late) / total) * 100);

    return { present, absent, late, rate, total };
  },

  async getStudentSubjectBreakdown(studentId) {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        status,
        course:courses(id, course_name)
      `)
      .eq('student_id', studentId);
      
    if (error) throw error;

    const breakdown = {};
    data.forEach(r => {
      if (!r.course) return; 
      const courseName = r.course.course_name;
      if (!breakdown[courseName]) breakdown[courseName] = { present: 0, total: 0 };
      
      breakdown[courseName].total++;
      if (r.status === 'Present' || r.status === 'Late') {
        breakdown[courseName].present++;
      }
    });

    return Object.entries(breakdown).map(([subject, counts]) => ({
      subject,
      rate: counts.total === 0 ? 0 : Math.round((counts.present / counts.total) * 100),
      attended: counts.present,
      total: counts.total
    }));
  },

  async getStudentMonthlyChart(studentId, year = new Date().getFullYear()) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from('attendance')
      .select('date, status')
      .eq('student_id', studentId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const monthlyStats = Array(12).fill(null).map(() => ({ present: 0, total: 0 }));

    data.forEach(r => {
      const monthIndex = new Date(r.date).getMonth();
      monthlyStats[monthIndex].total++;
      if (r.status === 'Present' || r.status === 'Late') {
        monthlyStats[monthIndex].present++;
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthlyStats.map((stat, i) => ({
      month: monthNames[i],
      rate: stat.total === 0 ? 0 : Math.round((stat.present / stat.total) * 100)
    }));
  }
};
