import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { attendanceService } from '../../services/attendanceService';
import { Clock, MapPin, CheckCircle2, Timer, Sparkles } from 'lucide-react';

export default function TodayClassCard({ cls, attendanceRecord, onMarkAttendance }) {
  const [submitting, setSubmitting] = useState(false);

  const windowStatus = attendanceService.getAttendanceWindowStatus(cls.end_time);
  const startTimeFormatted = attendanceService.formatTime12Hour(cls.start_time);
  const endTimeFormatted = attendanceService.formatTime12Hour(cls.end_time);

  // Determine state
  const isMarked = !!attendanceRecord;
  const { isOpen, status, diffSeconds, openTimeStr, closeTimeStr } = windowStatus;

  let currentState = 'Closed';
  if (isMarked) {
    currentState = 'Marked';
  } else if (isOpen) {
    currentState = 'Open';
  } else if (status === 'Pending') {
    currentState = 'Pending';
  } else {
    currentState = 'Closed';
  }

  // Format ticking countdown time e.g., "34m 12s"
  const formatCountdown = (totalSeconds) => {
    if (totalSeconds <= 0) return '00m 00s';
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleMarkClick = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onMarkAttendance(cls.course_id, cls.timetable_id, cls.end_time);
    } finally {
      setSubmitting(false);
    }
  };

  // Format marked time
  const markedTimeFormatted = attendanceRecord?.marked_at
    ? new Date(attendanceRecord.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <Card className="p-6 transition-all duration-300 hover:border-[#10B981]/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden group">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
        currentState === 'Marked' ? 'bg-gradient-to-r from-[#10B981] to-[#34D399]' :
        currentState === 'Open' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
        currentState === 'Pending' ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
        'bg-gradient-to-r from-rose-500 to-red-600'
      }`} />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Left Info Section */}
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-white tracking-tight font-display">
              {cls.course_name}
            </h3>

            {currentState === 'Marked' && (
              <Badge tone="accent" dot className="bg-[#10B981]/20 text-[#34D399] border-[#10B981]/30">
                🟢 Attendance Marked
              </Badge>
            )}
            {currentState === 'Open' && (
              <Badge tone="success" dot className="animate-pulse bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                🟢 Attendance Open
              </Badge>
            )}
            {currentState === 'Pending' && (
              <Badge tone="warning" dot className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                🟡 Pending
              </Badge>
            )}
            {currentState === 'Closed' && (
              <Badge tone="danger" dot className="bg-rose-500/20 text-rose-300 border-rose-500/30">
                🔴 Attendance Closed
              </Badge>
            )}
          </div>

          {/* Details Row: Faculty, Room, Class Schedule */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-2 text-white/90 font-medium">
              <span className="text-base">👨‍🏫</span>
              {cls.faculty}
            </span>
            <span className="flex items-center gap-2 text-white/90 font-medium">
              <MapPin className="w-4 h-4 text-[#34D399] shrink-0" />
              Room {cls.room || cls.classroom || 'N/A'}
            </span>
            <span className="flex items-center gap-2 text-white/90 font-medium">
              <Clock className="w-4 h-4 text-[#34D399] shrink-0" />
              {startTimeFormatted} – {endTimeFormatted}
            </span>
          </div>

          {/* Attendance Window Sub-bar */}
          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
              <Timer className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="text-[var(--color-text-muted)]">Attendance Window:</span>
              <span className="font-semibold text-white">
                {openTimeStr} – {closeTimeStr}
              </span>
            </div>

            {currentState === 'Pending' && (
              <p className="text-amber-400/90 font-medium">
                Attendance opens after class ends. Opens at {openTimeStr}
              </p>
            )}
            {currentState === 'Closed' && (
              <p className="text-rose-400/90 font-medium">
                Attendance window has expired.
              </p>
            )}
            {currentState === 'Marked' && (
              <p className="text-[#34D399] font-medium">
                Present &bull; Marked at {markedTimeFormatted || 'Today'}
              </p>
            )}
          </div>
        </div>

        {/* Right Action Section */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end justify-center pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
          {currentState === 'Open' && (
            <div className="flex flex-col items-center lg:items-end gap-2.5">
              <div className="text-center lg:text-right">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                  Attendance closes in
                </p>
                <p className="text-lg font-mono font-bold text-emerald-400 tracking-wide mt-0.5">
                  {formatCountdown(diffSeconds)}
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleMarkClick}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-100" />
                    Mark Attendance
                  </>
                )}
              </Button>
            </div>
          )}

          {currentState === 'Marked' && (
            <div className="flex flex-col items-center lg:items-end gap-1">
              <div className="px-5 py-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] font-semibold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                <span>Attendance Submitted</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Recorded at {markedTimeFormatted}
              </p>
            </div>
          )}

          {currentState === 'Pending' && (
            <div className="flex flex-col items-center lg:items-end gap-2">
              <Button variant="secondary" disabled className="w-full sm:w-auto px-6 py-2.5 text-sm opacity-50 cursor-not-allowed">
                Mark Attendance
              </Button>
            </div>
          )}

          {currentState === 'Closed' && (
            <div className="flex flex-col items-center lg:items-end gap-2">
              <Button variant="secondary" disabled className="w-full sm:w-auto px-6 py-2.5 text-sm opacity-40 cursor-not-allowed">
                Mark Attendance
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
