import { productProps } from "@shared/types/product";
import React from "react";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: productProps[];
  viewMode: "grid" | "list";
  isLoading?: boolean;
  error?: string | null;
  onAddToCart?: (product: productProps) => void;
  onToggleWishlist?: (productId: number) => void;
  wishlistIds?: number[];
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  viewMode,
  isLoading = false,
  error = null,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-primary/70">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FaExclamationTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary font-serif mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-primary/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-[#181a1b] rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return null;
  }

  // Products Grid/List
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3"
          : "space-y-6"
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistIds.includes(product.id)}
        />
      ))}
    </div>
  );
};

// Loading Skeleton Component
export const ProductListSkeleton: React.FC<{
  viewMode: "grid" | "list";
  count?: number;
}> = ({ viewMode, count = 8 }) => {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-y-6 gap-x-3"
          : "space-y-6"
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-[#1e2021] border border-[#cbb27c]/20 rounded-xl overflow-hidden animate-pulse ${
            viewMode === "list" ? "flex" : ""
          }`}
        >
          <div
            className={`bg-gray-700 ${
              viewMode === "list" ? "w-64 h-48" : "h-64"
            }`}
          />
          <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
            <div className="flex gap-2 mb-3">
              <div className="h-5 bg-gray-700 rounded-full w-16" />
              <div className="h-5 bg-gray-700 rounded-full w-20" />
            </div>
            <div className="h-6 bg-gray-700 rounded mb-3 w-3/4" />
            <div className="h-4 bg-gray-700 rounded mb-2 w-full" />
            <div className="h-4 bg-gray-700 rounded mb-4 w-2/3" />
            <div className="h-5 bg-gray-700 rounded mb-4 w-24" />
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-700 rounded w-24" />
                <div className="h-4 bg-gray-700 rounded w-16" />
              </div>
              <div className="h-12 bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;


