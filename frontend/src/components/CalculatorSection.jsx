import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingDown, TrendingUp, RefreshCw, User, Calculator, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Body transformation images
const bodyImages = {
  male: {
    before: 'https://customer-assets.emergentagent.com/job_lodz-personal-coach/artifacts/pnzo1api_fat_man.png',
    after: 'https://customer-assets.emergentagent.com/job_lodz-personal-coach/artifacts/z82rxd8g_sport_man.png'
  },
  female: {
    before: 'https://customer-assets.emergentagent.com/job_lodz-personal-coach/artifacts/27tmv54w_fat_wooman.png',
    after: 'https://customer-assets.emergentagent.com/job_lodz-personal-coach/artifacts/cuf11b7s_sport_wooman.png'
  }
};

const CalculatorSection = () => {
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    goal: 'weightLoss',
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    activity: 'moderate',
    duration: 3
  });
  
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!language) return null;

  const goals = [
    { id: 'weightLoss', icon: TrendingDown, color: 'bg-blue-500' },
    { id: 'muscleGain', icon: TrendingUp, color: 'bg-orange-500' },
    { id: 'complex', icon: RefreshCw, color: 'bg-purple-500' }
  ];

  const durations = [
    { months: 1, key: 'month1' },
    { months: 3, key: 'month3' },
    { months: 6, key: 'month6' }
  ];

  const validateForm = () => {
    const newErrors = {};
    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseFloat(formData.weight);

    if (!formData.age || age < 16 || age > 70) {
      newErrors.age = t.calculator.validation.ageRange;
    }
    if (!formData.height || height < 140 || height > 220) {
      newErrors.height = t.calculator.validation.heightRange;
    }
    if (!formData.weight || weight < 40 || weight > 200) {
      newErrors.weight = t.calculator.validation.weightRange;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateResults = () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    setTimeout(() => {
      const age = parseInt(formData.age);
      const height = parseInt(formData.height);
      const weight = parseFloat(formData.weight);
      const isMale = formData.gender === 'male';
      const weeks = formData.duration * 4;

      // BMR calculation (Mifflin-St Jeor)
      let bmr;
      if (isMale) {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      // Activity multipliers
      const activityMultipliers = {
        beginner: 1.2,
        moderate: 1.375,
        advanced: 1.55
      };
      const tdee = bmr * activityMultipliers[formData.activity];

      // Estimate current body fat percentage (simplified)
      let currentFatPercent;
      if (isMale) {
        currentFatPercent = Math.max(8, Math.min(35, 20 + (age - 25) * 0.1 + (weight / (height / 100) ** 2 - 22) * 0.8));
      } else {
        currentFatPercent = Math.max(15, Math.min(42, 28 + (age - 25) * 0.1 + (weight / (height / 100) ** 2 - 22) * 0.8));
      }

      // Current muscle mass estimation
      const fatMass = weight * (currentFatPercent / 100);
      const leanMass = weight - fatMass;
      const currentMuscleMass = leanMass * 0.45; // ~45% of lean mass is muscle

      let targetWeight, targetFatPercent, targetMuscleMass, summaryText;

      if (formData.goal === 'weightLoss') {
        // Weight loss: 0.5kg per week (realistic)
        const weightLoss = Math.min(0.5 * weeks, weight * 0.15); // Max 15% of body weight
        targetWeight = weight - weightLoss;
        targetFatPercent = currentFatPercent - (weightLoss * 0.8); // Mostly fat loss
        targetMuscleMass = currentMuscleMass - (weightLoss * 0.1); // Minimal muscle loss with training
        
        if (language === 'ua') {
          summaryText = `За ${formData.duration} ${formData.duration === 1 ? 'місяць' : 'місяці(-ів)'} під моїм наставництвом ви можете скинути ~${weightLoss.toFixed(1)} кг жиру та зберегти м'язову масу. Ваше тіло стане витривалішим і підтягнутішим.`;
        } else {
          summaryText = `W ciągu ${formData.duration} ${formData.duration === 1 ? 'miesiąca' : 'miesięcy'} pod moim kierownictwem możesz schudnąć ~${weightLoss.toFixed(1)} kg tłuszczu i zachować masę mięśniową. Twoje ciało stanie się bardziej wytrzymałe i jędrne.`;
        }
      } else if (formData.goal === 'muscleGain') {
        // Muscle gain: 0.25kg per week (realistic for natural)
        const muscleGain = Math.min(0.25 * weeks, 6); // Max ~6kg muscle gain
        const weightGain = muscleGain * 1.3; // Some fat gain is inevitable
        targetWeight = weight + weightGain;
        targetFatPercent = currentFatPercent - 0.5; // Slight decrease due to more muscle
        targetMuscleMass = currentMuscleMass + muscleGain;
        
        if (language === 'ua') {
          summaryText = `За ${formData.duration} ${formData.duration === 1 ? 'місяць' : 'місяці(-ів)'} під моїм наставництвом ви можете набрати ~${muscleGain.toFixed(1)} кг м'язової маси. Ваше тіло стане сильнішим та рельєфнішим.`;
        } else {
          summaryText = `W ciągu ${formData.duration} ${formData.duration === 1 ? 'miesiąca' : 'miesięcy'} pod moim kierownictwem możesz zbudować ~${muscleGain.toFixed(1)} kg masy mięśniowej. Twoje ciało stanie się silniejsze i bardziej wyrzeźbione.`;
        }
      } else {
        // Complex: 70% weight loss focus + 30% muscle gain
        const weightLoss = Math.min(0.35 * weeks, weight * 0.1);
        const muscleGain = Math.min(0.1 * weeks, 2);
        targetWeight = weight - weightLoss + (muscleGain * 0.5);
        targetFatPercent = currentFatPercent - (weightLoss * 0.7);
        targetMuscleMass = currentMuscleMass + muscleGain;
        
        if (language === 'ua') {
          summaryText = `За ${formData.duration} ${formData.duration === 1 ? 'місяць' : 'місяці(-ів)'} під моїм наставництвом ви можете скинути ~${weightLoss.toFixed(1)} кг жиру та набрати ~${muscleGain.toFixed(1)} кг м'язової маси. Ідеальна рекомпозиція тіла!`;
        } else {
          summaryText = `W ciągu ${formData.duration} ${formData.duration === 1 ? 'miesiąca' : 'miesięcy'} pod moim kierownictwem możesz schudnąć ~${weightLoss.toFixed(1)} kg tłuszczu i zbudować ~${muscleGain.toFixed(1)} kg masy mięśniowej. Idealna rekompozycja ciała!`;
        }
      }

      setResults({
        current: {
          weight: weight,
          fatPercent: Math.round(currentFatPercent * 10) / 10,
          muscleMass: Math.round(currentMuscleMass * 10) / 10
        },
        forecast: {
          weight: Math.round(targetWeight * 10) / 10,
          fatPercent: Math.round(Math.max(isMale ? 6 : 14, targetFatPercent) * 10) / 10,
          muscleMass: Math.round(targetMuscleMass * 10) / 10
        },
        summaryText,
        tdee: Math.round(tdee)
      });

      setIsCalculating(false);
    }, 800);
  };

  const handleCtaClick = async () => {
    setIsSubmitting(true);
    
    const goalLabels = {
      weightLoss: language === 'ua' ? 'Схуднення' : 'Odchudzanie',
      muscleGain: language === 'ua' ? 'Набір маси' : 'Budowanie masy',
      complex: language === 'ua' ? 'Комплекс' : 'Kompleks'
    };

    const message = language === 'ua' 
      ? `🎯 Ціль: ${goalLabels[formData.goal]}\n📊 Поточна вага: ${formData.weight} кг\n🎯 Цільова вага: ${results.forecast.weight} кг\n⏱ Термін: ${formData.duration} міс.\n\n${results.summaryText}`
      : `🎯 Cel: ${goalLabels[formData.goal]}\n📊 Aktualna waga: ${formData.weight} kg\n🎯 Docelowa waga: ${results.forecast.weight} kg\n⏱ Okres: ${formData.duration} mies.\n\n${results.summaryText}`;

    try {
      await axios.post(`${BACKEND_URL}/api/contact`, {
        name: language === 'ua' ? 'Заявка з калькулятора' : 'Zgłoszenie z kalkulatora',
        phone: '-',
        message: message
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    setResults(null);
    setSubmitSuccess(false);
  };

  // Body Image component
  const BodyImage = ({ type }) => {
    const gender = formData.gender;
    const imageSrc = bodyImages[gender][type];
    
    return (
      <div className="relative mx-auto w-32 h-48 md:w-40 md:h-60 flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={type === 'before' ? 'Before transformation' : 'After transformation'}
          className={`max-w-full max-h-full object-contain transition-all duration-500
            ${type === 'after' ? 'drop-shadow-[0_0_15px_rgba(211,255,98,0.5)]' : ''}`}
        />
      </div>
    );
  };

  return (
    <section id="calculator" className="py-16 md:py-24 bg-gradient-to-b from-[#FAFFEE] to-[#EDEDFE]">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D3FF62] rounded-full mb-4">
            <Calculator size={20} className="text-[#004534]" />
            <span className="text-[#004534] font-semibold text-sm">
              {language === 'ua' ? 'Калькулятор трансформації' : 'Kalkulator transformacji'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004534] mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-lg text-[#0C6951] max-w-2xl mx-auto">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-xl">
            {/* Step 1: Goal Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#004534] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#004534] text-white flex items-center justify-center text-sm">1</span>
                {t.calculator.step1}
              </h3>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {goals.map(({ id, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => handleInputChange('goal', id)}
                    className={`p-3 md:p-6 rounded-[16px] md:rounded-[20px] border-2 transition-all duration-300 
                      ${formData.goal === id 
                        ? 'border-[#004534] bg-[#004534] text-white shadow-lg scale-[1.02]' 
                        : 'border-[#DDDDDD] bg-white text-[#004534] hover:border-[#0C6951]'}`}
                  >
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 ${formData.goal === id ? 'text-[#D3FF62]' : 'text-[#0C6951]'}`} />
                    <span className="block text-xs md:text-base font-medium leading-tight">
                      {t.calculator.goals[id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Personal Data */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#004534] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#004534] text-white flex items-center justify-center text-sm">2</span>
                {t.calculator.step2}
              </h3>
              
              {/* Gender */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#004534] mb-2">
                  {t.calculator.gender.label}
                </label>
                <div className="flex gap-3">
                  {['male', 'female'].map((g) => (
                    <button
                      key={g}
                      onClick={() => handleInputChange('gender', g)}
                      className={`flex-1 py-3 px-4 rounded-[15px] border-2 font-medium transition-all
                        ${formData.gender === g 
                          ? 'border-[#004534] bg-[#004534] text-white' 
                          : 'border-[#DDDDDD] text-[#004534] hover:border-[#0C6951]'}`}
                    >
                      <User className={`w-5 h-5 mx-auto mb-1 ${formData.gender === g ? 'text-[#D3FF62]' : ''}`} />
                      {t.calculator.gender[g]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric inputs grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-[#004534] mb-2">
                    {t.calculator.age}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    min="16"
                    max="70"
                    className={`w-full px-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                      focus:outline-none transition-colors
                      ${errors.age ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-[#004534] mb-2">
                    {t.calculator.height}
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="175"
                    min="140"
                    max="220"
                    className={`w-full px-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                      focus:outline-none transition-colors
                      ${errors.height ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-[#004534] mb-2">
                    {t.calculator.weight}
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="80"
                    min="40"
                    max="200"
                    step="0.1"
                    className={`w-full px-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                      focus:outline-none transition-colors
                      ${errors.weight ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-[#004534] mb-2">
                  {t.calculator.activity.label}
                </label>
                <select
                  value={formData.activity}
                  onChange={(e) => handleInputChange('activity', e.target.value)}
                  className="w-full px-4 py-3 rounded-[15px] border-2 border-[#DDDDDD] bg-white text-[#004534]
                    focus:border-[#0C6951] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="beginner">{t.calculator.activity.beginner}</option>
                  <option value="moderate">{t.calculator.activity.moderate}</option>
                  <option value="advanced">{t.calculator.activity.advanced}</option>
                </select>
              </div>
            </div>

            {/* Step 3: Duration */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#004534] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#004534] text-white flex items-center justify-center text-sm">3</span>
                {t.calculator.step3}
              </h3>
              <div className="flex gap-3">
                {durations.map(({ months, key }) => (
                  <button
                    key={months}
                    onClick={() => handleInputChange('duration', months)}
                    className={`flex-1 py-4 px-4 rounded-[20px] border-2 font-medium transition-all
                      ${formData.duration === months 
                        ? 'border-[#004534] bg-[#004534] text-white shadow-md' 
                        : 'border-[#DDDDDD] text-[#004534] hover:border-[#0C6951]'}`}
                  >
                    <Calendar className={`w-5 h-5 mx-auto mb-1 ${formData.duration === months ? 'text-[#D3FF62]' : ''}`} />
                    {t.calculator.duration[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateResults}
              disabled={isCalculating}
              className="w-full py-4 px-6 rounded-[25px] bg-[#004534] text-white font-semibold text-lg
                hover:bg-[#0C6951] transform hover:-translate-y-1 transition-all duration-200
                shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none
                flex items-center justify-center gap-3"
            >
              {isCalculating ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={22} />
                  {t.calculator.calculate}
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div 
              className="mt-8 bg-white rounded-[32px] p-6 md:p-10 shadow-xl"
              style={{ animation: 'fadeInUp 0.5s ease-out' }}
            >
              {/* Visualization */}
              <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
                {/* Before */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-[#807979] mb-4">{t.calculator.results.now}</h4>
                  <BodyImage type="before" />
                  <div className="mt-4 space-y-2">
                    <div className="bg-[#EDEDFE] rounded-[12px] p-3">
                      <span className="text-sm text-[#807979]">{t.calculator.results.weight}</span>
                      <div className="text-xl font-bold text-[#004534]">{results.current.weight} kg</div>
                    </div>
                    <div className="bg-[#EDEDFE] rounded-[12px] p-3">
                      <span className="text-sm text-[#807979]">{t.calculator.results.fatPercent}</span>
                      <div className="text-xl font-bold text-[#004534]">{results.current.fatPercent}%</div>
                    </div>
                    <div className="bg-[#EDEDFE] rounded-[12px] p-3">
                      <span className="text-sm text-[#807979]">{t.calculator.results.muscleMass}</span>
                      <div className="text-xl font-bold text-[#004534]">{results.current.muscleMass} kg</div>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-[#004534] mb-4">
                    {t.calculator.results.after} {formData.duration} {language === 'ua' ? 'міс.' : 'mies.'}
                  </h4>
                  <BodyImage type="after" />
                  <div className="mt-4 space-y-2">
                    <div className="bg-[#D3FF62]/30 rounded-[12px] p-3 border-2 border-[#D3FF62]">
                      <span className="text-sm text-[#0C6951]">{t.calculator.results.weight}</span>
                      <div className="text-xl font-bold text-[#004534]">
                        {results.forecast.weight} kg
                        <span className={`ml-2 text-sm ${results.forecast.weight < results.current.weight ? 'text-green-600' : 'text-orange-500'}`}>
                          ({results.forecast.weight < results.current.weight ? '' : '+'}{(results.forecast.weight - results.current.weight).toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#D3FF62]/30 rounded-[12px] p-3 border-2 border-[#D3FF62]">
                      <span className="text-sm text-[#0C6951]">{t.calculator.results.fatPercent}</span>
                      <div className="text-xl font-bold text-[#004534]">
                        {results.forecast.fatPercent}%
                        <span className="ml-2 text-sm text-green-600">
                          ({(results.forecast.fatPercent - results.current.fatPercent).toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#D3FF62]/30 rounded-[12px] p-3 border-2 border-[#D3FF62]">
                      <span className="text-sm text-[#0C6951]">{t.calculator.results.muscleMass}</span>
                      <div className="text-xl font-bold text-[#004534]">
                        {results.forecast.muscleMass} kg
                        <span className={`ml-2 text-sm ${results.forecast.muscleMass > results.current.muscleMass ? 'text-green-600' : 'text-orange-500'}`}>
                          (+{(results.forecast.muscleMass - results.current.muscleMass).toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Text */}
              <div className="bg-[#FAFFEE] rounded-[20px] p-6 mb-6 border-l-4 border-[#D3FF62]">
                <p className="text-[#004534] text-lg leading-relaxed">
                  {results.summaryText}
                </p>
              </div>

              {/* CTA Button */}
              {submitSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#D3FF62] flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-[#004534]" />
                  </div>
                  <p className="text-xl font-semibold text-[#004534]">
                    {language === 'ua' ? 'Заявку надіслано!' : 'Zgłoszenie wysłane!'}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCtaClick}
                  disabled={isSubmitting}
                  className="w-full py-5 px-6 rounded-[25px] bg-[#D3FF62] text-[#004534] font-bold text-lg
                    hover:bg-[#c4f050] transform hover:-translate-y-1 transition-all duration-200
                    shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none
                    flex flex-col items-center justify-center gap-1"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-[#004534] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="flex items-center gap-2">
                        {t.calculator.results.cta}
                        <ArrowRight size={22} />
                      </span>
                      <span className="text-sm font-medium opacity-80">
                        {t.calculator.results.ctaSubtitle}
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* Disclaimer */}
              <p className="mt-6 text-center text-sm text-[#807979] italic">
                {t.calculator.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
