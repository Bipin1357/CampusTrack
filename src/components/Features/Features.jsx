import React from 'react';

function Features() {
  return (
    <section className="section-pad" id="features">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">Everything in one dashboard</span>
          <h2>Built for how students actually study</h2>
          <p>Six focused tools to manage your timetable, attendance, academic records, and campus life.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card reveal in reveal-delay-1">
            <div className="feature-icon">📅</div>
            <h3>Attendance Tracker</h3>
            <p>
              Interactive attendance cards with 50-minute real-time window countdowns to mark daily class attendance.
            </p>
          </div>
          <div className="feature-card reveal in reveal-delay-2">
            <div className="feature-icon">⏰</div>
            <h3>Weekly Timetable</h3>
            <p>View your daily schedule and full weekly class timetable organized by your semester and section.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-3">
            <div className="feature-icon">📄</div>
            <h3>Academic Records</h3>
            <p>Store and track your semester SGPA, CGPA, earned credits, and academic history securely.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-1">
            <div className="feature-icon">🔔</div>
            <h3>Campus Notices</h3>
            <p>Stay updated with official announcement updates, exam alerts, and campus notifications.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-2">
            <div className="feature-icon">👤</div>
            <h3>Profile Management</h3>
            <p>Manage your student profile information, department details, semester, and section easily.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-3">
            <div className="feature-icon">📈</div>
            <h3>Admin Dashboard</h3>
            <p>Comprehensive admin control panel for managing students, departments, timetables, and overall attendance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
