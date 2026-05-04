import React, { useState } from "react";
import { FaCheck, FaEye, FaShoppingCart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "@shared/hooks/useCart";
import { productProps } from "@shared/types/product";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";

interface SearchProductCardProps {
  product: productProps;
  onProductClick?: (product: productProps) => void;
  className?: string;
}

const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  onProductClick,
  className = "",
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    try {
      addToCart(product, 1);
    } finally {
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/products/${product.slug}`);
    }
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.slug}`);
  };

  return (
    <div
      className={`bg-background border border-[#eee] rounded-lg hover:border-[#cbb27c] transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleProductClick}
    >
      <div className="flex items-center p-3 gap-3">
        {/* Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={getThumbnailUrl(product?.thumbnail)}
            alt={product.name}
            className="w-full h-full object-cover search-product-image transition-transform duration-300"
          />
          {product.is_featured && (
            <div className="absolute -top-1 -left-1 bg-primary text-[#181a1b] px-1 py-0.5 rounded text-xs font-medium">
              HOT
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-primary font-serif group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h4>

          {/* Brand and Category */}
          <div className="flex items-center gap-2 mt-1">
            {product.brand && (
              <span className="text-xs text-gray-500">
                {product.brand.name}
              </span>
            )}
            {product.brand && product.categories?.length > 0 && (
              <span className="text-[#4a4d4e]">•</span>
            )}
            {product.categories?.length > 0 && (
              <span className="text-xs text-gray-500">
                {product.categories[0]?.title}
              </span>
            )}
          </div>

          {/* Rating and SKU Info */}
          <div className="flex items-center gap-3 mt-1">
            {product.rating && (
              <div className="flex items-center gap-1">
                <FaStar className="text-primary text-xs" />
                <span className="text-xs text-gray-500">{product.rating}</span>
              </div>
            )}
            {product.sku && (
              <span className="text-xs text-gray-500">SKU: {product.sku}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.soldCount && (
              <span className="text-xs text-[#6b7280]">
                Đã bán: {product.soldCount}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined &&
            product.stock <= 10 &&
            product.stock > 0 && (
              <div className="mt-1">
                <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                  Chỉ còn {product.stock}
                </span>
              </div>
            )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 flex-shrink-0">
        {/* View Product Button */}
        <button
          onClick={handleViewProduct}
          className=" bg-surface border border-[#eee] hover:bg-[#3a3d3e] text-xs uppercase gap-2 px-2 py-1 border border-[#eee] hover:border-[#cbb27c] rounded-lg flex items-center justify-center text-gray-500 hover:text-primary transition-all search-action-button"
          title="Xem chi tiết"
        >
          <FaEye size={12} />
          Chi tiết
        </button>

        {/* Add to Cart Button */}
        {!product.stock || product.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border search-action-button ${isAdding
              ? "bg-green-600 border-green-600 text-white"
              : "bg-primary hover:bg-[#d4b995] border-[#cbb27c] hover:border-[#d4b995] text-[#181a1b]"
              }`}
            title={isAdding ? "Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}
          >
            {isAdding ? <FaCheck size={12} /> : <FaShoppingCart size={12} />}
          </button>
        ) : (
          <button
            disabled
            className="w-8 h-8 bg-gray-600 border-gray-600 text-gray-400 rounded-lg flex items-center justify-center cursor-not-allowed search-action-button"
            title="Hết hàng"
          >
            <FaShoppingCart size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchProductCard;


