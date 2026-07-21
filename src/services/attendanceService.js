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
  }
};
