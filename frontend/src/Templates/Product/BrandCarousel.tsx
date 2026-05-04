import { postCategoryProps } from '@shared/types/post';
import React, { ReactNode, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BrandCard from './BrandCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './BrandCarousel.css';

interface BrandCarouselProps {
  title?: string | ReactNode;
  subtitle?: string;
  brands: postCategoryProps[];
  showViewAll?: boolean;
  viewAllText?: string;
  onViewAll?: () => void;
  className?: string;
  isLoading?: boolean;
  autoplay?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  spaceBetween?: number;
  slidesPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
}

const BrandCarousel: React.FC<BrandCarouselProps> = ({
  title,
  subtitle,
  brands,
  showViewAll = true,
  viewAllText = 'Xem Tất Cả Thương Hiệu',
  onViewAll,
  className = '',
  isLoading = false,
  autoplay = true,
  showPagination = true,
  showNavigation = true,
  spaceBetween = 24,
  slidesPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
    large: 5,
  },
}) => {
  const swiperRef = useRef<SwiperType>();
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View all brands');
    }
  };

  // Generate loading skeleton items
  const renderLoadingSkeleton = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <SwiperSlide key={`skeleton-${index}`}>
        <div className="animate-pulse">
          <div className="border border-[#eee] rounded-lg overflow-hidden bg-background">
            <div className="aspect-square p-6 flex items-center justify-center bg-gradient-to-br from-[#1a1d20] to-[#2a2d2e]">
              <div className="w-full h-full max-w-[120px] max-h-[120px] bg-surface border border-[#eee] rounded"></div>
            </div>
            <div className="p-4 bg-background border-t border-[#eee]">
              <div className="h-4 bg-surface border border-[#eee] rounded mb-1"></div>
              <div className="h-3 bg-surface border border-[#eee] rounded mb-2 w-2/3 mx-auto"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-surface border border-[#eee] rounded w-1/3"></div>
                <div className="w-3 h-3 bg-surface border border-[#eee] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ));
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-primary font-serif mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {showNavigation &&
            !isLoading &&
            Array.isArray(brands) &&
            brands.length > 0 && (
              <>
                <button
                  ref={navigationPrevRef}
                  className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-12 h-12 bg-primary hover:bg-[#d4b995] text-[#181a1b] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous slide"
                >
                  <FaChevronLeft className="text-lg" />
                </button>

                <button
                  ref={navigationNextRef}
                  className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-12 h-12 bg-primary hover:bg-[#d4b995] text-[#181a1b] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next slide"
                >
                  <FaChevronRight className="text-lg" />
                </button>
              </>
            )}

          {/* Swiper */}
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView.mobile}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            pagination={
              showPagination
                ? {
                    clickable: true,
                    bulletClass:
                      'swiper-pagination-bullet !bg-primary !opacity-50',
                    bulletActiveClass:
                      'swiper-pagination-bullet-active !bg-primary !opacity-100',
                  }
                : false
            }
            autoplay={
              autoplay
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            breakpoints={{
              640: {
                slidesPerView: slidesPerView.tablet,
              },
              768: {
                slidesPerView: slidesPerView.desktop,
              },
              1024: {
                slidesPerView: slidesPerView.large,
              },
            }}
            loop={brands.length > (slidesPerView.large || 5)}
            className="brand-carousel"
          >
            {isLoading ? (
              renderLoadingSkeleton()
            ) : brands.length > 0 ? (
              brands.map((brand) => (
                <SwiperSlide key={brand.id}>
                  <BrandCard brand={brand} />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Không có thương hiệu nào để hiển thị
                  </p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* Pagination Dots (if enabled and not in loading state) */}
        {showPagination &&
          !isLoading &&
          Array.isArray(brands) &&
          brands.length > 0 && (
            <div className="swiper-pagination !relative !mt-8 flex justify-center gap-2"></div>
          )}

        {/* View All Button */}
        {showViewAll &&
          Array.isArray(brands) &&
          brands.length > 0 &&
          !isLoading && (
            <div className="text-center mt-12">
              <button
                onClick={handleViewAll}
                className="inline-flex items-center gap-2 bg-primary hover:bg-[#d4b995] text-[#181a1b] px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {viewAllText}
              </button>
            </div>
          )}
      </div>
    </section>
  );
};

export default BrandCarousel;


