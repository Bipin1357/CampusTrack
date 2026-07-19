const depts = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Architecture']
const courses = ['Data Structures', 'Circuit Theory', 'Thermodynamics', 'Structural Analysis', 'Marketing 101', 'Design Studio', 'Algorithms', 'Signals & Systems', 'Fluid Mechanics', 'Corporate Finance']
const invigilators = ['Dr. Ananya Rao', 'Dr. Marcus Webb', 'Dr. Priya Nair', 'Dr. Samuel Okafor', 'Dr. Lena Fischer', 'Dr. Farah Haddad', 'Dr. Chen Wei']
const statuses = ['Scheduled', 'Scheduled', 'Ongoing', 'Completed']
const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']

export const examinations = Array.from({ length: 22 }).map((_, i) => ({
  id: `exam-${i + 1}`,
  course: courses[i % courses.length],
  department: depts[i % depts.length],
  semester: semesters[i % semesters.length],
  date: `2026-08-${String(1 + (i % 20)).padStart(2, '0')}`,
  time: ['09:00 AM', '01:00 PM', '10:30 AM'][i % 3],
  duration: ['2 hrs', '3 hrs'][i % 2],
  room: `Hall ${String.fromCharCode(65 + (i % 5))}-${100 + i}`,
  invigilator: invigilators[i % invigilators.length],
  status: statuses[i % statuses.length],
}))
