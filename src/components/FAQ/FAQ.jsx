import React, { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is CampusTrack free?',
      a: 'Yes. CampusTrack is completely free to use for students — no hidden fees, no credit card required.',
    },
    {
      q: 'How does attendance marking work?',
      a: 'Attendance opens automatically after your scheduled class ends for a 50-minute window, allowing you to mark your attendance directly from your dashboard.',
    },
    {
      q: 'How do Academic Records work?',
      a: 'You can record, track, and manage your semester SGPA, CGPA, earned credits, and grade history easily from your student portal.',
    },
    {
      q: 'Is my data secure?',
      a: "Your academic data is stored securely and is only accessible by authorized student and administrator accounts.",
    },
  ];

  return (
    <section className="section-pad" id="faq">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">Questions & answers</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq-list reveal in reveal-delay-1">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={index}>
                <button className="faq-q" onClick={() => toggleFaq(index)}>
                  {faq.q} <span className="plus">+</span>
                </button>
                <div
                  className="faq-a"
                  style={{ maxHeight: isOpen ? '200px' : null }}
                >
                  <div className="faq-a-inner">{faq.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
