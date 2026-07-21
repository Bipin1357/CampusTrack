import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { Search } from 'lucide-react';

export default function EnrollStudentsModal({ isOpen, onClose, onSubmit, students, loading }) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIds(new Set());
    }
  }, [isOpen]);

  const toggleStudentSelection = (studentId) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedIds));
  };

  // Only show matching students based on local filter if search isn't done on backend
  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.student_id.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal open={isOpen} onClose={onClose} title="Enroll Students">
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input 
            type="text" 
            placeholder="Search by name, email or roll number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-accent-violet)]"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
              No students found matching your search.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isEnrolled = student.is_enrolled;
              const isSelected = selectedIds.has(student.id);

              return (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isEnrolled 
                      ? 'border-[var(--color-border)] opacity-60 bg-white/5 cursor-not-allowed' 
                      : isSelected
                        ? 'border-[var(--color-accent-violet)] bg-[var(--color-accent-violet)]/10 cursor-pointer'
                        : 'border-[var(--color-border)] hover:border-white/20 cursor-pointer'
                  }`}
                  onClick={() => !isEnrolled && toggleStudentSelection(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      {!isEnrolled && (
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-600 text-[var(--color-accent-violet)] focus:ring-[var(--color-accent-violet)] focus:ring-offset-gray-900 bg-transparent cursor-pointer"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent div onClick
                        />
                      )}
                    </div>
                    <Avatar name={student.full_name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-[var(--color-text-primary)] truncate">{student.full_name}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{student.student_id} • {student.department}</p>
                    </div>
                  </div>
                  <div>
                    {isEnrolled && (
                      <Badge tone="neutral" className="text-xs">Already Enrolled</Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading || selectedIds.size === 0}
          >
            {loading ? 'Enrolling...' : `Enroll Selected (${selectedIds.size})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
