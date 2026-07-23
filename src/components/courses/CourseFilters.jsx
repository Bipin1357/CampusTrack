import SearchBar from '../common/SearchBar';
import { SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { departments as departmentList } from '../../data/departments';

const departments = ['All Departments', ...departmentList];
const semesters = [
  { label: "All Semesters", value: "all" },
  { label: "Semester 1", value: 1 },
  { label: "Semester 2", value: 2 },
  { label: "Semester 3", value: 3 },
  { label: "Semester 4", value: 4 },
  { label: "Semester 5", value: 5 },
  { label: "Semester 6", value: 6 },
  { label: "Semester 7", value: 7 },
  { label: "Semester 8", value: 8 },
];
const courseTypes = ['All Types', 'Theory', 'Lab'];
const statuses = ['All Status', 'Active', 'Inactive'];

export default function CourseFilters({ 
  search, setSearch, 
  department, setDepartment, 
  semester, setSemester, 
  courseType, setCourseType,
  status, setStatus,
  sort, setSort
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
      <SearchBar 
        value={search} 
        onChange={setSearch} 
        placeholder="Search by course code, name, or faculty…" 
        className="flex-1" 
      />
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
        <SlidersHorizontal className="w-4 h-4 text-[var(--color-text-muted)] hidden sm:block shrink-0" />
        
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-fit min-w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={semester === 'All Semesters' ? 'all' : semester.toString()} onValueChange={(val) => setSemester(val === 'all' ? 'All Semesters' : Number(val))}>
          <SelectTrigger className="w-fit min-w-[130px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((s) => (
              <SelectItem key={s.value} value={s.value.toString()}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={courseType} onValueChange={setCourseType}>
          <SelectTrigger className="w-fit min-w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {courseTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-fit min-w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-fit min-w-[150px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Recently Added">Recently Added</SelectItem>
            <SelectItem value="Oldest">Oldest</SelectItem>
            <SelectItem value="Course Name (A-Z)">Course Name (A-Z)</SelectItem>
            <SelectItem value="Course Name (Z-A)">Course Name (Z-A)</SelectItem>
            <SelectItem value="Credits">Credits</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
