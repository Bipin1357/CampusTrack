export const weeklyAttendanceTrend = [
  { day: 'Mon', present: 92, absent: 8 },
  { day: 'Tue', present: 89, absent: 11 },
  { day: 'Wed', present: 94, absent: 6 },
  { day: 'Thu', present: 87, absent: 13 },
  { day: 'Fri', present: 81, absent: 19 },
  { day: 'Sat', present: 76, absent: 24 },
]

export const monthlyAttendanceTrend = [
  { month: 'Jan', rate: 91 }, { month: 'Feb', rate: 89 }, { month: 'Mar', rate: 93 },
  { month: 'Apr', rate: 88 }, { month: 'May', rate: 85 }, { month: 'Jun', rate: 79 },
  { month: 'Jul', rate: 90 }, { month: 'Aug', rate: 92 }, { month: 'Sep', rate: 94 },
  { month: 'Oct', rate: 90 }, { month: 'Nov', rate: 87 }, { month: 'Dec', rate: 83 },
]

const depts = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Architecture']

export const attendanceByDepartment = depts.map((d, i) => ({
  department: d,
  rate: 78 + ((i * 13) % 20),
}))

import { students } from './studentsData'

export const attendanceRecords = students.slice(0, 30).map((s, i) => ({
  id: `att-${i + 1}`,
  studentId: s.id,
  name: s.name,
  rollNo: s.rollNo,
  department: s.department,
  date: `2026-07-${String(1 + (i % 18)).padStart(2, '0')}`,
  status: ['Present', 'Present', 'Present', 'Absent', 'Late'][i % 5],
  course: ['Data Structures', 'Thermodynamics', 'Circuit Theory', 'Structural Analysis', 'Marketing 101'][i % 5],
}))
