import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Calendar, User, BookOpen, Clock, History } from 'lucide-react';

export default function AttendanceHistoryTable({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <Card className="p-8 text-center space-y-3 bg-[#1E293B] border border-white/10 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-[#10B981]/15 text-[#34D399] flex items-center justify-center mx-auto">
          <History className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-white text-base font-display">No Attendance History Found</h4>
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
          Your attendance records will appear here as classes are completed and attendance is marked.
        </p>
      </Card>
    );
  }

  const formatTimeMarked = (timestamp) => {
    if (!timestamp) return '—';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '—';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'present') {
      return <Badge tone="success" dot>Present</Badge>;
    } else if (s === 'late') {
      return <Badge tone="warning" dot>Late</Badge>;
    } else if (s === 'absent') {
      return <Badge tone="danger" dot>Absent</Badge>;
    }
    return <Badge tone="neutral">{status || 'Unknown'}</Badge>;
  };

  return (
    <Card className="overflow-hidden border border-white/10 rounded-2xl bg-[#1E293B]">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <History className="w-5 h-5 text-[#34D399]" />
            Attendance History
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Complete record of your past class attendance
          </p>
        </div>
        <Badge tone="accent">{history.length} {history.length === 1 ? 'Record' : 'Records'}</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
          <thead className="bg-[#111827] text-xs uppercase font-semibold text-white/70 tracking-wider border-b border-white/10">
            <tr>
              <th className="px-6 py-4">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#34D399]" />
                  Date
                </span>
              </th>
              <th className="px-6 py-4">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#34D399]" />
                  Subject
                </span>
              </th>
              <th className="px-6 py-4">
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#34D399]" />
                  Faculty
                </span>
              </th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#34D399]" />
                  Time Marked
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {formatDate(record.date)}
                </td>
                <td className="px-6 py-4 text-white font-semibold whitespace-nowrap">
                  {record.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.faculty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-6 py-4 text-xs font-mono whitespace-nowrap text-[var(--color-text-muted)]">
                  {formatTimeMarked(record.marked_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
