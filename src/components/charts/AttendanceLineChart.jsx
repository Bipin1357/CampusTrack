import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function AttendanceLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#64647a', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64647a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
        <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
        <Line
          type="monotone"
          dataKey="rate"
          name="Attendance"
          stroke="#a78bfa"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#c4b5fd' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
