import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, BookOpen, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to convert time string (HH:MM:SS or HH:MM) to minutes from midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Helper to check if a class is currently ongoing
const isClassOngoing = (dayOfWeek, startTimeStr, endTimeStr) => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  if (currentDay !== dayOfWeek) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = timeToMinutes(startTimeStr);
  const endMinutes = timeToMinutes(endTimeStr);

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

export default function WeeklyTimetableGrid({ classes = [], highlightToday = false, title = "Weekly Timetable Preview" }) {
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedMobileDay, setSelectedMobileDay] = useState(
    DAYS.includes(todayName) ? todayName : 'Monday'
  );

  // Re-render periodically to update ongoing glowing status
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Determine time slots dynamically or use default standard range (9 AM - 5 PM)
  const defaultSlots = [
    { label: '09:00 - 10:00', start: '09:00', end: '10:00' },
    { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
    { label: '11:00 - 12:00', start: '11:00', end: '12:00' },
    { label: '12:00 - 13:00', start: '12:00', end: '13:00' },
    { label: '13:00 - 14:00', start: '13:00', end: '14:00' },
    { label: '14:00 - 15:00', start: '14:00', end: '15:00' },
    { label: '15:00 - 16:00', start: '15:00', end: '16:00' },
    { label: '16:00 - 17:00', start: '16:00', end: '17:00' },
  ];

  // Map classes into grid cells (day -> list of classes)
  const classesByDayAndSlot = {};
  DAYS.forEach(day => {
    classesByDayAndSlot[day] = {};
  });

  classes.forEach(cls => {
    if (!cls.day_of_week || !DAYS.includes(cls.day_of_week)) return;
    const startMins = timeToMinutes(cls.start_time);
    
    // Find matching slot or fallback
    let slotKey = defaultSlots.find(s => {
      const sMins = timeToMinutes(s.start);
      return Math.abs(sMins - startMins) < 30; // within 30 mins
    })?.label;

    if (!slotKey) {
      slotKey = `${cls.start_time?.substring(0, 5)} - ${cls.end_time?.substring(0, 5)}`;
    }

    if (!classesByDayAndSlot[cls.day_of_week][slotKey]) {
      classesByDayAndSlot[cls.day_of_week][slotKey] = [];
    }
    classesByDayAndSlot[cls.day_of_week][slotKey].push(cls);
  });

  // Get all unique time slots used
  const allSlotKeys = Array.from(new Set([
    ...defaultSlots.map(s => s.label),
    ...classes.map(c => `${c.start_time?.substring(0, 5)} - ${c.end_time?.substring(0, 5)}`)
  ])).sort((a, b) => timeToMinutes(a.split(' - ')[0]) - timeToMinutes(b.split(' - ')[0]));

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[24px] p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            {title}
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Official department schedule synced from Admin timetable.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            Live Now
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Lab
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            Theory
          </span>
        </div>
      </div>

      {/* MOBILE VIEW (Tabbed by day) */}
      <div className="block lg:hidden space-y-4">
        {/* Day Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DAYS.map(day => {
            const isToday = day === todayName;
            const isSelected = day === selectedMobileDay;
            const hasClasses = classes.some(c => c.day_of_week === day);

            return (
              <button
                key={day}
                onClick={() => setSelectedMobileDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : isToday
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                }`}
              >
                {day.substring(0, 3)}
                {isToday && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                {hasClasses && !isToday && <span className="w-1.5 h-1.5 rounded-full bg-white/40" />}
              </button>
            );
          })}
        </div>

        {/* Selected Day Content */}
        <div className="space-y-3">
          {(() => {
            const dayClasses = classes.filter(c => c.day_of_week === selectedMobileDay);
            if (dayClasses.length === 0) {
              return (
                <div className="p-8 text-center bg-white/[0.02] border border-[var(--color-border)] rounded-2xl">
                  <p className="text-sm text-[var(--color-text-muted)]">No classes scheduled for {selectedMobileDay}.</p>
                </div>
              );
            }

            return dayClasses.map(cls => {
              const ongoing = isClassOngoing(cls.day_of_week, cls.start_time, cls.end_time);
              const isLab = cls.course?.course_type?.toLowerCase() === 'lab' || cls.classroom?.toLowerCase().includes('lab');

              return (
                <div
                  key={cls.id}
                  className={`p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    ongoing
                      ? 'bg-purple-950/40 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                      : 'bg-white/[0.03] border border-white/10 hover:border-purple-500/40'
                  }`}
                >
                  {ongoing && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-spin" /> LIVE NOW
                    </div>
                  )}

                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-base">
                          {cls.course?.course_name || 'Class'}
                        </h4>
                        {isLab ? (
                          <Badge tone="cyan">Lab</Badge>
                        ) : (
                          <Badge tone="accent">Theory</Badge>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-mono">
                        {cls.course?.course_code}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{cls.start_time?.substring(0, 5)} - {cls.end_time?.substring(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{cls.classroom}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{cls.faculty_name}</span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* DESKTOP & TABLET MATRIX GRID */}
      <div className="hidden lg:block overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-border)] w-28">
                Time Slot
              </th>
              {DAYS.map(day => {
                const isToday = day === todayName && highlightToday;
                return (
                  <th
                    key={day}
                    className={`p-3 text-center text-xs font-semibold border-b border-[var(--color-border)] ${
                      isToday
                        ? 'text-purple-400 bg-purple-500/10 rounded-t-xl border-purple-500/30'
                        : 'text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {day}
                      {isToday && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {allSlotKeys.map(slotKey => (
              <tr key={slotKey} className="group hover:bg-white/[0.01] transition-colors">
                {/* Time slot header cell */}
                <td className="p-3 text-xs font-mono font-medium text-[var(--color-text-secondary)] align-top whitespace-nowrap bg-white/[0.01]">
                  {slotKey}
                </td>

                {/* Day cells */}
                {DAYS.map(day => {
                  const daySlotClasses = classesByDayAndSlot[day]?.[slotKey] || [];
                  const isToday = day === todayName && highlightToday;

                  return (
                    <td
                      key={day}
                      className={`p-2 align-top transition-colors min-w-[130px] ${
                        isToday ? 'bg-purple-500/[0.02]' : ''
                      }`}
                    >
                      {daySlotClasses.length === 0 ? (
                        <div className="h-16 flex items-center justify-center text-[10px] text-[var(--color-text-muted)]/40 border border-dashed border-white/5 rounded-xl">
                          —
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {daySlotClasses.map(cls => {
                            const ongoing = isClassOngoing(cls.day_of_week, cls.start_time, cls.end_time);
                            const isLab = cls.course?.course_type?.toLowerCase() === 'lab' || cls.classroom?.toLowerCase().includes('lab');

                            return (
                              <div
                                key={cls.id}
                                className={`p-2.5 rounded-xl transition-all duration-300 relative group/card ${
                                  ongoing
                                    ? 'bg-purple-950/60 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-[1.02] z-10'
                                    : 'bg-white/[0.04] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.07]'
                                }`}
                              >
                                {ongoing && (
                                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-purple-500 rounded-full animate-ping" />
                                )}

                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-semibold text-white text-xs truncate">
                                    {cls.course?.course_name || 'Subject'}
                                  </span>
                                  {isLab ? (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      LAB
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                      TH
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-0.5 text-[11px] text-[var(--color-text-secondary)]">
                                  <p className="truncate text-white/90 font-medium">
                                    👨‍🏫 {cls.faculty_name}
                                  </p>
                                  <p className="flex items-center gap-1 text-[var(--color-text-muted)] text-[10px]">
                                    <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                                    {cls.classroom}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
