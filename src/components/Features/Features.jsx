import React from 'react';

function Features() {
  return (
    <section className="section-pad" id="features">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">Everything in one dashboard</span>
          <h2>Built for how students actually study</h2>
          <p>Six focused tools that replace spreadsheets, sticky notes, and scattered PDFs.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card reveal in reveal-delay-1">
            <div className="feature-icon">📅</div>
            <h3>Attendance Tracker</h3>
            <p>
              Track subject-wise attendance and know exactly how many classes you need to maintain your target
              percentage.
            </p>
          </div>
          <div className="feature-card reveal in reveal-delay-2">
            <div className="feature-icon">📚</div>
            <h3>Syllabus Tracker</h3>
            <p>Break every subject into modules and topics and mark completed lessons as you go.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-3">
            <div className="feature-icon">🎯</div>
            <h3>GPA Goal Calculator</h3>
            <p>Calculate the average SGPA required each semester to reach your dream CGPA.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-1">
            <div className="feature-icon">📄</div>
            <h3>Result Vault</h3>
            <p>Store semester result PDFs securely and access them anytime, from any device.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-2">
            <div className="feature-icon">📈</div>
            <h3>Academic Dashboard</h3>
            <p>Visualize attendance, syllabus completion, GPA, and overall progress at a glance.</p>
          </div>
          <div className="feature-card reveal in reveal-delay-3">
            <div className="feature-icon">👤</div>
            <h3>Personal Profile</h3>
            <p>Manage your academic information, semesters, and subjects from one place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
