import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function AttendanceLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#334155" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#CBD5E1', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#CBD5E1', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
        <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
        <Line
          type="monotone"
          dataKey="rate"
          name="Attendance"
          stroke="#10B981"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#34D399' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
