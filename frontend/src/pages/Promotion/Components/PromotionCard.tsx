import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaTags, FaFire } from 'react-icons/fa';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validFrom: string;
  validTo: string;
  slug: string;
  category: string;
  featured: boolean;
  image?: string;
}

interface PromotionCardProps {
  promotion: Promotion;
  variant?: 'default' | 'featured' | 'compact';
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'imported':
        return 'Bia nhập khẩu';
      case 'domestic':
        return 'Bia Việt Nam';
      case 'craft':
        return 'Craft Beer';
      default:
        return 'Khuyến mãi';
    }
  };

  const isActive = isPromotionActive(promotion.validFrom, promotion.validTo);
  const daysRemaining = getDaysRemaining(promotion.validTo);

  if (variant === 'compact') {
    return (
      <Link
        to={`/promotion/${promotion.slug}`}
        className="block bg-background border border-[#eee] rounded-lg hover:border-[#cbb27c] transition-all duration-300 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#cbb27c] to-[#d4b995] rounded-lg flex items-center justify-center">
              <FaTags className="text-[#181a1b]" size={20} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary font-serif truncate">{promotion.title}</h3>
            <p className="text-sm text-gray-500 truncate">{promotion.discount}</p>
          </div>
          {isActive && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                <FaFire size={10} className="mr-1" />
                Còn {daysRemaining} ngày
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/promotion/${promotion.slug}`}
        className="block bg-background border border-[#eee] rounded-xl hover:border-[#cbb27c] transition-all duration-300 overflow-hidden group ring-2 ring-[#cbb27c]/30"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-[#1a1d20] via-[#2a2d2e] to-[#1a1d20]">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary text-[#181a1b] font-medium">
              <FaFire size={10} className="mr-1" />
              Nổi bật
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#cbb27c] to-[#d4b995] rounded-xl flex items-center justify-center">
                <FaTags className="text-[#181a1b]" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-primary mb-1">
                {promotion.discount}
              </div>
              <h3 className="text-xl font-semibold text-primary font-serif group-hover:text-primary transition-colors">
                {promotion.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-0">
          <p className="text-gray-500 mb-4 line-clamp-2">
            {promotion.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface border border-[#eee] text-primary">
                <FaTags size={12} className="mr-2" />
                {getCategoryLabel(promotion.category)}
              </span>
              {isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                  <FaClock size={12} className="mr-2" />
                  Còn {daysRemaining} ngày
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                  <FaClock size={12} className="mr-2" />
                  Đã hết hạn
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#eee]">
            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <span>Từ {formatDate(promotion.validFrom)}</span>
              <span>Đến {formatDate(promotion.validTo)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card design
  return (
    <Link
      to={`/promotion/${promotion.slug}`}
      className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      {/* Discount Badge */}
      <div className="bg-red-500 text-white text-center py-4">
        <div className="text-2xl font-bold">{promotion.discount}</div>
        <div className="text-sm opacity-90">GIẢM GIÁ</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {promotion.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {promotion.description}
        </p>

        {/* Category and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <FaTags className="mr-1" />
            {getCategoryLabel(promotion.category)}
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1" />
            {formatDate(promotion.validTo)}
          </span>
        </div>

        {/* Status */}
        {isActive && daysRemaining > 0 && (
          <div className="mt-3 text-center">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Còn {daysRemaining} ngày
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PromotionCard;
