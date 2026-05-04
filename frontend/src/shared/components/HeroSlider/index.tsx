import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import './HeroSlider.css';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  primaryButton: {
    text: string;
    action: () => void;
  };
  secondaryButton: {
    text: string;
    action: () => void;
  };
  backgroundImage?: string;
}

interface HeroSliderProps {
  slides: SlideData[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[600px] lg:h-[700px] overflow-hidden bg-background">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="relative h-full flex items-center justify-center bg-gradient-to-br from-[#181a1b] via-[#1a1c1d] to-[#1e2021]"
              style={{
                backgroundImage: slide.backgroundImage
                  ? `linear-gradient(rgba(24, 26, 27, 0.7), rgba(24, 26, 27, 0.7)), url(${slide.backgroundImage})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-[#cbb27c]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#cbb27c]/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <div className="mb-6">
                      <span className="inline-block px-4 py-2 bg-primary/20 border border-[#cbb27c]/30 rounded-full text-primary text-sm font-medium mb-4">
                        Premium Beer Collection
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary font-serif mb-6 leading-tight">
                      <span className="text-primary block">{slide.title}</span>
                      <span className="text-primary font-serif">{slide.subtitle}</span>
                    </h1>
                    <p className="text-xl text-primary/80 mb-8 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button
                        onClick={slide.primaryButton.action}
                        className="group bg-primary hover:bg-primary/90 text-[#181a1b] px-3 py-2 rounded-lg text-sm uppercase font-semibold transition-all duration-300 flex items-center gap-3 justify-center border border-[#cbb27c] hover:shadow-lg hover:shadow-[#cbb27c]/20"
                      >
                        <FaShoppingCart className="group-hover:scale-110 transition-transform" />
                        {slide.primaryButton.text}
                      </button>
                      <button
                        onClick={slide.secondaryButton.action}
                        className="border-2 border-[#cbb27c] text-primary hover:bg-primary hover:text-[#181a1b] px-3 py-2 rounded-lg text-sm uppercase font-semibold transition-all duration-300 backdrop-blur-sm"
                      >
                        {slide.secondaryButton.text}
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Beer Image */}
                  <div className="w-full lg:w-1/2 flex justify-center items-center">
                    <div
                      className={`relative ${
                        index === currentSlide ? 'fade-in-up' : ''
                      }`}
                    >
                      {/* Main Beer Bottle Image */}
                      <div className="relative z-10">
                        <img
                          src={slide.image || '/api/placeholder/300/500'}
                          alt={slide.title || 'Premium Beer Bottle'}
                          className="w-auto h-[300px] lg:w-auto lg:h-[400px] object-contain drop-shadow-2xl animate-float filter brightness-110"
                        />
                        
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#cbb27c]/20 via-transparent to-transparent rounded-full blur-2xl"></div>
                      </div>

                      {/* Decorative Background Elements */}
                      <div className="absolute -top-8 -left-8 w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-[#cbb27c]/20 to-[#cbb27c]/5 rounded-full opacity-60 animate-pulse blur-sm"></div>
                      <div className="absolute -bottom-12 -right-12 w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[#cbb27c]/15 to-transparent rounded-full opacity-40 animate-pulse delay-1000 blur-sm"></div>
                      
                      {/* Floating Particles */}
                      <div className="absolute top-10 right-10 w-2 h-2 bg-primary rounded-full animate-ping opacity-60"></div>
                      <div className="absolute bottom-20 left-8 w-1 h-1 bg-primary rounded-full animate-ping delay-500 opacity-40"></div>
                      <div className="absolute top-32 left-16 w-1.5 h-1.5 bg-primary rounded-full animate-ping delay-1000 opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-[#1e2021]/80 hover:bg-primary/20 border border-[#cbb27c]/30 hover:border-[#cbb27c]/60 text-primary p-4 rounded-full transition-all duration-300 z-20 backdrop-blur-sm group"
      >
        <FaChevronLeft className="text-xl group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-[#1e2021]/80 hover:bg-primary/20 border border-[#cbb27c]/30 hover:border-[#cbb27c]/60 text-primary p-4 rounded-full transition-all duration-300 z-20 backdrop-blur-sm group"
      >
        <FaChevronRight className="text-xl group-hover:scale-110 transition-transform" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-8 h-3 bg-primary shadow-lg shadow-[#cbb27c]/30'
                : 'w-3 h-3 bg-primary/40 hover:bg-primary/60 border border-[#cbb27c]/20'
            }`}
          />
        ))}
      </div>
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#181a1b] to-transparent z-10"></div>
    </div>
  );
};

export default HeroSlider;


