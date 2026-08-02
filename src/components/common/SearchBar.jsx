import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchBar({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1E293B] border border-[#334155] rounded-full py-2 pl-9 pr-4 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/25 transition-all duration-200"
      />
    </div>
  )
}
