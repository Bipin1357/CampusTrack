import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { timetableService } from '../../services/timetableService';
import toast from 'react-hot-toast';
import { weekDays } from '../../data/timetableData';

export default function StudentTimetable() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const data = await timetableService.getWeeklyClasses(currentUser.uid);
        setClasses(data);
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
    return <div className="flex h-64 items-center justify-center"><Loader size="lg" /></div>;
  }

  // Group classes by day
  const classesByDay = {};
  weekDays.forEach(day => {
    classesByDay[day] = classes.filter(c => c.day_of_week === day);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Weekly Timetable</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">View your upcoming classes and laboratory sessions.</p>
      </div>

      {classes.length === 0 ? (
        <EmptyState 
          icon={Calendar} 
          title="No classes found" 
          description="It looks like you don't have any classes scheduled yet." 
        />
      ) : (
        <div className="space-y-8">
          {weekDays.map(day => {
            const dayClasses = classesByDay[day];
            if (dayClasses.length === 0) return null; // Skip days with no classes

            return (
              <div key={day}>
                <h2 className="text-lg font-semibold text-white mb-4 border-b border-[var(--color-border)] pb-2">
                  {day}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayClasses.map(cls => (
                    <Card key={cls.id} className="p-5 hover:border-white/20 transition-all border-l-4 border-l-[var(--color-accent-violet)]">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-white text-base leading-tight">
                            {cls.course?.course_name}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {cls.course?.course_code}
                          </p>
                        </div>
                        
                        <div className="pt-3 border-t border-[var(--color-border)] space-y-2 text-sm text-[var(--color-text-secondary)]">
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[var(--color-accent-violet)]" />
                            {cls.start_time.substring(0,5)} - {cls.end_time.substring(0,5)}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[var(--color-accent-violet)]" />
                            {cls.classroom}
                          </p>
                          <p className="flex items-center gap-2 text-xs">
                            <span className="w-4 text-center text-[var(--color-accent-violet)]">👨‍🏫</span>
                            {cls.faculty_name}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
