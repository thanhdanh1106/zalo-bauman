import React from 'react';
import { FaClock, FaStar, FaTags } from 'react-icons/fa';
import { MdLocalOffer } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validFrom: string;
  validTo: string;
  image: string;
  category: string;
  featured: boolean;
  slug: string;
}

interface FeaturedPromotionsProps {
  promotions: Promotion[];
}

const FeaturedPromotions: React.FC<FeaturedPromotionsProps> = ({
  promotions,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const isPromotionActive = (validFrom: string, validTo: string) => {
    const now = new Date();
    const start = new Date(validFrom);
    const end = new Date(validTo);
    return now >= start && now <= end;
  };

  const getDaysRemaining = (validTo: string) => {
    const now = new Date();
    const end = new Date(validTo);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaStar className="text-amber-500 text-2xl mr-2" />
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 ">
              Khuyến Mãi Nổi Bật
            </h2>
            <FaStar className="text-amber-500 text-2xl ml-2" />
          </div>
          <p className="text-lg text-gray-600  max-w-2xl mx-auto">
            Đừng bỏ lỡ những ưu đãi đặc biệt và hấp dẫn nhất từ chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {promotions.map((promotion, index) => {
            const daysRemaining = getDaysRemaining(promotion.validTo);
            const isActive = isPromotionActive(
              promotion.validFrom,
              promotion.validTo
            );

            return (
              <div
                key={promotion.id}
                className={`group relative bg-gradient-to-br from-white to-gray-50   rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                  index === 0 ? 'lg:col-span-2 xl:col-span-1' : ''
                }`}
              >
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <FaStar className="mr-1" />
                    Nổi bật
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {isActive ? 'Đang diễn ra' : 'Đã kết thúc'}
                  </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-400"></div>
                </div>

                <div className="relative p-6">
                  {/* Discount Badge */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {promotion.discount}
                        </div>
                        <div className="text-xs">OFF</div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800  mb-3 group-hover:text-amber-600  transition-colors">
                      {promotion.title}
                    </h3>
                    <p className="text-gray-600  leading-relaxed">
                      {promotion.description}
                    </p>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center justify-center space-x-4 mb-6 text-sm text-gray-500 ">
                    <div className="flex items-center">
                      <FaClock className="mr-1 text-amber-500" />
                      <span>Đến {formatDate(promotion.validTo)}</span>
                    </div>
                    {isActive && daysRemaining > 0 && (
                      <div className="flex items-center text-red-600  font-semibold">
                        <span>Còn {daysRemaining} ngày</span>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center px-3 py-1 bg-amber-100  text-amber-800  rounded-full text-sm">
                      <FaTags className="mr-1" />
                      <span>
                        {promotion.category === 'imported' && 'Bia nhập khẩu'}
                        {promotion.category === 'domestic' && 'Bia Việt Nam'}
                        {promotion.category === 'craft' && 'Craft Beer'}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <Link
                      to={`/promotion/${promotion.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg group-hover:shadow-xl"
                    >
                      <MdLocalOffer className="mr-2" />
                      Xem chi tiết
                    </Link>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/promotion"
            className="inline-flex items-center px-8 py-3 bg-white  text-amber-600  font-semibold rounded-lg border-2 border-amber-600  hover:bg-amber-600 hover:text-white   transition-all transform hover:scale-105 shadow-lg"
          >
            <FaTags className="mr-2" />
            Xem tất cả khuyến mãi
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPromotions;


