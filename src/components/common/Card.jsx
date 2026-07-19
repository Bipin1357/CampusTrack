import { cn } from '@/lib/utils'

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'glass-card p-5',
        hover && 'hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
