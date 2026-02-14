import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { trainerData, galleryImages } from '../data/mock';
import { Users, Trophy, Calendar } from 'lucide-react';

const AboutSection = () => {
  const { t, language } = useLanguage();

  if (!language) return null;

  const stats = [
    { icon: Calendar, value: trainerData.stats.experience, label: t.about.experience },
    { icon: Users, value: trainerData.stats.clients, label: t.about.clients },
    { icon: Trophy, value: trainerData.stats.competitions, label: t.about.competitions }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-[#FAFAFF]">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-4 bg-[#CACAFC] rounded-[32px] -z-10" />
            <img
              src={galleryImages[2].src}
              alt="Training"
              className="w-full rounded-[32px] shadow-xl object-cover aspect-[4/5]"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004534] mb-6">
              {t.about.title}
            </h2>
            <p className="text-lg md:text-xl text-[#0C6951] leading-relaxed mb-10">
              {t.about.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-[24px] p-4 md:p-6 text-center shadow-md
                            hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-[#0C6951]" />
                  <div className="text-2xl md:text-3xl font-bold text-[#004534] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-[#807979]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;