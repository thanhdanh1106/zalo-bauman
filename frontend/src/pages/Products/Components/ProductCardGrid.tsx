import { useCart } from "@shared/hooks/useCart";
import { productProps } from "@shared/types/product";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import React from "react";
import { Link } from "react-router-dom";

interface ProductCardGridProps {
  product: productProps;
  onAddToCart?: (product: productProps) => void;
}

const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  product,
  onAddToCart,
}) => {
  const { addToCart } = useCart();
  const productImage = getThumbnailUrl(product.thumbnail);
  const productLink = `${window.location.origin}/products/${product.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(productLink);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Determine badges (Mocking logic since these might not be in productProps yet)
  const isBestSelling = product.is_featured; // Mapping featured to Best Selling for UI demonstration
  const discount = product.price_old ? Math.round(((product.price_old - product.price) / product.price_old) * 100) : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-white rounded-xl p-3 shadow-[0_4px_15px_rgba(0,0,0,0.03)] relative flex flex-col border border-[#EEEEEE] group active:scale-[0.98] transition-all"
    >
      {/* Badges */}
      {isBestSelling && (
        <div className="absolute top-3 left-3 bg-primary text-white font-sans font-bold text-[9px] px-2 py-1 rounded-sm z-10 uppercase tracking-tighter">
          BÁN CHẠY
        </div>
      )}
      {discount > 0 && (
        <div className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container font-sans font-bold text-[9px] px-2 py-1 rounded-sm z-10">
          -{discount}%
        </div>
      )}

      {/* Image Area */}
      <div className="aspect-square bg-surface-container-low rounded-lg mb-3 relative overflow-hidden">
        <img
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={productImage}
        />

      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-sans font-semibold text-[13px] text-on-surface line-clamp-2 mb-1 leading-tight group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Mocking Weight/Subtitle if not available */}
        <p className="font-sans text-[10px] text-on-surface-variant mb-2">
          {product.category?.name || "Baumann Ginseng Premium"}
        </p>

        <div className="mt-auto flex items-end justify-between gap-1">
          <div>
            <p className="font-serif font-bold text-base text-primary leading-none mb-0.5">
              {product.price.toLocaleString()}đ
            </p>
            {product.price_old && product.price_old > product.price && (
              <p className="font-sans text-[10px] text-on-surface-variant line-through opacity-70">
                {product.price_old.toLocaleString()}đ
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>shopping_cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardGrid;
