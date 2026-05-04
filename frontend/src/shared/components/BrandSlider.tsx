import BrandCard, { BrandProps } from "@/Templates/Product/BrandCard";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

type Props = {
  brands: BrandProps[];
};

const BrandSlider = (props: Props) => {
  const { brands } = props;
  const swiperRef = useRef<SwiperType>();

  if (!brands || (Array.isArray(brands) && brands.length === 0)) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-[44px] h-[44px] bg-primary hover:bg-[#d4b995] text-[#181a1b] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaChevronLeft className="text-sm" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10">
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-[44px] h-[44px] bg-primary hover:bg-[#d4b995] text-[#181a1b] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>

      {/* Swiper */}
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
        className="brand-slider"
      >
        {brands.map((brand) => (
          <SwiperSlide key={brand.id}>
            <BrandCard brand={brand} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BrandSlider;


