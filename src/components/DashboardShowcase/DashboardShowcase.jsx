import React, { useEffect } from 'react';

function DashboardShowcase() {
  useEffect(() => {
    // Intersection Observer to trigger bar animation, similar to original script
    const bars = document.querySelectorAll('.sc-stat .bar-fill');
    const showcase = document.querySelector('.showcase-shell');

    if (!showcase) return;

    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bars.forEach((bar) => {
              bar.style.width = bar.dataset.width + '%';
            });
            barObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    barObserver.observe(showcase);
    return () => barObserver.disconnect();
  }, []);

  return (
    <section className="section-pad alt-bg" id="dashboard">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">See it in action</span>
          <h2>A dashboard that keeps you ahead</h2>
          <p>Every metric that matters to your semester, live and in one view.</p>
        </div>

        <div className="showcase-shell reveal in reveal-delay-2">
          <div className="showcase-sidebar">
            <div className="sb-brand">
              <div className="sb-dot"></div>CampusTrack
            </div>
            <div className="sb-item active">
              <span className="dot"></span>Overview
            </div>
            <div className="sb-item">
              <span className="dot"></span>Attendance
            </div>
            <div className="sb-item">
              <span className="dot"></span>Syllabus
            </div>
            <div className="sb-item">
              <span className="dot"></span>GPA Calculator
            </div>
            <div className="sb-item">
              <span className="dot"></span>Result Vault
            </div>
            <div className="sb-item">
              <span className="dot"></span>Profile
            </div>
          </div>
          <div className="showcase-main">
            <div className="showcase-top">
              <h4>Semester Overview</h4>
              <span>Semester 4 · 2026</span>
            </div>
            <div className="sc-grid">
              <div className="sc-stat">
                <div className="lbl">ATTENDANCE</div>
                <div className="val">82%</div>
                <div className="bar-track">
                  <div className="bar-fill" data-width="82" style={{ width: 0 }}></div>
                </div>
              </div>
              <div className="sc-stat">
                <div className="lbl">SYLLABUS COMPLETE</div>
                <div className="val">58%</div>
                <div className="bar-track">
                  <div className="bar-fill" data-width="58" style={{ width: 0 }}></div>
                </div>
              </div>
              <div className="sc-stat">
                <div className="lbl">CURRENT CGPA</div>
                <div className="val">8.42</div>
                <div className="bar-track">
                  <div className="bar-fill" data-width="84" style={{ width: 0 }}></div>
                </div>
              </div>
              <div className="sc-stat">
                <div className="lbl">SEMESTER PROGRESS</div>
                <div className="val">67%</div>
                <div className="bar-track">
                  <div className="bar-fill" data-width="67" style={{ width: 0 }}></div>
                </div>
              </div>
            </div>
            <div className="sc-lower">
              <div className="chart-card">
                <h5>Attendance Trend</h5>
                <svg className="chart-svg" viewBox="0 0 400 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points="0,110 60,95 120,100 180,70 240,80 300,45 360,55 400,30"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="0,110 60,95 120,100 180,70 240,80 300,45 360,55 400,30 400,150 0,150"
                    fill="url(#chartFill)"
                  />
                </svg>
              </div>
              <div className="activity-card">
                <h5>Recent Activity</h5>
                <div className="activity-row">
                  <span className="adot"></span>Marked Physics attendance{' '}
                  <span className="atime">2h ago</span>
                </div>
                <div className="activity-row">
                  <span className="adot"></span>Completed Module 3 — DBMS{' '}
                  <span className="atime">1d ago</span>
                </div>
                <div className="activity-row">
                  <span className="adot"></span>Uploaded Sem 3 results <span className="atime">3d ago</span>
                </div>
                <div className="activity-row">
                  <span className="adot"></span>Updated GPA goal to 8.8 <span className="atime">5d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardShowcase;
