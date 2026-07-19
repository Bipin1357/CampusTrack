import React from 'react';

function WhyChooseUs() {
  return (
    <section className="section-pad alt-bg">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">Why students choose us</span>
          <h2>One place for all habits</h2>
        </div>
        <div className="why-grid">
          <div className="why-card reveal in reveal-delay-1">
            <div className="why-icon">🗂️</div>
            <h3>Stay Organized</h3>
            <p>Keep attendance, syllabus, and results in one place.</p>
          </div>
          <div className="why-card reveal in reveal-delay-2">
            <div className="why-icon">⏱️</div>
            <h3>Save Time</h3>
            <p>No spreadsheets or scattered notes to maintain.</p>
          </div>
          <div className="why-card reveal in reveal-delay-3">
            <div className="why-icon">🧭</div>
            <h3>Stay Ahead</h3>
            <p>Always know exactly what to study next.</p>
          </div>
          <div className="why-card reveal in reveal-delay-4">
            <div className="why-icon">🏆</div>
            <h3>Achieve Your Goals</h3>
            <p>Track your progress every single semester.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
