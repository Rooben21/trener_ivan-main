import React from "react";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import TransformationsSection from "./components/TransformationsSection";
import ServicesSection from "./components/ServicesSection";
import CalculatorSection from "./components/CalculatorSection";
import GallerySection from "./components/GallerySection";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FixedSocialBar from "./components/FixedSocialBar";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <TransformationsSection />
          <ServicesSection />
          <CalculatorSection />
          <GallerySection />
          <ReviewsSection />
          <ContactSection />
        </main>
        <Footer />
        <FixedSocialBar />
      </div>
    </LanguageProvider>
  );
}

export default App;
