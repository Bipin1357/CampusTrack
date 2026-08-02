import React from 'react';
import Logo from '../common/Logo';

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg"></div>
      <div className="hero-bg-grid"></div>
      <div className="container hero-grid">
        <div className="hero-left reveal in">
          <span className="eyebrow">Built for college students</span>
          <h1>
            Manage Your College Life <span className="accent">Smarter</span> with CampusTrack.
          </h1>
          <p className="hero-sub">
            CampusTrack helps students stay organized with attendance tracking, interactive timetables, academic record management, notices, profile management, and a modern student dashboard—all in one place.
          </p>
          <div className="hero-cta-row">
            <a href="/login" className="btn btn-primary btn-lg">
              Get Started
            </a>
            <a href="#dashboard" className="btn btn-secondary btn-lg">
              <span className="play-icon">
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path d="M1 0.5L7 4L1 7.5V0.5Z" fill="#22C55E" />
                </svg>
              </span>
              Explore Dashboard
            </a>
          </div>
          <div className="trust-row">
            <div className="trust-item">
              <span className="tick">✓</span> Free to Use
            </div>
            <div className="trust-item">
              <span className="tick">✓</span> Student Friendly
            </div>
            <div className="trust-item">
              <span className="tick">✓</span> Secure Data
            </div>
          </div>
        </div>

        <div className="hero-right reveal in reveal-delay-2">
          <div className="phone-shadow"></div>
          <div className="phone-mockup">
            <div className="phone-notch"></div>

            {/* Status Bar */}
            <div className="phone-status-bar">
              <span className="status-time">9:41</span>
              <div className="status-icons">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style={{ opacity: 0.85 }}>
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.55 10.47 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                </svg>
                <span style={{ fontSize: '8px', fontWeight: 700, marginLeft: '2px' }}>5G</span>
                <div className="status-battery">
                  <div className="status-battery-level"></div>
                </div>
              </div>
            </div>

            {/* App Header */}
            <div className="phone-app-bar">
              <div className="phone-brand flex items-center gap-1.5">
                <Logo className="h-5 w-auto" />
                <span>CampusTrack</span>
              </div>
              <div className="phone-header-actions">
                <svg
                  className="phone-bell-icon"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <div className="phone-avatar"></div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="phone-content">
              {/* Grid of Cards (Attendance & CGPA) */}
              <div className="phone-grid-2">
                <div className="phone-card">
                  <div className="phone-card-label">Attendance</div>
                  <div className="phone-attendance-wrap">
                    <div className="phone-ring" style={{ '--pct': 82 }}>
                      <div className="phone-ring-inner">82%</div>
                    </div>
                  </div>
                </div>
                <div className="phone-card">
                  <div className="phone-card-label">Current CGPA</div>
                  <div className="phone-cgpa-value">8.42</div>
                  <div className="phone-card-footer">
                    <svg
                      viewBox="0 0 24 24"
                      width="10"
                      height="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <span>Academic Record</span>
                  </div>
                </div>
              </div>

              {/* Today's Classes */}
              <div className="phone-card">
                <div className="phone-card-label">Today's Classes</div>
                <div className="phone-progress-row">
                  <span className="phone-progress-val">Data Structures &bull; 9:00 AM</span>
                </div>
                <div className="phone-bar-track">
                  <div className="phone-bar-fill" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Grid of Cards (Weekly Timetable & Academic Records) */}
              <div className="phone-grid-2">
                <div className="phone-card flex-row">
                  <div>
                    <div className="phone-card-label">Timetable</div>
                    <div className="phone-stat-val">Today</div>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="phone-card flex-row">
                  <div>
                    <div className="phone-card-label">Records</div>
                    <div className="phone-stat-val">Active</div>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="phone-card">
                <div className="phone-card-label">Recent Activity</div>
                <div className="phone-activity-list">
                  <div className="phone-activity-item">
                    <span className="phone-check">✔</span>
                    <span>Attendance Marked</span>
                  </div>
                  <div className="phone-activity-item">
                    <span className="phone-check">✔</span>
                    <span>Academic Record Added</span>
                  </div>
                  <div className="phone-activity-item">
                    <span className="phone-check">✔</span>
                    <span>Campus Notice Viewed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="phone-nav-bar">
              <div className="phone-nav-item active">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                <span>Dashboard</span>
              </div>
              <div className="phone-nav-item">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Timetable</span>
              </div>
              <div className="phone-nav-item">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <span>Records</span>
              </div>
              <div className="phone-nav-item">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
