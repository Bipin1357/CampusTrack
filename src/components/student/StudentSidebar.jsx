import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, CalendarCheck, Clock,
  FileText, Bell, ChevronsLeft, ChevronsRight, X, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '../common/Avatar'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'Profile', icon: User },
  { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/student/timetable', label: 'Timetable', icon: Clock },
  { to: '/student/results', label: 'Results', icon: FileText },
  { to: '/student/notices', label: 'Notices', icon: Bell },
]

export default function StudentSidebar({ mobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser, logout } = useAuth()

  const studentName = currentUser?.name || 'Student'
  const studentRole = 'Student'

  const handleLogout = async () => {
    if (onCloseMobile) onCloseMobile()
    await logout()
  }

  const content = (
    <div className="h-full flex flex-col">
      <div className={cn('flex items-center gap-2.5 px-5 h-16 shrink-0', collapsed && 'px-0 justify-center')}>
        <div className="w-8 h-8 rounded-lg accent-gradient-bg flex items-center justify-center shrink-0">
          <svg viewBox="0 0 32 32" className="w-4.5 h-4.5">
            <path d="M8 20 L16 8 L24 20" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="24" r="2" fill="#c4b5fd" />
          </svg>
        </div>
        {!collapsed && (
          <span className="font-display font-semibold text-[15px] tracking-tight whitespace-nowrap">Student Portal</span>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto lg:hidden w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'track-rail flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm transition-colors',
                isActive
                  ? 'is-active bg-[var(--color-accent-soft)] text-white font-medium'
                  : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white',
                collapsed && 'justify-center px-0'
              )
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto shrink-0 border-t border-[var(--color-border)]">
        <div className="p-3">
          <div className={cn("flex items-center gap-3 mb-2", collapsed && "justify-center")}>
            <Avatar name={studentName} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{studentName}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{studentRole}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-2 py-2 px-3 rounded-[var(--radius-sm)] text-rose-400 hover:bg-rose-400/10 transition-colors text-sm font-medium",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
        <div className="p-2 border-t border-[var(--color-border)] hidden lg:block">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center gap-2 justify-center py-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white transition-colors text-xs"
          >
            {collapsed ? <ChevronsRight className="w-4 h-4 shrink-0" /> : (<><ChevronsLeft className="w-4 h-4 shrink-0" /> Collapse</>)}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-raised)]/60 backdrop-blur-xl transition-all duration-200',
          collapsed ? 'w-[76px]' : 'w-64'
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden bg-[var(--color-bg-raised)] border-r border-[var(--color-border)]"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
