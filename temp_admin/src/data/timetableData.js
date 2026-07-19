export const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00']
export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const courses = [
  { course: 'Data Structures', room: 'CS-201', faculty: 'Dr. Ananya Rao', color: '#6366f1' },
  { course: 'Circuit Theory', room: 'EE-104', faculty: 'Dr. Marcus Webb', color: '#a78bfa' },
  { course: 'Thermodynamics', room: 'ME-302', faculty: 'Dr. Priya Nair', color: '#22c55e' },
  { course: 'Structural Analysis', room: 'CE-108', faculty: 'Dr. Samuel Okafor', color: '#f59e0b' },
  { course: 'Marketing 101', room: 'BA-210', faculty: 'Dr. Lena Fischer', color: '#06b6d4' },
  { course: 'Design Studio', room: 'AR-301', faculty: 'Dr. Farah Haddad', color: '#f43f5e' },
  { course: 'Algorithms', room: 'CS-202', faculty: 'Dr. Chen Wei', color: '#6366f1' },
  { course: 'Signals & Systems', room: 'EE-105', faculty: 'Dr. Elena Petrova', color: '#a78bfa' },
]

export const departmentOptions = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Architecture']

function buildGrid() {
  const grid = {}
  weekDays.forEach((day, di) => {
    grid[day] = {}
    timeSlots.forEach((slot, si) => {
      // leave some slots empty for a realistic look
      if ((di + si) % 4 === 3) {
        grid[day][slot] = null
      } else {
        grid[day][slot] = courses[(di * timeSlots.length + si) % courses.length]
      }
    })
  })
  return grid
}

export const timetableGrid = buildGrid()
