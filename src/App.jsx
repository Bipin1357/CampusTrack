import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentAttendance from './pages/student/Attendance';
import StudentTimetable from './pages/student/Timetable';
import StudentResults from './pages/student/Results';
import StudentNotices from './pages/student/Notices';

import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/admin/Students/StudentsPage';
import StudentProfileAdmin from './pages/admin/Students/StudentProfile';
import CoursesPage from './pages/admin/Courses/CoursesPage';
import CourseDetails from './pages/admin/Courses/CourseDetails';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Departments from './pages/Departments';
import Examinations from './pages/Examinations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Prevent authenticated users from seeing public pages like Login
function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) return null; // Let AuthProvider handle the fullscreen loading
  
  if (currentUser) {
    // Already logged in, redirect them based on their role
    return <Navigate to={`/${currentUser.role}`} replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1F1F1F',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="notices" element={<StudentNotices />} />
          </Route>
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentProfileAdmin />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="departments" element={<Departments />} />
            <Route path="examinations" element={<Examinations />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
