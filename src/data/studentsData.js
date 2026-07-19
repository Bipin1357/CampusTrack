const firstNames = ['Aarav','Maya','Ethan','Zara','Liam','Nora','Kai','Ines','Leo','Sana','Owen','Priya','Felix','Amara','Theo','Wren','Ravi','Elin','Jonah','Nadia','Marco','Yara','Sven','Layla','Dev','Chiara','Amir','Tess','Kian','Lucia']
const lastNames = ['Sharma','Patel','Kim','Novak','Fischer','Adeyemi','Rossi','Nakamura','Silva','Haddad','Larsen','Kapoor','Bergman','Osei','Meyer','Costa','Ivanov','Chen','Rahman','Duarte']
const depts = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Architecture']
const statuses = ['Active', 'Active', 'Active', 'Probation', 'Active', 'Graduated']
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export const students = Array.from({ length: 48 }).map((_, i) => {
  const first = firstNames[i % firstNames.length]
  const last = lastNames[(i * 3) % lastNames.length]
  return {
    id: `stu-${1000 + i}`,
    rollNo: `CT${2021 + (i % 4)}${String(100 + i).padStart(3, '0')}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@student.campustrack.edu`,
    department: depts[i % depts.length],
    year: years[i % years.length],
    status: statuses[i % statuses.length],
    gpa: (2.4 + ((i * 37) % 160) / 100).toFixed(2),
    attendance: 62 + (i % 38),
    phone: `+1 (555) ${String(300 + i).padStart(3, '0')}-02${String(i).padStart(2, '0')}`,
    enrolled: `${2021 + (i % 4)}-08-15`,
  }
})
