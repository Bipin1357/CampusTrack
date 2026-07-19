import ChartCard from '../common/ChartCard'
import StudentGrowthAreaChart from '../charts/StudentGrowthAreaChart'
import DepartmentPieChart from '../charts/DepartmentPieChart'
import CourseEnrollmentBarChart from '../charts/CourseEnrollmentBarChart'
import { studentGrowthTrend, enrollmentByDepartment, courseEnrollmentBars } from '@/data/dashboardData'

export default function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Student Growth" subtitle="Enrollment over the last 6 months" className="lg:col-span-2">
        <StudentGrowthAreaChart data={studentGrowthTrend} />
      </ChartCard>
      <ChartCard title="By Department" subtitle="Current enrollment share">
        <DepartmentPieChart data={enrollmentByDepartment} />
      </ChartCard>
      <ChartCard title="Course Enrollment" subtitle="Top courses this semester" className="lg:col-span-3" height="h-64">
        <CourseEnrollmentBarChart data={courseEnrollmentBars} />
      </ChartCard>
    </div>
  )
}
