import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import StudentSidebar from '../student/StudentSidebar'
import StudentTopbar from '../student/StudentTopbar'
import { useAuth } from '../../context/AuthContext'
import { studentService } from '../../services/studentService'
import { Loader2 } from 'lucide-react'

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    const checkProfile = async () => {
      if (!currentUser?.uid) return;
      try {
        const profile = await studentService.getStudentById(currentUser.uid);
        if (!profile || !profile.department || !profile.semester || !profile.section) {
          navigate('/student/complete-profile', { replace: true });
        } else {
          setLoadingProfile(false);
        }
      } catch (error) {
        console.error("Error checking student profile:", error);
        // Fallback: allow to dashboard or handle error
        setLoadingProfile(false);
      }
    };
    
    checkProfile();
  }, [currentUser, navigate]);

  if (loadingProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-primary">
        <Loader2 className="h-10 w-10 animate-spin text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)]">
      <StudentSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentTopbar onOpenMobile={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="p-4 lg:p-6 max-w-[1600px] mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

          <footer className="px-6 py-6 text-center text-xs text-[var(--color-text-muted)]">
            Campus Track Student Portal &copy; 2026 &middot; Empowering students
          </footer>
        </main>
      </div>
    </div>
  )
}
