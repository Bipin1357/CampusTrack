import { supabase } from '../supabase/supabaseClient';

const ATTENDED_STATUSES = new Set(['present', 'late']);
const normalizeAttendanceStatus = (status) => String(status || '').toLowerCase();

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
   * Helper to format 24h time string (e.g. "09:00:00") into 12h AM/PM string (e.g. "09:00 AM")
   */
  formatTime12Hour(timeStr) {
    if (!timeStr) return '';
    const parts = String(timeStr).split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || '00';
    if (isNaN(hours)) return timeStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  },

  /**
   * Fetches today's classes for a specific student based on their enrollments.
   * Expects a 'timetable' table linked to 'courses'.
   */
  async getTodayClasses(studentId) {
    if (!studentId) return [];
    const todayStr = this.getCurrentWeekday();

    try {
      // 1. Query timetable using enrollments join for active student enrollments
      let { data, error } = await supabase
        .from('timetable')
        .select(`
          id,
          start_time,
          end_time,
          classroom,
          faculty_name,
          course:courses!inner (
            id,
            course_name,
            enrollments!inner (
              student_id,
              status
            )
          )
        `)
        .eq('day_of_week', todayStr)
        .eq('course.enrollments.student_id', studentId)
        .eq('course.enrollments.status', 'active');

      // 2. Fallback: if enrollments join is empty or encounters error, query timetable by student's semester and section
      if (error || !data || data.length === 0) {
        const { data: student } = await supabase
          .from('students')
          .select('semester, section')
          .eq('id', studentId)
          .maybeSingle();

        if (student && student.semester && student.section) {
          const { data: secData, error: secError } = await supabase
            .from('timetable')
            .select(`
              id,
              start_time,
              end_time,
              classroom,
              faculty_name,
              course:courses!inner (
                id,
                course_name
              )
            `)
            .eq('day_of_week', todayStr)
            .eq('semester', student.semester)
            .eq('section', student.section);

          if (!secError && secData) {
            data = secData;
            error = null;
          }
        }
      }

      if (error || !data || data.length === 0) {
        return [];
      }

      // Map to a flatter structure
      return data.map(entry => ({
        timetable_id: entry.id,
        course_id: entry.course?.id,
        course_name: entry.course?.course_name || 'Class',
        faculty: entry.faculty_name || 'Faculty',
        start_time: entry.start_time,
        end_time: entry.end_time,
        classroom: entry.classroom || 'N/A',
        room: entry.classroom || 'N/A'
      })).sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
    } catch (err) {
      console.warn("Error fetching today's classes:", err);
      return [];
    }
  },

  /**
   * Fetches all attendance records for a student for today.
   */
  async getTodayAttendance(studentId) {
    if (!studentId) return {};
    const todayDate = this.getTodayDateString();

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('attendance_date', todayDate);

      if (error) {
        console.error("Error fetching today's attendance:", error);
        return {};
      }

      // Map into an object for easy lookups by timetable_id and course_id
      const attendanceMap = {};
      (data || []).forEach(record => {
        if (record.timetable_id) {
          attendanceMap[record.timetable_id] = record;
        }
        if (record.course_id) {
          attendanceMap[record.course_id] = record;
        }
        if (record.timetable_id && record.course_id) {
          attendanceMap[`${record.timetable_id}_${record.course_id}`] = record;
        }
      });

      return attendanceMap;
    } catch (err) {
      console.warn("Error fetching today's attendance:", err);
      return {};
    }
  },

  /**
   * Calculates 50-minute attendance window status.
   * attendanceOpen = classEndTime
   * attendanceClose = classEndTime + 50 minutes
   * 
   * @param {string} endTimeStr - Format "HH:mm:ss" or "HH:mm"
   * @returns {object} { isOpen, status, diffSeconds, openTimeStr, closeTimeStr }
   */
  getAttendanceWindowStatus(endTimeStr) {
    if (!endTimeStr) {
      return { isOpen: false, status: 'Closed', diffSeconds: 0, openTimeStr: '', closeTimeStr: '' };
    }

    const now = new Date();
    const parts = String(endTimeStr).split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;

    const windowOpen = new Date(now);
    windowOpen.setHours(hours, minutes, seconds, 0);

    const windowClose = new Date(windowOpen.getTime() + 50 * 60 * 1000);

    const openTimeFormatted = this.formatTime12Hour(endTimeStr);
    const closeHours = windowClose.getHours().toString().padStart(2, '0');
    const closeMins = windowClose.getMinutes().toString().padStart(2, '0');
    const closeTimeFormatted = this.formatTime12Hour(`${closeHours}:${closeMins}:00`);

    if (now < windowOpen) {
      const diffSeconds = Math.floor((windowOpen - now) / 1000);
      return {
        isOpen: false,
        status: 'Pending',
        diffSeconds,
        openTimeStr: openTimeFormatted,
        closeTimeStr: closeTimeFormatted
      };
    } else if (now >= windowOpen && now <= windowClose) {
      const diffSeconds = Math.floor((windowClose - now) / 1000);
      return {
        isOpen: true,
        status: 'Open',
        diffSeconds,
        openTimeStr: openTimeFormatted,
        closeTimeStr: closeTimeFormatted
      };
    } else {
      return {
        isOpen: false,
        status: 'Closed',
        diffSeconds: 0,
        openTimeStr: openTimeFormatted,
        closeTimeStr: closeTimeFormatted
      };
    }
  },

  /**
   * Marks a student as present during open window.
   */
  async markAttendance(studentId, courseId, timetableId, endTimeStr) {
    // 1. Validate window logic locally
    const windowStatus = this.getAttendanceWindowStatus(endTimeStr);
    if (!windowStatus.isOpen) {
      throw new Error("Attendance window is closed or not open yet.");
    }

    const todayDate = this.getTodayDateString();

    // 2. Client-side check for existing record
    let existingQuery = supabase
      .from('attendance')
      .select('id')
      .eq('student_id', studentId)
      .eq('attendance_date', todayDate);

    if (timetableId) {
      existingQuery = existingQuery.eq('timetable_id', timetableId);
    } else if (courseId) {
      existingQuery = existingQuery.eq('course_id', courseId);
    }

    const { data: existingRecords } = await existingQuery;
    if (existingRecords && existingRecords.length > 0) {
      throw new Error('Attendance already marked.');
    }

    // 3. Insert record
    const payload = {
      student_id: studentId,
      course_id: courseId,
      attendance_date: todayDate,
      status: 'present',
      marked_at: new Date().toISOString()
    };

    if (timetableId) {
      payload.timetable_id = timetableId;
    }

    let { data, error } = await supabase
      .from('attendance')
      .insert([payload])
      .select()
      .single();

    if (error && error.code === '42703' && timetableId) {
      // If timetable_id column doesn't exist in schema, retry without it
      delete payload.timetable_id;
      const res = await supabase
        .from('attendance')
        .insert([payload])
        .select()
        .single();
      data = res.data;
      error = res.error;
    }

    if (error) {
      if (error.code === '23505') {
        throw new Error('Attendance already marked.');
      }
      throw error;
    }

    return data;
  },

  // --- ADMIN METHODS ---

  async getAdminAttendanceStats(attendanceDate = this.getTodayDateString()) {
    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('attendance_date', attendanceDate);

    if (error) throw error;

    let present = 0;
    let absent = 0;
    let late = 0;

    data.forEach(r => {
      const status = normalizeAttendanceStatus(r.status);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
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
      .select('attendance_date, status')
      .gte('attendance_date', startDate)
      .lte('attendance_date', endDate);

    if (error) throw error;

    const monthlyStats = Array(12).fill(null).map(() => ({ present: 0, total: 0 }));

    data.forEach(r => {
      const monthIndex = new Date(r.attendance_date).getMonth();
      monthlyStats[monthIndex].total++;
      if (ATTENDED_STATUSES.has(normalizeAttendanceStatus(r.status))) {
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
        attendance_date,
        status,
        marked_at,
        student:students!inner (id, full_name, student_id, department, semester, section),
        course:courses (id, course_name)
      `, { count: 'exact' });

    if (filters.date) query = query.eq('attendance_date', filters.date);
    if (filters.status && filters.status !== 'All Status') query = query.eq('status', filters.status.toLowerCase());
    
    query = query.order('attendance_date', { ascending: false }).limit(1000);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, count };
  },

  /**
   * Fetches students eligible for attendance of the given course on the given date,
   * filtered by semester and section.
   *
   * @param {string} courseId - UUID of the selected course
   * @param {string} attendanceDate - YYYY-MM-DD string
   * @param {string|number} [semester] - Selected semester (e.g., 1-8)
   * @param {string} [section] - Selected section (e.g., "A", "B")
   * @returns {Promise<Array>} Sorted array of { student_id, student_roll, student_name, status, semester, section }
   */
  async getStudentsForAttendance(courseId, attendanceDate, semester = null, section = null) {
    let targetSemester = semester;
    let targetSection = section;

    // Fallback: Resolve semester + section from timetable if not explicitly passed
    if (!targetSemester || !targetSection) {
      const { data: timetableEntries, error: timetableError } = await supabase
        .from('timetable')
        .select('semester, section')
        .eq('course_id', courseId)
        .limit(1);

      if (timetableError) throw timetableError;

      if (!timetableEntries || timetableEntries.length === 0) {
        throw new Error(
          'No timetable entry found for this course. ' +
          'Please select semester and section or add the course to the timetable.'
        );
      }

      targetSemester = timetableEntries[0].semester;
      targetSection = timetableEntries[0].section;
    }

    if (!targetSemester || !targetSection) {
      throw new Error(
        'Semester and section are required to load students.'
      );
    }

    // ── Step 1: Fetch students for this semester + section ──────────────────
    const { data: semSecStudents, error: studentError } = await supabase
      .from('students')
      .select('id, full_name, student_id')
      .eq('semester', targetSemester)
      .eq('section', targetSection)
      .order('full_name', { ascending: true });

    if (studentError) throw studentError;

    // ── Step 2: Enrollment intersection (if any active enrollments exist for this course)
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('course_id', courseId)
      .eq('status', 'active');

    if (enrollError) throw enrollError;

    let eligibleStudents = semSecStudents || [];

    if (enrollments && enrollments.length > 0) {
      // Enrollments exist → keep only the intersection of students enrolled in this course
      const enrolledIds = new Set(enrollments.map(e => e.student_id));
      eligibleStudents = semSecStudents.filter(s => enrolledIds.has(s.id));
    }

    // ── Step 3: Merge existing attendance status ────────────────────────────
    const { data: existingAttendance, error: attError } = await supabase
      .from('attendance')
      .select('student_id, status')
      .eq('course_id', courseId)
      .eq('attendance_date', attendanceDate);

    if (attError) throw attError;

    const attendanceMap = {};
    (existingAttendance || []).forEach(a => {
      attendanceMap[a.student_id] = normalizeAttendanceStatus(a.status);
    });

    return eligibleStudents.map(s => ({
      student_id: s.id,
      student_roll: s.student_id,
      student_name: s.full_name,
      status: attendanceMap[s.id] || null,
      semester: targetSemester,
      section: targetSection,
    }));
  },

  async markBulkAttendance(records) {
    const { data, error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,course_id,attendance_date' });

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
      const status = normalizeAttendanceStatus(r.status);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
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
      if (ATTENDED_STATUSES.has(normalizeAttendanceStatus(r.status))) {
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
      .select('attendance_date, status')
      .eq('student_id', studentId)
      .gte('attendance_date', startDate)
      .lte('attendance_date', endDate);

    if (error) throw error;

    const monthlyStats = Array(12).fill(null).map(() => ({ present: 0, total: 0 }));

    data.forEach(r => {
      const monthIndex = new Date(r.attendance_date).getMonth();
      monthlyStats[monthIndex].total++;
      if (ATTENDED_STATUSES.has(normalizeAttendanceStatus(r.status))) {
        monthlyStats[monthIndex].present++;
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthlyStats.map((stat, i) => ({
      month: monthNames[i],
      rate: stat.total === 0 ? 0 : Math.round((stat.present / stat.total) * 100)
    }));
  },

  async getStudentAttendanceHistory(studentId) {
    if (!studentId) return [];

    try {
      // Query attendance with course & timetable details
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          attendance_date,
          status,
          marked_at,
          timetable_id,
          course:courses (id, course_name, course_code),
          timetable:timetable (id, faculty_name)
        `)
        .eq('student_id', studentId)
        .order('attendance_date', { ascending: false })
        .order('marked_at', { ascending: false });

      if (error) {
        // Fallback without timetable join if constraint isn't established
        const { data: fallbackData, error: fbErr } = await supabase
          .from('attendance')
          .select(`
            id,
            attendance_date,
            status,
            marked_at,
            course:courses (id, course_name, course_code)
          `)
          .eq('student_id', studentId)
          .order('attendance_date', { ascending: false });

        if (fbErr) throw fbErr;
        return (fallbackData || []).map(r => ({
          id: r.id,
          date: r.attendance_date,
          subject: r.course?.course_name || 'Course',
          faculty: 'Faculty',
          status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : 'Unknown',
          marked_at: r.marked_at
        }));
      }

      return (data || []).map(r => ({
        id: r.id,
        date: r.attendance_date,
        subject: r.course?.course_name || 'Course',
        faculty: r.timetable?.faculty_name || 'Faculty',
        status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : 'Unknown',
        marked_at: r.marked_at
      }));
    } catch (err) {
      console.warn("Error fetching student attendance history:", err);
      return [];
    }
  }
};
