import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ReviewsSection = () => {
  const { t, language } = useLanguage();

  useEffect(() => {
    // Load Elfsight script
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!language) return null;

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#FAFAFF]">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004534] text-center mb-12 md:mb-16">
          {t.reviews.title}
        </h2>

        {/* Elfsight Google Reviews Widget */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="elfsight-app-11c4a71a-1dcb-40e9-b28b-65b782332ad9" 
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;