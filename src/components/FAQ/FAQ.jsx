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
      q: 'Can I upload previous semester results?',
      a: 'Absolutely. You can upload and securely store your semester result PDFs in the Result Vault and access them anytime.',
    },
    {
      q: 'Can I edit attendance later?',
      a: 'Yes, attendance entries are fully editable, so you can correct mistakes or update past records whenever you need to.',
    },
    {
      q: 'Is my data secure?',
      a: "Your academic data is encrypted and stored securely, and it's never shared with third parties.",
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
