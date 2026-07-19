import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import Dashboard from '@/pages/Dashboard'
import Students from '@/pages/Students'
import Attendance from '@/pages/Attendance'
import Timetable from '@/pages/Timetable'
import Departments from '@/pages/Departments'
import Examinations from '@/pages/Examinations'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

// ─────────────────────────────────────────────────────────────────────────
// Integration note: this file assumes Campus Track Admin is being dropped
// into a project that already has its own landing/marketing page, a login
// flow, and student-facing routes. To integrate:
//
//   1. Keep your existing routes for "/", "/login", "/student/*", etc.
//   2. Wrap the "/admin/*" block below with your existing <ProtectedRoute>
//      or role-based guard (e.g. requireRole="admin") instead of rendering
//      it unconditionally.
//   3. Remove the <Navigate> redirect at "/" once your real landing page
//      route is in place — it's here only so this demo opens straight into
//      the dashboard.
// ─────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="departments" element={<Departments />} />
        <Route path="examinations" element={<Examinations />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
