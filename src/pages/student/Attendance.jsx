import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import AttendanceLineChart from '../../components/charts/AttendanceLineChart';
import TodayClassCard from '../../components/student/TodayClassCard';
import AttendanceHistoryTable from '../../components/student/AttendanceHistoryTable';
import { Calendar, AlertCircle, TrendingUp, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentAttendance() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);

  // Statistics State
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, rate: 100, total: 0 });
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [history, setHistory] = useState([]);

  // Timer to force re-render every second for live countdowns
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    const studentId = currentUser?.studentProfile?.id;
    if (!studentId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [todayClasses, todayAttendance, statsData, breakdown, trend, historyData] = await Promise.all([
        attendanceService.getTodayClasses(studentId),
        attendanceService.getTodayAttendance(studentId),
        attendanceService.getStudentAttendanceStats(studentId),
        attendanceService.getStudentSubjectBreakdown(studentId),
        attendanceService.getStudentMonthlyChart(studentId),
        attendanceService.getStudentAttendanceHistory(studentId)
      ]);
      setClasses(todayClasses || []);
      setAttendanceRecords(todayAttendance || {});
      setStats(statsData || { present: 0, absent: 0, late: 0, rate: 100, total: 0 });
      setSubjectBreakdown(breakdown || []);
      setMonthlyTrend(trend || []);
      setHistory(historyData || []);
    } catch (error) {
      console.error("Error loading attendance data:", error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleMarkAttendance = async (courseId, timetableId, endTimeStr) => {
    try {
      const studentId = currentUser?.studentProfile?.id;
      if (!studentId) throw new Error('Student profile is unavailable.');
      await attendanceService.markAttendance(studentId, courseId, timetableId, endTimeStr);
      toast.success('Attendance marked successfully!');
      await fetchData(); // Automatically refresh stats, history, and today's classes
    } catch (error) {
      toast.error(error.message || 'Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Student Attendance Portal
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Mark attendance for today's scheduled classes and track your overall attendance record.
        </p>
      </div>

      {/* Low Attendance Threshold Warning Banner */}
      {stats.total > 0 && stats.rate < 75 && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-start gap-3.5 shadow-lg animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <h4 className="font-semibold text-rose-200 text-sm">Low Attendance Warning</h4>
            <p className="text-xs text-rose-300/90 mt-1">
              Your overall attendance rate is currently <span className="font-bold text-rose-200">{stats.rate}%</span>, which is below the mandatory 75% threshold. Please attend upcoming classes to avoid academic penalties.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Attendance" value={stats.rate} unit="%" icon={TrendingUp} />
        <StatCard label="Classes Attended" value={stats.present + stats.late} icon={CheckCircle} />
        <StatCard label="Classes Missed" value={stats.absent} icon={XCircle} />
        <StatCard label="Total Classes" value={stats.total} icon={BookOpen} />
      </div>

      {/* Today's Scheduled Classes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#34D399]" />
            Today's Classes
          </h2>
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            {attendanceService.getCurrentWeekday()}
          </span>
        </div>

        {classes.length === 0 ? (
          <Card className="p-10 text-center space-y-3 bg-[#1E293B] border border-white/10 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/15 text-[#34D399] flex items-center justify-center mx-auto text-3xl">
              📅
            </div>
            <h3 className="font-bold text-white text-lg font-display">No classes scheduled today</h3>
            <p className="text-sm font-medium text-[#34D399]">Enjoy your free day!</p>
            <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
              No attendance needs to be marked today.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {classes.map((cls) => {
              const record =
                attendanceRecords[cls.timetable_id] ||
                attendanceRecords[cls.course_id] ||
                attendanceRecords[`${cls.timetable_id}_${cls.course_id}`];

              return (
                <TodayClassCard
                  key={cls.timetable_id || cls.course_id}
                  cls={cls}
                  attendanceRecord={record}
                  onMarkAttendance={handleMarkAttendance}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Subject Breakdown & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col h-full border border-white/10 rounded-2xl">
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#34D399]" />
            Subject Breakdown
          </h3>
          {subjectBreakdown.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <p className="text-sm text-[var(--color-text-muted)]">No subject data available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjectBreakdown.map((sub, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium">{sub.subject}</span>
                    <span className={sub.rate < 75 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                      {sub.rate}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        sub.rate < 75
                          ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                          : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      }`}
                      style={{ width: `${Math.max(sub.rate, 2)}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {sub.attended} of {sub.total} classes attended
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 flex flex-col h-full border border-white/10 rounded-2xl">
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#34D399]" />
            Monthly Trend
          </h3>
          <div className="flex-1 h-64 min-h-[250px] -ml-2">
            <AttendanceLineChart data={monthlyTrend.length > 0 ? monthlyTrend : [{ month: 'Jan', rate: 0 }]} />
          </div>
        </Card>
      </div>

      {/* Attendance History Table */}
      <div className="pt-2">
        <AttendanceHistoryTable history={history} />
      </div>
    </div>
  );
}
