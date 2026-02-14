import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Dumbbell, Video, Apple } from 'lucide-react';

const ServicesSection = () => {
  const { t, language } = useLanguage();

  if (!language) return null;

  const icons = [Dumbbell, Video, Apple];

  return (
    <section id="services" className="py-16 md:py-24 bg-[#FAFFEE]">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004534] text-center mb-12 md:mb-16">
          {t.services.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div
                key={service.id}
                className="bg-[#FAFAFF] rounded-[32px] p-6 md:p-8 shadow-md
                          hover:shadow-xl hover:-translate-y-2 transition-all duration-300
                          group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-[#EDEDFE] flex items-center justify-center mb-6
                              group-hover:bg-[#D3FF62] transition-colors duration-300">
                  <Icon className="w-8 h-8 text-[#004534]" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#004534] mb-4">
                  {service.title}
                </h3>
                <p className="text-[#0C6951] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;