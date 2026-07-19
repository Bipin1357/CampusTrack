import SearchBar from '../common/SearchBar';
import { SlidersHorizontal } from 'lucide-react';

const departments = ['All Departments', 'Computer Science', 'Business', 'Engineering', 'Arts', 'Science'];
const semesters = ['All Semesters', 'Fall 2026', 'Spring 2026', 'Summer 2026'];
const statuses = ['All Status', 'Active', 'Inactive'];

export default function CourseFilters({ search, setSearch, department, setDepartment, semester, setSemester, status, setStatus }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
      <SearchBar 
        value={search} 
        onChange={setSearch} 
        placeholder="Search by course code or name…" 
        className="flex-1" 
      />
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
        <SlidersHorizontal className="w-4 h-4 text-[var(--color-text-muted)] hidden sm:block shrink-0" />
        
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]"
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]"
        >
          {semesters.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-violet)]"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
