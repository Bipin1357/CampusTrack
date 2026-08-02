import { useState, useEffect } from 'react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { timetableService } from '../../services/timetableService';
import toast from 'react-hot-toast';
import WeeklyTimetableGrid from '../../components/student/WeeklyTimetableGrid';
import TodayClasses from '../../components/student/TodayClasses';

export default function StudentTimetable() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('week'); // 'week' | 'today'

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const data = await timetableService.getWeeklyClasses(currentUser.uid);
        setClasses(data || []);
      } catch (error) {
        toast.error('Failed to load your timetable.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Student Timetable</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Official class schedule synced directly with Admin Timetable.
          </p>
        </div>

        {/* View Switcher: Week View vs Today's Classes */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('week')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === 'week'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Week View
          </button>
          <button
            onClick={() => setActiveView('today')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === 'today'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Today's Classes
          </button>
        </div>
      </div>

      {classes.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No timetable found"
          description="There are no classes scheduled for your department, semester, and section yet."
        />
      ) : activeView === 'week' ? (
        <WeeklyTimetableGrid
          classes={classes}
          highlightToday={true}
          title="Weekly Timetable Grid"
        />
      ) : (
        <div className="max-w-3xl">
          <TodayClasses />
        </div>
      )}
    </div>
  );
}
