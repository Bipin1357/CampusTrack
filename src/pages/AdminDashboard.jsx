import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Settings } from 'lucide-react';

function AdminDashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="border-b border-border-color bg-bg-secondary/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Settings className="w-4 h-4" />
            </div>
            Admin Portal
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                Admin
              </span>
              <span>{currentUser?.name || 'Administrator'}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">System Administration</h1>
          <p className="text-text-secondary mt-1">Manage users, subjects, and global configurations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-card border border-border-color rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-accent-primary/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center mb-4 group-hover:bg-accent-primary/20 group-hover:text-accent-primary transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">Manage Students</h3>
            <p className="text-xs text-text-secondary">Add, edit, or remove student accounts.</p>
          </div>
          
          {/* Skeleton Cards for demo purposes */}
          <div className="bg-bg-card border border-border-color rounded-2xl p-6 opacity-60">
            <div className="w-12 h-12 rounded-full bg-bg-secondary mb-4 animate-pulse"></div>
            <div className="h-4 bg-bg-secondary rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-3 bg-bg-secondary rounded w-full animate-pulse"></div>
          </div>
          <div className="bg-bg-card border border-border-color rounded-2xl p-6 opacity-60">
            <div className="w-12 h-12 rounded-full bg-bg-secondary mb-4 animate-pulse"></div>
            <div className="h-4 bg-bg-secondary rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-3 bg-bg-secondary rounded w-full animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
