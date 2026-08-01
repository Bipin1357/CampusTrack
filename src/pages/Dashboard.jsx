import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, Calendar, Percent, Building2 } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import { TodaySchedule, QuickActions } from '@/components/admin'
import { useStudents } from '@/hooks/useStudents'
import { useCourses } from '@/hooks/useCourses'
import { useDepartments } from '@/hooks/useDepartments'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/supabase/supabaseClient'

export default function Dashboard() {
  const { currentUser } = useAuth()
  const { students } = useStudents()
  const { courses } = useCourses()
  const { departments } = useDepartments()

  const [todayClassesCount, setTodayClassesCount] = useState(0)
  const [attendanceRate, setAttendanceRate] = useState(87)

  useEffect(() => {
    fetchDashboardMetrics()
  }, [])

  const fetchDashboardMetrics = async () => {
    try {
      const todayWeekday = new Date().toLocaleDateString('en-US', { weekday: 'long' })
      
      // Fetch today's classes count
      const { count: classCount, error: classErr } = await supabase
        .from('timetable')
        .select('*', { count: 'exact', head: true })
        .eq('day_of_week', todayWeekday)

      if (!classErr && classCount != null) {
        setTodayClassesCount(classCount)
      }

      // Fetch attendance percentage
      const { data: attendanceData, error: attErr } = await supabase
        .from('attendance')
        .select('status')

      if (!attErr && attendanceData && attendanceData.length > 0) {
        const attended = attendanceData.filter((r) =>
          ['present', 'late'].includes(String(r.status || '').toLowerCase())
        ).length
        const calculatedRate = Math.round((attended / attendanceData.length) * 100)
        setAttendanceRate(calculatedRate)
      }
    } catch (err) {
      console.error('Error loading dashboard metrics:', err)
    }
  }

  const activeCoursesCount = courses.filter(
    (c) => String(c.status || '').toLowerCase() === 'active'
  ).length || courses.length

  const stats = [
    {
      id: 'stat-students',
      label: 'Total Students',
      value: students.length,
      icon: Users,
      delta: 4.2,
      trend: 'up'
    },
    {
      id: 'stat-courses',
      label: 'Active Courses',
      value: activeCoursesCount,
      icon: BookOpen,
      delta: 3.0,
      trend: 'up'
    },
    {
      id: 'stat-classes',
      label: "Today's Classes",
      value: todayClassesCount,
      icon: Calendar,
      delta: 0,
      trend: 'up'
    },
    {
      id: 'stat-attendance',
      label: 'Attendance Percentage',
      value: attendanceRate,
      unit: '%',
      icon: Percent,
      delta: -2.1,
      trend: 'down'
    },
    {
      id: 'stat-departments',
      label: 'Departments',
      value: departments.length,
      icon: Building2,
      delta: 0,
      trend: 'up'
    }
  ]

  const userName = currentUser?.name || 'Admin'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Here's your CampusTrack overview and schedule for today.
        </p>
      </div>

      {/* 5 Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <TodaySchedule />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <QuickActions />
        </motion.div>
      </div>
    </motion.div>
  )
}
