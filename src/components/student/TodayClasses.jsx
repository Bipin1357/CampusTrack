import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { timetableService } from '../../services/timetableService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function TodayClasses() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Force re-render to update statuses
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTodayClasses = async () => {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const data = await timetableService.getTodayClasses(currentUser.uid);
        setClasses(data);
      } catch (error) {
        toast.error('Failed to load today\'s classes.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayClasses();
  }, [currentUser]);

  if (loading) {
    return <Card className="p-6 min-h-[200px] flex items-center justify-center"><Loader size="md" /></Card>;
  }

  if (classes.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState 
          icon={Calendar} 
          title="No classes today" 
          description="You don't have any classes scheduled for today in your timetable." 
        />
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-white">Today's Schedule</h3>
        <span className="text-xs text-[var(--color-text-secondary)]">{timetableService.getCurrentWeekday()}</span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {classes.map(cls => {
          const { status, label, tone } = timetableService.getClassStatus(cls.start_time, cls.end_time);

          return (
            <div key={cls.id} className="p-4 rounded-lg bg-white/5 border border-[var(--color-border)] hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-medium text-white text-sm">{cls.course?.course_name}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{cls.faculty_name}</p>
                </div>
                <Badge tone={tone} dot>{label}</Badge>
              </div>
              
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-accent-violet)]" />
                  {cls.start_time.substring(0,5)} - {cls.end_time.substring(0,5)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-accent-violet)]" />
                  {cls.classroom}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
