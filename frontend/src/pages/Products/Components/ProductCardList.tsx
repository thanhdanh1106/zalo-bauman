import { useCart } from "@shared/hooks/useCart";
import { useWishlist } from "@shared/hooks/useWishlist";
import { productProps } from "@shared/types/product";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";
import React, { useState } from "react";
import {
  FaBox,
  FaCheck,
  FaEye,
  FaHeart,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
  FaTag,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface ProductCardListProps {
  product: productProps;
  onAddToCart?: (product: productProps) => void;
}

const ProductCardList: React.FC<ProductCardListProps> = ({
  product,
  onAddToCart,
}) => {
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useCart();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const productId = parseInt(product.id.toString());
  const inCartQuantity = getItemQuantity(productId);
  const itemInCart = isInCart(productId);

  const discountPercentage = 0;

  const productImage = getThumbnailUrl(product.thumbnail);
  const productLink = `${window.location.origin}/products/${product.slug}`;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      if (onAddToCart) {
        onAddToCart(product);
      } else {
        addToCart(product, 1);
      }
    } finally {
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  const handleIncreaseQuantity = () => {
    increaseItemQuantity(productId);
  };

  const handleDecreaseQuantity = () => {
    decreaseItemQuantity(productId);
  };

  const onToggleWishlist = (product) => {
    toggleWishlist(product);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productLink);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="bg-[#1e2021] border border-[#cbb27c]/20 rounded-2xl overflow-hidden hover:border-[#cbb27c]/40 hover:shadow-xl hover:shadow-[#cbb27c]/5 transition-all duration-300 group">
      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Image Section - Wide format cho desktop */}
        <div className="relative flex-shrink-0 w-72 h-48 overflow-hidden">
          <Link to={`/products/${product.slug}`}>
            <img
              src={productImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1e2021]/30" />

          {/* Badges positioned differently for list */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {product.is_featured && (
              <span className="bg-gradient-to-r from-[#cbb27c] to-[#d4b995] text-[#181a1b] px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                <FaStar />
              </span>
            )}
          </div>

          {/* Quick Actions - Bottom right của image */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => onToggleWishlist?.(product)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                isInWishlist(product.id)
                  ? "bg-red-500/90 text-white"
                  : "bg-black/20 text-primary hover:bg-red-500/90 hover:text-white"
              }`}
            >
              <FaHeart className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full bg-black/20 text-primary hover:bg-primary/90 hover:text-[#181a1b] backdrop-blur-sm transition-all duration-300"
              title="Copy link"
              aria-label="Copy product link"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                content_copy
              </span>
            </button>
            <Link
              to={`/products/${product.slug}`}
              className="p-2 rounded-full bg-black/20 text-primary hover:bg-primary/90 hover:text-[#181a1b] backdrop-blur-sm transition-all duration-300"
            >
              <FaEye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Desktop Content Section - Horizontal layout */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Header: Title + Stock Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-bold text-xl text-primary font-serif group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                </Link>
              </div>

              <div className="ml-4 flex items-center gap-2">
                <FaBox className="text-primary w-4 h-4" />
                {product.stock > 0 ? (
                  <span className="text-[8px] bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 font-medium">
                    Còn {product.stock}
                  </span>
                ) : (
                  <span className="text-[8px] bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30 font-medium">
                    Hết hàng
                  </span>
                )}
              </div>
            </div>

            {/* Categories & Brand - Horizontal layout */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <FaTag className="text-primary w-4 h-4" />
              {product?.categories?.map((category) => (
                <span
                  key={category.id}
                  className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full border border-[#cbb27c]/20 font-medium"
                >
                  {category.title}
                </span>
              ))}
              {product.brand && (
                <span className="text-sm bg-gradient-to-r from-[#181a1b] to-[#2a2d2e] text-primary font-serif px-3 py-1 rounded-full border border-[#cbb27c]/20 font-medium">
                  {product.brand.title}
                </span>
              )}
            </div>

            {/* Description - More prominent in list view */}
            {product.description && (
              <p className="text-primary/80 text-sm mb-4 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Rating + Price - Horizontal */}
            <div className="flex items-center justify-between mb-4">
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base text-primary/80 ml-3 font-medium">
                    {product.rating}/5
                  </span>
                </div>
              )}

              {/* Price - Large display */}
              <div className="text-right">
                {product.price && (
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-primary bg-gradient-to-r from-[#cbb27c] to-[#d4b995] bg-clip-text text-transparent">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm text-primary/60">
                      Giá bán lẻ
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Section - Bottom of card */}
          <div className="border-t border-[#cbb27c]/10 pt-4">
            {product.stock === 0 ? (
              <button
                disabled
                className="w-full bg-gray-600/50 text-gray-400 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2 border border-gray-600/30"
              >
                <FaBox className="w-4 h-4" />
                Hết hàng
              </button>
            ) : itemInCart && inCartQuantity > 0 ? (
              <div className="inline-flex items-center gap-4">
                <div className="flex items-center bg-surface border border-[#eee] rounded-xl overflow-hidden border border-[#cbb27c]/20">
                  <button
                    onClick={handleDecreaseQuantity}
                    className="px-4 py-3 hover:bg-[#3a3d3e] transition-colors text-primary hover:text-[#d4b995]"
                  >
                    <FaMinus size={16} />
                  </button>
                  <span className="px-6 py-3 text-primary font-serif font-bold min-w-[60px] text-center bg-[#1e2021] text-lg">
                    {inCartQuantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="px-4 py-3 hover:bg-[#3a3d3e] transition-colors text-primary hover:text-[#d4b995] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={inCartQuantity >= product.stock}
                  >
                    <FaPlus size={16} />
                  </button>
                </div>
                <span className="text-sm text-primary/70 font-medium">
                  Trong giỏ hàng
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                    isAdding
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-r from-[#cbb27c] to-[#d4b995] hover:from-[#d4b995] hover:to-[#cbb27c] text-[#181a1b] shadow-lg shadow-[#cbb27c]/20 hover:shadow-[#cbb27c]/30"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <FaCheck size={18} />
                      Đã thêm vào giỏ!
                    </>
                  ) : (
                    <>
                      <FaShoppingCart size={18} />
                      Thêm vào giỏ hàng
                    </>
                  )}
                </button>

                <span className="text-sm text-primary/70 font-medium whitespace-nowrap">
                  Mua ngay
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex">
          {/* Mobile Image Section - Bên trái */}
          <div className="relative flex-shrink-0 w-24 h-24 rounded-lg m-3">
            <Link to={`/products/${product.slug}`}>
              <img
                src={productImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </Link>

            {/* Mobile Badges - Compact */}
            {product.is_featured && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <FaStar className="text-primary" />
              </div>
            )}
          </div>

          {/* Mobile Content - Giữa */}
          <div className="flex-1 p-3 pr-2 flex flex-col justify-between min-h-[96px]">
            {/* Title */}
            <div className="mb-2">
              <Link to={`/products/${product.slug}`}>
                <h3 className="font-semibold text-sm text-primary font-serif line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
              </Link>

              {/* Categories - Mobile compact */}
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {product?.categories?.slice(0, 1).map((category) => (
                  <span
                    key={category.id}
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-[#cbb27c]/20 font-medium"
                  >
                    {category.title}
                  </span>
                ))}
                {product.brand && (
                  <span className="text-xs bg-gradient-to-r from-[#181a1b] to-[#2a2d2e] text-primary font-serif px-2 py-0.5 rounded-full border border-[#cbb27c]/20 font-medium">
                    {product.brand.title}
                  </span>
                )}
              </div>
            </div>

            {/* Description - Mobile compact */}
            {product.description && (
              <p className="text-xs text-primary/70 line-clamp-2 leading-relaxed mb-2">
                {product.description}
              </p>
            )}

            {/* Rating - Mobile */}
            {product.rating && (
              <div className="flex items-center mb-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xs ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-primary/70 ml-1">
                  {product.rating}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Price - Bên phải */}
          <div className="flex flex-col justify-between p-3 pl-0 min-w-[80px]">
            {/* Stock Status */}
            <div className="text-right mb-1">
              {product.stock > 0 ? (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 font-medium">
                  Còn {product.stock}
                </span>
              ) : (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-medium">
                  Hết hàng
                </span>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              {product.price && (
                <div className="flex flex-col items-end">
                  <span className="text-base font-bold text-primary bg-gradient-to-r from-[#cbb27c] to-[#d4b995] bg-clip-text text-transparent">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Actions - Dưới cùng */}
        <div className="px-3 pb-3">
          {product.stock === 0 ? (
            <button
              disabled
              className="w-full bg-gray-600/50 text-gray-400 py-2.5 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2 border border-gray-600/30 text-sm"
            >
              <FaBox className="w-3 h-3" />
              Hết hàng
            </button>
          ) : itemInCart && inCartQuantity > 0 ? (
            <div className="inline-flex items-center gap-2">
              <div className="flex items-center bg-surface border border-[#eee] rounded-lg overflow-hidden border border-[#cbb27c]/20 flex-1">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-3 py-2.5 hover:bg-[#3a3d3e] transition-colors text-primary hover:text-[#d4b995]"
                >
                  <FaMinus size={12} />
                </button>
                <span className="px-3 py-2.5 text-primary font-serif font-bold min-w-[40px] text-center bg-[#1e2021] text-sm">
                  {inCartQuantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="px-3 py-2.5 hover:bg-[#3a3d3e] transition-colors text-primary hover:text-[#d4b995] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={inCartQuantity >= product.stock}
                >
                  <FaPlus size={12} />
                </button>
              </div>
              <button
                onClick={() => onToggleWishlist?.(product)}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  isInWishlist(product.id)
                    ? "bg-red-500/90 text-white"
                    : "bg-surface border border-[#eee] text-primary hover:bg-red-500/90 hover:text-white border border-[#cbb27c]/20"
                }`}
              >
                <FaHeart className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                  isAdding
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                    : "bg-gradient-to-r from-[#cbb27c] to-[#d4b995] hover:from-[#d4b995] hover:to-[#cbb27c] text-[#181a1b] shadow-lg shadow-[#cbb27c]/20"
                }`}
              >
                {isAdding ? (
                  <>
                    <FaCheck size={14} />
                    Đã thêm!
                  </>
                ) : (
                  <>
                    <FaShoppingCart size={14} />
                    Thêm vào giỏ
                  </>
                )}
              </button>

              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-lg bg-surface border border-[#eee] text-primary hover:bg-surface-container-low transition-colors border border-[#cbb27c]/20"
                title="Copy link"
                aria-label="Copy product link"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  content_copy
                </span>
              </button>

              <button
                onClick={() => onToggleWishlist?.(product)}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  isInWishlist(product.id)
                    ? "bg-red-500/90 text-white"
                    : "bg-surface border border-[#eee] text-primary hover:bg-red-500/90 hover:text-white border border-[#cbb27c]/20"
                }`}
              >
                <FaHeart className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;


