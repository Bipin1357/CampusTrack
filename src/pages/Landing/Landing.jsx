import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import DashboardShowcase from '../../components/DashboardShowcase/DashboardShowcase';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import FAQ from '../../components/FAQ/FAQ';
import CTA from '../../components/CTA/CTA';
import Footer from '../../components/Footer/Footer';

function Landing() {
  useEffect(() => {
    // Intersection Observer for scroll reveal animations
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => {
      // Temporarily remove 'in' class added in components directly so they can animate
      el.classList.remove('in');
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <DashboardShowcase />
      <HowItWorks />
      <WhyChooseUs />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

export default Landing;
