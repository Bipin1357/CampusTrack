import React from 'react';

function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-box reveal in">
          <h2>Start Managing Your Academic Journey Today.</h2>
          <p>Keep your college life organized with CampusTrack — simple, modern, and free for all students.</p>
          <a href="/login" className="btn btn-primary btn-lg">
            Create Free Account
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
