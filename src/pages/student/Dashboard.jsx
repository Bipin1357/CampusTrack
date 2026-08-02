import React, { useState, useEffect } from 'react';
import { CalendarCheck, Clock, FileText, UserCheck } from 'lucide-react';
import TodayClasses from '../../components/student/TodayClasses';
import WeeklyTimetableGrid from '../../components/student/WeeklyTimetableGrid';
import { useAuth } from '../../context/AuthContext';
import { timetableService } from '../../services/timetableService';
import { useAcademicRecords } from '../../hooks/useAcademicRecords';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import Loader from '../../components/common/Loader';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const student = currentUser?.studentProfile;
  const [weeklyClasses, setWeeklyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);

  const { stats } = useAcademicRecords(student?.id);
  const completion = useProfileCompletion();

  useEffect(() => {
    const loadDashboardTimetable = async () => {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const [weekly, today] = await Promise.all([
          timetableService.getWeeklyClasses(currentUser.uid),
          timetableService.getTodayClasses(currentUser.uid),
        ]);
        setWeeklyClasses(weekly || []);
        setTodayCount(today?.length || 0);
      } catch (err) {
        console.error('Error loading dashboard timetable:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardTimetable();
  }, [currentUser]);

  const cards = [
    {
      title: 'Attendance Percentage',
      value: '85%',
      desc: 'Good standing',
      icon: CalendarCheck,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      title: "Today's Classes",
      value: `${todayCount} ${todayCount === 1 ? 'Class' : 'Classes'}`,
      desc: todayCount > 0 ? 'Schedule active for today' : 'No classes today',
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      title: 'Recent Results',
      value: stats.completedSemesters > 0 ? `CGPA: ${stats.cgpa}` : 'No Records',
      desc: stats.completedSemesters > 0 ? `${stats.completedSemesters} terms • ${stats.totalCredits} credits` : 'Add first semester GPA',
      icon: FileText,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
    {
      title: 'Profile Completion',
      value: `${completion.percentage}%`,
      desc: completion.statusText,
      icon: UserCheck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Student Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Overview of your academic progress and weekly timetable.
        </p>
      </div>

      {/* Top 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[20px] p-5 flex flex-col hover:border-purple-500/40 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="font-medium text-xs text-[var(--color-text-secondary)] tracking-wide uppercase">
                {card.title}
              </h3>
            </div>
            <div className="mt-auto">
              <div className="text-2xl font-bold font-display text-[var(--color-text-primary)]">
                {card.value}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule Card */}
      <div className="grid grid-cols-1 gap-6">
        <TodayClasses />
      </div>

      {/* Weekly Timetable Preview Grid */}
      {loading ? (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[24px] p-12 flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <WeeklyTimetableGrid
          classes={weeklyClasses}
          highlightToday={true}
          title="Weekly Timetable Preview"
        />
      )}
    </div>
  );
}
