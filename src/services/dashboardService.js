import { supabase } from '../supabase/supabaseClient';

const DEPARTMENT_COLORS = ['#6366f1', '#06b6d4', '#22c55e', '#a78bfa', '#f59e0b', '#f43f5e'];

const normalizeStatus = (status) => String(status || '').toLowerCase();
const isAttended = (status) => ['present', 'late'].includes(normalizeStatus(status));

const getMonthBuckets = (count = 6) => {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - (count - 1 - index), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    return {
      start,
      end,
      key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
      month: start.toLocaleDateString('en-US', { month: 'short' }),
    };
  });
};

const getMonthKey = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const calculateDelta = (current, previous) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const getTrend = (delta) => (delta == null || delta >= 0 ? 'up' : 'down');

const ensureSuccess = (response, source) => {
  if (response.error) throw new Error(`Unable to load ${source}: ${response.error.message}`);
  return response.data || [];
};

const getCumulativeStudentGrowth = (students, months) => months.map(({ end, month }) => ({
  month,
  students: students.filter((student) => {
    const createdAt = new Date(student.created_at);
    return !Number.isNaN(createdAt.getTime()) && createdAt < end;
  }).length,
}));

const getAttendanceTrend = (attendance, months) => months.map(({ key, month }) => {
  const records = attendance.filter((record) => getMonthKey(record.attendance_date) === key);
  const attended = records.filter((record) => isAttended(record.status)).length;

  return {
    month,
    rate: records.length ? Math.round((attended / records.length) * 100) : 0,
  };
});

const getDepartmentData = (students) => {
  const counts = students.reduce((totals, student) => {
    const department = student.department || 'Unassigned';
    totals.set(department, (totals.get(department) || 0) + 1);
    return totals;
  }, new Map());

  return [...counts.entries()]
    .map(([name, value], index) => ({ name, value, color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length] }))
    .sort((a, b) => b.value - a.value);
};

const getCourseEnrollmentData = (courses, enrollments) => {
  const enrollmentCounts = enrollments.reduce((totals, enrollment) => {
    if (normalizeStatus(enrollment.status) !== 'active') return totals;
    totals.set(enrollment.course_id, (totals.get(enrollment.course_id) || 0) + 1);
    return totals;
  }, new Map());

  return courses
    .filter((course) => normalizeStatus(course.status) === 'active')
    .map((course) => ({
      course: course.course_name,
      enrolled: enrollmentCounts.get(course.id) || 0,
    }))
    .sort((a, b) => b.enrolled - a.enrolled || a.course.localeCompare(b.course))
    .slice(0, 6);
};

export const dashboardService = {
  async getAnalytics() {
    const [studentsResponse, coursesResponse, enrollmentsResponse, attendanceResponse] = await Promise.all([
      supabase.from('students').select('id, department, created_at'),
      supabase.from('courses').select('id, course_name, faculty, status, created_at'),
      supabase.from('enrollments').select('course_id, status, enrolled_at'),
      supabase.from('attendance').select('status, attendance_date'),
    ]);

    const students = ensureSuccess(studentsResponse, 'students');
    const courses = ensureSuccess(coursesResponse, 'courses');
    const enrollments = ensureSuccess(enrollmentsResponse, 'enrollments');
    const attendance = ensureSuccess(attendanceResponse, 'attendance');

    const months = getMonthBuckets();
    const studentGrowth = getCumulativeStudentGrowth(students, months);
    const attendanceTrend = getAttendanceTrend(attendance, months);
    const activeCourses = courses.filter((course) => normalizeStatus(course.status) === 'active').length;
    const faculty = new Set(courses.map((course) => course.faculty?.trim()).filter(Boolean)).size;
    const attendedRecords = attendance.filter((record) => isAttended(record.status)).length;
    const attendanceRate = attendance.length ? Math.round((attendedRecords / attendance.length) * 100) : 0;

    const previousStudentTotal = studentGrowth.at(-2)?.students ?? 0;
    const previousAttendanceRate = attendanceTrend.at(-2)?.rate ?? 0;
    const previousActiveCourses = courses.filter((course) => {
      const createdAt = new Date(course.created_at);
      return normalizeStatus(course.status) === 'active'
        && !Number.isNaN(createdAt.getTime())
        && createdAt < months.at(-1).start;
    }).length;

    const studentDelta = calculateDelta(students.length, previousStudentTotal);
    const attendanceDelta = calculateDelta(attendanceRate, previousAttendanceRate);
    const courseDelta = calculateDelta(activeCourses, previousActiveCourses);

    return {
      kpis: [
        {
          id: 'kpi-students',
          label: 'Total Students',
          value: students.length,
          delta: studentDelta,
          trend: getTrend(studentDelta),
          sparkline: studentGrowth.map((entry) => entry.students),
        },
        {
          id: 'kpi-faculty',
          label: 'Assigned Faculty',
          value: faculty,
        },
        {
          id: 'kpi-attendance',
          label: 'Avg. Attendance',
          value: attendanceRate,
          unit: '%',
          delta: attendanceDelta,
          trend: getTrend(attendanceDelta),
          sparkline: attendanceTrend.map((entry) => entry.rate),
        },
        {
          id: 'kpi-courses',
          label: 'Active Courses',
          value: activeCourses,
          delta: courseDelta,
          trend: getTrend(courseDelta),
          sparkline: months.map(({ end }) => courses.filter((course) => {
            const createdAt = new Date(course.created_at);
            return normalizeStatus(course.status) === 'active'
              && !Number.isNaN(createdAt.getTime())
              && createdAt < end;
          }).length),
        },
      ],
      studentGrowth,
      departmentEnrollment: getDepartmentData(students),
      courseEnrollment: getCourseEnrollmentData(courses, enrollments),
    };
  },
};
