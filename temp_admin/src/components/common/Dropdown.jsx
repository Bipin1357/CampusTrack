import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className={cn(
              'absolute top-full mt-2 min-w-[200px] glass-panel rounded-[var(--radius-md)] shadow-2xl shadow-black/40 py-1.5 z-40',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
            style={{ background: 'linear-gradient(180deg, #16161f, #0e0e15)' }}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DropdownItem({ icon: Icon, children, className, ...props }) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-colors text-left',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="h-px bg-[var(--color-border)] my-1.5" />
}
