import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function DepartmentPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="46%"
          innerRadius={56}
          outerRadius={84}
          paddingAngle={3}
          cornerRadius={4}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: '#9c9cb0', fontSize: 11 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
