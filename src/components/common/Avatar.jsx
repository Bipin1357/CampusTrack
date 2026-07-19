import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

const gradients = [
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-violet-500 to-fuchsia-500',
]

function hashName(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % gradients.length
}

export default function Avatar({ name, size = 'md', className, status }) {
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-12 h-12 text-sm' }
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br',
          gradients[hashName(name || '?')],
          sizes[size],
          className
        )}
      >
        {getInitials(name || '?')}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-bg-raised)]',
            status === 'online' ? 'bg-emerald-400' : status === 'away' ? 'bg-amber-400' : 'bg-[var(--color-text-muted)]'
          )}
        />
      )}
    </div>
  )
}
