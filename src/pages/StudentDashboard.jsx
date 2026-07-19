import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

function StudentDashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="border-b border-border-color bg-bg-secondary/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-secondary to-accent-primary flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M4 7L12 3L20 7L12 11L4 7Z" fill="white" />
              </svg>
            </div>
            Student Portal
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <User className="w-4 h-4" />
              <span>{currentUser?.name || 'Student'}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Welcome back, {currentUser?.name}!</h1>
          <p className="text-text-secondary mt-1">Here is your academic overview for this semester.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-card border border-border-color rounded-2xl p-6">
            <h3 className="text-text-secondary text-sm font-semibold mb-2">ATTENDANCE</h3>
            <div className="text-4xl font-display font-bold text-accent-primary">85%</div>
            <p className="text-xs text-text-secondary mt-2">On track to meet the 75% criteria.</p>
          </div>
          <div className="bg-bg-card border border-border-color rounded-2xl p-6">
            <h3 className="text-text-secondary text-sm font-semibold mb-2">SYLLABUS</h3>
            <div className="text-4xl font-display font-bold text-text-primary">62%</div>
            <p className="text-xs text-text-secondary mt-2">4 modules remaining for mid-terms.</p>
          </div>
          <div className="bg-bg-card border border-border-color rounded-2xl p-6">
            <h3 className="text-text-secondary text-sm font-semibold mb-2">TARGET GPA</h3>
            <div className="text-4xl font-display font-bold text-text-primary">8.5</div>
            <p className="text-xs text-text-secondary mt-2">Current CGPA: 8.2</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
