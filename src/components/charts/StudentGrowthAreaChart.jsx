import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function StudentGrowthAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="studentGrowthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#64647a', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64647a', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
        <Area
          type="monotone"
          dataKey="students"
          name="Students"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#studentGrowthFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
