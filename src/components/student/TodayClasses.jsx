import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import { Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { timetableService } from '../../services/timetableService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function TodayClasses() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Force re-render every minute for status updates
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTodayClasses = async () => {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const data = await timetableService.getTodayClasses(currentUser.uid);
        setClasses(data || []);
      } catch (error) {
        toast.error("Failed to load today's schedule.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayClasses();
  }, [currentUser]);

  if (loading) {
    return (
      <Card className="p-6 min-h-[220px] flex items-center justify-center">
        <Loader size="md" />
      </Card>
    );
  }

  const currentDayName = timetableService.getCurrentWeekday();

  return (
    <Card className="p-6 space-y-4 bg-[#1E293B] border border-white/10 rounded-[24px]">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#34D399]" />
            Today's Classes
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{currentDayName}</p>
        </div>
        <Badge tone="accent">{classes.length} {classes.length === 1 ? 'Class' : 'Classes'}</Badge>
      </div>

      {classes.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/15 text-[#34D399] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-white text-base">No classes scheduled today</h4>
          <p className="text-xs text-[var(--color-text-muted)] max-w-xs mx-auto">
            Enjoy your free day or catch up on study modules!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {classes.map((cls) => {
            const { status, label, tone } = timetableService.getClassStatus(cls.start_time, cls.end_time);
            const isOngoing = status === 'Ongoing';

            return (
              <div
                key={cls.id}
                className={`p-4 rounded-xl transition-all duration-300 relative ${
                  isOngoing
                    ? 'bg-emerald-950/50 border-2 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-white/[0.03] border border-white/10 hover:border-[#10B981]/30'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-xs font-mono font-semibold text-[#34D399] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {cls.start_time?.substring(0, 5)} - {cls.end_time?.substring(0, 5)}
                    </span>
                    <h4 className="font-semibold text-white text-sm mt-1">
                      {cls.course?.course_name || 'Subject'}
                    </h4>
                  </div>
                  <Badge tone={tone} dot>{label}</Badge>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-[var(--color-text-secondary)] gap-2">
                  <span className="flex items-center gap-1.5 font-medium text-white/90">
                    <MapPin className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                    {cls.classroom}
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                    <User className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                    {cls.faculty_name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
