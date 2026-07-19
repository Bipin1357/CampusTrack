export default function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-panel rounded-[var(--radius-sm)] px-3 py-2 shadow-xl shadow-black/40" style={{ background: 'rgba(14,14,21,0.95)' }}>
      {label && <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-[var(--color-text-secondary)]">{p.name}:</span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {valueFormatter ? valueFormatter(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}
