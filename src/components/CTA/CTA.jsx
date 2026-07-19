import React from 'react';

function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-box reveal in">
          <h2>Start Managing Your Academic Journey Today.</h2>
          <p>Join thousands of students who keep their academic life organized with CampusTrack.</p>
          <a href="/login" className="btn btn-primary btn-lg">
            Create Free Account
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
