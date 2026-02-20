import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ReviewsSection = () => {
  const { t, language } = useLanguage();

  useEffect(() => {
    // Load Featurable widget script
    const src = 'https://featurable.com/assets/bundle.js';
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.charset = 'UTF-8';
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

        {/* Featurable reviews widget */}
        <div className="max-w-4xl mx-auto">
          <div id="featurable-8d4d957b-7630-4a66-89a1-2bfe339e4502" data-featurable-async />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;