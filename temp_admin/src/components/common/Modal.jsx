import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className={cn('relative w-full glass-panel rounded-[var(--radius-lg)] shadow-2xl shadow-black/50 max-h-[85vh] flex flex-col', widths[size])}
            style={{ background: 'linear-gradient(180deg, #14141f, #0c0c14)' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">{children}</div>
            {footer && (
              <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
