import React from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaShoppingCart,
  FaStar,
} from 'react-icons/fa';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import custom styles
import './BestSellingProducts.css';
import { formatCurrency } from '@shared/utils/Hooks';

export interface BestSellingProduct {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  alcohol: string;
  origin: string;
  soldCount: number;
}

interface BestSellingProductsProps {
  products: BestSellingProduct[];
}

const BestSellingProducts: React.FC<BestSellingProductsProps> = ({
  products,
}) => {
  return (
    <section className="bg-white ">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900  mb-4">
            Sản Phẩm Bán Chạy
          </h2>
          <p className="text-gray-600  text-lg max-w-2xl mx-auto">
            Những sản phẩm bia được khách hàng tin dùng và mua nhiều nhất
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="best-selling-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="bg-gray-50  rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product?.sale_price && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                        -
                        {Math.round(
                          (product.sale_price /
                            product.price) *
                            100
                        )}
                        %
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      Đã bán {product.soldCount}+
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                          size={14}
                        />
                      ))}
                      <span className="text-sm text-gray-600  ml-1">
                        ({product.rating})
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900  mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600  text-sm mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-amber-600">
                          {formatCurrency(product.price)}
                        </span>
                        {product.sale_price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {product.sale_price.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                      <FaShoppingCart size={16} />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white  rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-amber-50  transition-all duration-300">
            <FaArrowLeft className="text-amber-600" size={16} />
          </div>
          <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white  rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-amber-50  transition-all duration-300">
            <FaArrowRight className="text-amber-600" size={16} />
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm uppercase font-semibold transition-all duration-300 flex items-center gap-2 mx-auto">
            Xem Tất Cả Sản Phẩm Bán Chạy
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;


