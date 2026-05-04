import { postCategoryProps } from '@shared/types/post';
import React, { ReactNode } from 'react';
import BrandCard from './BrandCard';

interface BrandListProps {
  title?: string | ReactNode;
  subtitle?: string;
  brands: postCategoryProps[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  showViewAll?: boolean;
  viewAllText?: string;
  onViewAll?: () => void;
  className?: string;
  isLoading?: boolean;
}

const BrandList: React.FC<BrandListProps> = ({
  title,
  subtitle,
  brands,
  columns = 5,
  showViewAll = true,
  viewAllText = 'Xem Tất Cả Thương Hiệu',
  onViewAll,
  className = '',
  isLoading = false,
}) => {
  const getGridColumns = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
      case 6:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View all brands');
    }
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

        {/* Brands Grid */}
        <div className={`grid ${getGridColumns()} gap-6`}>
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: columns * 2 }).map((_, index) => (
              <div key={index} className="animate-pulse">
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
            ))
          ) : brands.length > 0 ? (
            brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                Không có thương hiệu nào để hiển thị
              </p>
            </div>
          )}
        </div>

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

export default BrandList;


