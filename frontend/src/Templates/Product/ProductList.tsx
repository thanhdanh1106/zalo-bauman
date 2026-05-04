import React from 'react';
import ProductCard from './ProductCard';
import { ProductListProps } from './types';

const ProductList: React.FC<ProductListProps> = ({
  title,
  subtitle,
  products,
  columns = 3,
  showViewAll = true,
  viewAllText,
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
        return 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
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

        {/* Products Grid */}
        <div className={`grid ${getGridColumns()} gap-6`}>
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: columns * 2 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-background border border-[#eee] rounded-xl overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-32 bg-surface border border-[#eee]"></div>
                    <div className="flex-1 p-4">
                      <div className="h-4 bg-surface border border-[#eee] rounded mb-2"></div>
                      <div className="h-3 bg-surface border border-[#eee] rounded mb-4 w-3/4"></div>
                      <div className="h-6 bg-surface border border-[#eee] rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layout="vertical"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                Không có sản phẩm nào để hiển thị
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;


