import { useWishlist } from "@shared/hooks/useWishlist";
import { useCart } from "@shared/hooks/useCart";
import { RootState } from "@shared/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { productProps } from "@shared/types/product";
import { setNavigationBarTitle } from "zmp-sdk/apis";
import { useEffect } from "react";

const WishlistCard: React.FC<{ product: productProps }> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const productImage = getThumbnailUrl(product.thumbnail);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discount = product.price_old ? Math.round(((product.price_old - product.price) / product.price_old) * 100) : 0;

  return (
    <Link 
      to={`/products/${product.slug}`}
      className="bg-white rounded-2xl p-3 shadow-sm relative flex flex-col border border-gray-100/50 group active:scale-[0.98] transition-all"
    >
      {/* Wishlist Heart Icon */}
      <button 
        onClick={handleToggleWishlist}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#8f0012] active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-[20px] icon-fill">
          favorite
        </span>
      </button>

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-[#cbb27c]/20 text-[#8f0012] font-sans font-bold text-[9px] px-2 py-1 rounded-md backdrop-blur-sm">
          -{discount}%
        </div>
      )}

      {/* Image Area */}
      <div className="aspect-square bg-[#f6f3f2] rounded-xl mb-3 relative overflow-hidden">
        <img 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          src={productImage} 
        />
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-grow px-1">
        <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
          {product.category?.name || "CAO CẤP"}
        </p>
        
        <h3 className="font-serif font-bold text-[14px] text-[#181a1b] line-clamp-2 mb-2 leading-tight min-h-[36px]">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="font-serif font-bold text-base text-[#8f0012] leading-none mb-0.5">
              {product.price.toLocaleString()}đ
            </p>
            {product.price_old && product.price_old > product.price && (
              <p className="font-sans text-[10px] text-gray-400 line-through opacity-70">
                {product.price_old.toLocaleString()}đ
              </p>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-full bg-[#8f0012] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#8f0012]/20 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px] icon-fill">
              shopping_cart
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

const AccountWishlist: React.FC = () => {
  const { isLoading, clearWishlist } = useWishlist();
  const { items } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    setNavigationBarTitle({ title: "Sản phẩm yêu thích" });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f3f2] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8f0012] mx-auto mb-4"></div>
          <p className="text-[#8f0012] font-serif text-sm">Đang tải bộ sưu tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3f2] pb-24">
      {/* Custom Header Area */}
      <div className="p-margin-main pt-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#181a1b] font-serif leading-tight">
              Bộ sưu tập của bạn
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {items.length} sản phẩm đã lưu
            </p>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={() => clearWishlist()}
              className="text-[#8f0012] text-sm font-bold pt-1"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-margin-main">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 mt-4">
            <div className="w-20 h-20 bg-[#8f0012]/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px] text-[#8f0012]/40">
                favorite
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#181a1b] font-serif mb-3">
              Danh sách trống
            </h3>

            <p className="text-gray-500 text-sm mb-8 max-w-[240px] mx-auto">
              Hãy thêm những sản phẩm bạn yêu thích vào bộ sưu tập để theo dõi dễ dàng hơn.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#8f0012] text-white font-bold rounded-2xl shadow-lg shadow-[#8f0012]/20 active:scale-95 transition-transform text-sm"
            >
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {items.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountWishlist;
