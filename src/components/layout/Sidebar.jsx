import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, CalendarCheck, Clock, Building2,
  Settings, ChevronsLeft, ChevronsRight, X, LogOut, BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '../common/Avatar'
import Logo from '../common/Logo'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/admin/timetable', label: 'Timetable', icon: Clock },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser, logout } = useAuth()

  const adminName = currentUser?.name || 'Admin'
  const adminRole = currentUser?.role === 'admin' ? 'Administrator' : 'Admin'

  const handleLogout = async () => {
    if (onCloseMobile) onCloseMobile()
    await logout()
  }

  const content = (
    <div className="h-full flex flex-col">
      <div className={cn('flex items-center gap-2.5 px-5 h-16 shrink-0', collapsed && 'px-0 justify-center')}>
        <Logo className="h-[36px] w-auto shrink-0" />
        {!collapsed && (
          <span className="font-display font-semibold text-[15px] tracking-tight whitespace-nowrap">CampusTrack</span>
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
                'track-rail flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm transition-colors group',
                isActive
                  ? 'is-active bg-[#10B981]/15 text-[#F8FAFC] font-medium'
                  : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]',
                collapsed && 'justify-center px-0'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-[18px] h-[18px] shrink-0 transition-colors', isActive ? 'text-[#34D399]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]')} strokeWidth={2} />
                {!collapsed && <span className="whitespace-nowrap">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto shrink-0 border-t border-[var(--color-border)]">
        <div className="p-3">
          <div className={cn("flex items-center gap-3 mb-2", collapsed && "justify-center")}>
            <Avatar name={adminName} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F8FAFC] truncate">{adminName}</p>
                <p className="text-xs text-[#94A3B8] truncate">{adminRole}</p>
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
            className="w-full flex items-center gap-2 justify-center py-1.5 rounded-[var(--radius-sm)] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-colors text-xs"
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
          'hidden lg:block shrink-0 border-r border-white/10 bg-[#111827] transition-all duration-200',
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
              className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden bg-[#111827] border-r border-white/10"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
