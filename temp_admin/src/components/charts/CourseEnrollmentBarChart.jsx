import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ChartTooltip from './ChartTooltip'

const colors = ['#6366f1', '#a78bfa', '#22c55e', '#f59e0b', '#06b6d4', '#f43f5e']

export default function CourseEnrollmentBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="course"
          tick={{ fill: '#64647a', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fill: '#64647a', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="enrolled" name="Enrolled" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
