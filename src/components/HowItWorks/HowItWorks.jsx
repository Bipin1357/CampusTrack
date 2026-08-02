import React from 'react';

function HowItWorks() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">Get started in minutes</span>
          <h2>How CampusTrack works</h2>
        </div>
        <div className="steps-wrap">
          <div className="step-connector"></div>
          <div className="step reveal in reveal-delay-1">
            <div className="step-num">1</div>
            <h3>Create your account</h3>
            <p>Sign up free in under a minute — no credit card needed.</p>
          </div>
          <div className="step reveal in reveal-delay-2">
            <div className="step-num">2</div>
            <h3>Set up your profile</h3>
            <p>Select your department, semester, and section to view your personalized schedule.</p>
          </div>
          <div className="step reveal in reveal-delay-3">
            <div className="step-num">3</div>
            <h3>Track your journey effortlessly</h3>
            <p>Mark daily class attendance, view weekly timetables, and track academic records in real time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
