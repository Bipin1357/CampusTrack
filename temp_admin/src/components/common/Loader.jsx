import { cn } from '@/lib/utils'

export default function Loader({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-9 h-9 border-[3px]' }
  return (
    <div
      className={cn(
        'rounded-full border-white/10 border-t-violet-400 animate-spin',
        sizes[size],
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader size="lg" />
    </div>
  )
}
