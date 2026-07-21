import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Clock, MapPin, Calendar, UserCheck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentAttendance() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Timer to force re-render for countdowns
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    if (!currentUser?.uid) return;
    try {
      setLoading(true);
      const [todayClasses, todayAttendance] = await Promise.all([
        attendanceService.getTodayClasses(currentUser.uid),
        attendanceService.getTodayAttendance(currentUser.uid)
      ]);
      setClasses(todayClasses);
      setAttendanceRecords(todayAttendance);
    } catch (error) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleMarkAttendance = async (courseId, endTimeStr) => {
    try {
      await attendanceService.markAttendance(currentUser.uid, courseId, endTimeStr);
      toast.success('Attendance marked successfully!');
      fetchData(); // Refresh to get the updated record
    } catch (error) {
      toast.error(error.message || 'Failed to mark attendance');
    }
  };

  const formatCountdown = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderClassCard = (cls) => {
    const record = attendanceRecords[cls.course_id];
    const { isOpen, status, diffSeconds } = attendanceService.getAttendanceWindowStatus(cls.end_time);

    let badgeTone = 'neutral';
    let badgeText = 'Unknown';
    let actionElement = null;

    if (record) {
      // Already marked
      badgeTone = 'success';
      badgeText = 'Present';
      actionElement = (
        <div className="flex flex-col items-center sm:items-end">
          <p className="text-emerald-400 font-medium flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5" /> Attendance Submitted
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Marked at {new Date(record.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      );
    } else if (status === 'Closed') {
      // Window closed, no record -> Absent
      badgeTone = 'danger';
      badgeText = 'Absent';
      actionElement = (
        <div className="flex flex-col items-center sm:items-end">
           <p className="text-rose-400 font-medium flex items-center gap-2 mb-1">
            <XCircle className="w-5 h-5" /> Attendance Missed
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">Window closed</p>
        </div>
      );
    } else if (isOpen) {
      // Window Open
      badgeTone = 'warning'; // Using warning tone (yellowish) to draw attention
      badgeText = 'Window Open';
      actionElement = (
        <div className="flex flex-col items-center sm:items-end gap-2">
          <Button variant="primary" onClick={() => handleMarkAttendance(cls.course_id, cls.end_time)}>
            Mark Attendance
          </Button>
          <p className="text-xs text-[var(--color-text-muted)]">
            Closes in {formatCountdown(diffSeconds)}
          </p>
        </div>
      );
    } else if (status === 'Upcoming') {
      // Upcoming
      badgeTone = 'info';
      badgeText = 'Upcoming';
      
      // If it opens in less than an hour, show countdown
      if (diffSeconds < 3600) {
         actionElement = (
          <div className="flex flex-col items-center sm:items-end">
            <Button variant="secondary" disabled>
              Mark Attendance
            </Button>
            <p className="text-xs text-[var(--color-warning)] mt-2">
              Opens in {formatCountdown(diffSeconds)}
            </p>
          </div>
        );
      } else {
         actionElement = (
          <div className="flex flex-col items-center sm:items-end">
            <Button variant="secondary" disabled>
              Mark Attendance
            </Button>
          </div>
        );
      }
    }

    return (
      <Card key={cls.timetable_id} className="p-6 transition-all hover:border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">{cls.course_name}</h3>
              <Badge tone={badgeTone} dot>{badgeText}</Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[var(--color-accent-violet)]" />
                {cls.faculty}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--color-accent-violet)]" />
                {cls.start_time.substring(0,5)} - {cls.end_time.substring(0,5)}
              </span>
              {cls.room && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[var(--color-accent-violet)]" />
                  {cls.room}
                </span>
              )}
            </div>
          </div>
          
          <div className="w-full sm:w-auto flex justify-center sm:justify-end border-t sm:border-t-0 border-[var(--color-border)] pt-4 sm:pt-0 mt-2 sm:mt-0">
            {actionElement}
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Today's Attendance</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Mark your attendance for {attendanceService.getCurrentWeekday()}'s classes.
        </p>
      </div>

      {classes.length === 0 ? (
        <EmptyState 
          icon={Calendar} 
          title="No classes scheduled for today" 
          description="You don't have any classes in your timetable for today. Enjoy your day!" 
        />
      ) : (
        <div className="space-y-4">
          {classes.map(renderClassCard)}
        </div>
      )}
    </div>
  );
}
