import { promotionProps } from '@shared/types/promotion';
import { getThumbnailUrl } from '@shared/utils/Hooks';
import React from 'react';
import { FaClock, FaTags, FaFire, FaGift } from 'react-icons/fa';
import { Link } from 'react-router-dom';


interface PromotionCardProps {
  promotion: promotionProps;
  variant?: 'default' | 'featured' | 'compact';
}

const SimplePromotionCard: React.FC<PromotionCardProps> = ({ 
  promotion, 
  variant = 'default' 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  const isActive = isPromotionActive(promotion.start_date, promotion.end_date);
  const daysRemaining = getDaysRemaining(promotion.end_date);

  if (variant === 'featured') {
    return (
      <Link
        to={`/promotion/${promotion.slug}`}
        className="group relative  bg-gradient-to-r from-[#1a1d20] to-[#2a2d2e] border border-[#eee] rounded-xl overflow-hidden hover:border-[#cbb27c] transition-all duration-300"
      >
        <div className="">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <div className="absolute top-3 left-3 bg-primary text-[#181a1b] px-3 py-1 rounded-full text-sm font-bold">
              <FaFire className="inline mr-1" />
              HOT
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {promotion.discount}
                </div>
                <h3 className="text-lg font-semibold text-primary font-serif mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {promotion.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {promotion.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaClock />
                    {formatDate(promotion.end_date)}
                  </span>
                </div>
                {isActive && daysRemaining > 0 && (
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    Còn {daysRemaining} ngày
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/promotion/${promotion.slug}`}
      className="group bg-background border border-[#eee] rounded-xl overflow-hidden hover:border-[#cbb27c] transition-all duration-300 block"
    >
      {/* Discount Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-4 relative">
        <div className="text-2xl font-bold">{promotion.discount}</div>
        <div className="text-sm opacity-90 flex items-center justify-center gap-1">
          <FaGift />
          GIẢM GIÁ
        </div>
        {promotion.is_featured && (
          <div className="absolute top-2 right-2 bg-primary text-[#181a1b] text-xs px-2 py-1 rounded-full font-medium">
            ⭐ Nổi bật
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 bg-gradient-to-t from-[#1a1d20] to-[#2a2d2e]">
        <h3 className="font-semibold text-primary font-serif mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {promotion.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {promotion.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <FaClock />
            {formatDate(promotion.end_date)}
          </span>
        </div>

        {isActive && daysRemaining > 0 && (
          <div className="text-center">
            <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-medium">
              ⏰ Còn {daysRemaining} ngày
            </span>
          </div>
        )}

        {!isActive && (
          <div className="text-center">
            <span className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full">
              Đã hết hạn
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SimplePromotionCard;


