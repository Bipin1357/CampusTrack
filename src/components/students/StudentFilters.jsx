import SearchBar from '../common/SearchBar';
import { SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { departments as departmentList } from '../../data/departments';

const departments = ['All Departments', ...departmentList];
const semesters = [
  { label: 'All Semesters', value: 'All Semesters' },
  { label: 'Semester 1', value: '1' },
  { label: 'Semester 2', value: '2' },
  { label: 'Semester 3', value: '3' },
  { label: 'Semester 4', value: '4' },
  { label: 'Semester 5', value: '5' },
  { label: 'Semester 6', value: '6' },
  { label: 'Semester 7', value: '7' },
  { label: 'Semester 8', value: '8' }
];
const sections = ['All Sections', 'A', 'B', 'C'];
const statuses = ['All Status', 'Active', 'Inactive'];

export default function StudentFilters({ 
  search, setSearch, 
  department, setDepartment, 
  semester, setSemester, 
  section, setSection,
  status, setStatus,
  sort, setSort
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
      <SearchBar 
        value={search} 
        onChange={setSearch} 
        placeholder="Search by name, ID, or email…" 
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
        
        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="w-fit min-w-[130px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={section} onValueChange={setSection}>
          <SelectTrigger className="w-fit min-w-[120px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
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
            <SelectItem value="Name (A-Z)">Name (A-Z)</SelectItem>
            <SelectItem value="Name (Z-A)">Name (Z-A)</SelectItem>
            <SelectItem value="Semester">Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
