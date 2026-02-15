import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const transformations = [
  {
    id: 1,
    image: '/images/transformations/transform1.jpg',
    result: '+11 kg',
    duration: { ua: '6 місяців', pl: '6 miesięcy' },
    type: 'gain'
  },
  {
    id: 2,
    image: '/images/transformations/transform2.jpg',
    result: '-7 kg',
    duration: { ua: '2 місяці', pl: '2 miesiące' },
    type: 'loss'
  },
  {
    id: 3,
    image: '/images/transformations/transform3.jpg',
    result: '-6 kg',
    duration: { ua: '2 місяці', pl: '2 miesiące' },
    type: 'loss'
  },
  {
    id: 4,
    image: '/images/transformations/transform4.jpg',
    result: '+13 kg',
    duration: { ua: '1 рік', pl: '1 rok' },
    type: 'gain'
  },
  {
    id: 5,
    image: '/images/transformations/transform5.jpg',
    result: '+6 kg',
    duration: { ua: '2 місяці', pl: '2 miesiące' },
    type: 'gain'
  }
];

const TransformationsSection = () => {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);

  if (!language) return null;

  const title = language === 'ua' ? 'Результати клієнтів' : 'Wyniki klientów';
  const subtitle = language === 'ua' 
    ? 'Реальні трансформації під моїм керівництвом' 
    : 'Prawdziwe transformacje pod moim kierownictwem';

  const openLightbox = (index) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? transformations.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImage((prev) => (prev === transformations.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="transformations" className="py-16 md:py-24 bg-[#EDEDFE]">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004534] mb-4">
            {title}
          </h2>
          <p className="text-lg text-[#0C6951] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Transformations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformations.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative bg-white rounded-[24px] overflow-hidden shadow-lg 
                        hover:shadow-2xl transition-all duration-300 cursor-pointer
                        hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={`Transformation ${item.result}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Overlay with results */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#004534] to-transparent p-4 pt-16">
                <div className="flex items-center justify-between">
                  <div className={`text-2xl md:text-3xl font-bold ${item.type === 'gain' ? 'text-[#D3FF62]' : 'text-[#7DD3FC]'}`}>
                    {item.result}
                  </div>
                  <div className="text-white/90 font-medium">
                    {item.duration[language]}
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-semibold
                ${item.type === 'gain' 
                  ? 'bg-[#D3FF62] text-[#004534]' 
                  : 'bg-[#7DD3FC] text-[#004534]'}`}
              >
                {item.type === 'gain' 
                  ? (language === 'ua' ? 'Набір маси' : 'Masa') 
                  : (language === 'ua' ? 'Схуднення' : 'Odchudzanie')}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              const contact = document.getElementById('contact');
              if (contact) contact.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-[25px] bg-[#004534] text-white font-semibold text-lg
                      hover:bg-[#0C6951] transform hover:-translate-y-1 transition-all duration-200
                      shadow-lg hover:shadow-xl"
          >
            {language === 'ua' ? 'Хочу такий результат!' : 'Chcę taki wynik!'}
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={40} />
          </button>
          
          <div className="max-w-4xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={transformations[selectedImage].image}
              alt={`Transformation ${transformations[selectedImage].result}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <span className={`text-3xl font-bold ${transformations[selectedImage].type === 'gain' ? 'text-[#D3FF62]' : 'text-[#7DD3FC]'}`}>
                {transformations[selectedImage].result}
              </span>
              <span className="text-white/80 text-xl ml-4">
                {transformations[selectedImage].duration[language]}
              </span>
            </div>
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </section>
  );
};

export default TransformationsSection;
