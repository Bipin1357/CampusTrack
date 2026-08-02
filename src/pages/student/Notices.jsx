import React, { useState } from 'react';
import { Bell, BellOff, Megaphone } from 'lucide-react';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#34D399]" />
          Campus Notices
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Stay updated with official announcements and department updates.
        </p>
      </div>

      {/* Main Content Area: Notices list or Empty state */}
      {notices.length === 0 ? (
        /* Empty State Card */
        <div className="bg-[#1E293B] border border-dashed border-[#10B981]/30 rounded-[24px] p-10 sm:p-16 text-center space-y-4 shadow-xl backdrop-blur-xl transition-all duration-300 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/20 text-[#34D399] flex items-center justify-center mx-auto shadow-lg relative">
            <BellOff className="w-8 h-8" />
          </div>

          {/* Empty State Text */}
          <div className="space-y-2 max-w-md mx-auto relative">
            <h3 className="text-xl font-bold text-white font-display">No New Notices</h3>
            <p className="text-sm font-medium text-[#34D399]">You're all caught up!</p>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              There are no new notices or announcements at the moment. Check back later for updates from your department or administration.
            </p>
          </div>
        </div>
      ) : (
        /* Notices List */
        <div className="grid grid-cols-1 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-[#1E293B] border border-white/10 hover:border-[#10B981]/30 rounded-[20px] p-5 transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/20 text-[#34D399] text-xs font-medium">
                  {notice.category || 'Important'}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">{notice.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2">
                {notice.content || notice.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
