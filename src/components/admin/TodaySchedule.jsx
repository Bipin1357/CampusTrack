import { useState, useEffect } from 'react'
import { Calendar, Clock, BookOpen, Building2 } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Loader from '../common/Loader'
import EmptyState from '../common/EmptyState'
import { Table, THead, TBody, TR, TH, TD } from '../common/Table'
import { supabase } from '@/supabase/supabaseClient'

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [hours, minutes] = timeStr.split(':')
  let h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${minutes} ${ampm}`
}

function formatTimeRange(startStr, endStr) {
  if (!startStr || !endStr) return ''
  return `${formatTime(startStr)} - ${formatTime(endStr)}`
}

export default function TodaySchedule() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const todayWeekday = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  useEffect(() => {
    fetchTodaySchedule()
  }, [])

  const fetchTodaySchedule = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchErr } = await supabase
        .from('timetable')
        .select(`
          id,
          day_of_week,
          start_time,
          end_time,
          semester,
          section,
          classroom,
          faculty_name,
          course_id,
          course:courses (
            id,
            course_name,
            course_code,
            department
          )
        `)
        .eq('day_of_week', todayWeekday)
        .order('start_time', { ascending: true })

      if (fetchErr) throw fetchErr
      setClasses(data || [])
    } catch (err) {
      console.error("Error fetching today's timetable:", err)
      setError("Failed to load today's schedule.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
        <div>
          <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Today's Schedule
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Timetable for {todayWeekday}, {todayFormatted}
          </p>
        </div>
        {!loading && (
          <Badge tone="success" className="w-fit">
            {classes.length} {classes.length === 1 ? 'Class' : 'Classes'} Scheduled
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader size="md" />
        </div>
      ) : error ? (
        <div className="py-8 text-center text-xs text-rose-400">
          {error}
        </div>
      ) : classes.length === 0 ? (
        <div className="py-6">
          <EmptyState
            icon={Calendar}
            title="No classes today"
            description={`There are no timetable classes scheduled for today (${todayWeekday}).`}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Course Name</TH>
                <TH>Department</TH>
                <TH>Semester</TH>
                <TH>Section</TH>
                <TH>Time</TH>
              </TR>
            </THead>
            <TBody>
              {classes.map((cls) => {
                const courseName = cls.course?.course_name || 'Unassigned Course'
                const courseCode = cls.course?.course_code || ''
                const department = cls.course?.department || 'N/A'
                const semester = cls.semester ? `Semester ${cls.semester}` : 'N/A'
                const section = cls.section ? `Section ${cls.section}` : 'N/A'
                const timeRange = formatTimeRange(cls.start_time, cls.end_time)

                return (
                  <TR key={cls.id} className="hover:bg-white/[0.02] transition-colors">
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{courseName}</p>
                          {courseCode && (
                            <p className="text-xs text-[var(--color-text-muted)]">{courseCode}</p>
                          )}
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400/70" />
                        <span>{department}</span>
                      </div>
                    </TD>
                    <TD>
                      <span className="text-xs font-medium text-white bg-white/5 px-2 py-1 rounded border border-white/10">
                        {semester}
                      </span>
                    </TD>
                    <TD>
                      <Badge tone="info" className="text-xs">
                        {section}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{timeRange}</span>
                      </div>
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
