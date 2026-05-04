import React, { useState } from 'react';
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaTimes,
  FaArrowRight
} from 'react-icons/fa';
import { useCart } from '@shared/hooks/useCart';

interface MiniCartProps {
  className?: string;
}

const MiniCart: React.FC<MiniCartProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    getTotalItems,
    getTotalPrice,
    getCartSummary,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart
  } = useCart();

  const totalItems = getTotalItems();
  const { totalPrice, totalDiscount } = getCartSummary();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...');
    // Here you would navigate to checkout page
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Cart Icon with Badge */}
      <button
        onClick={toggleCart}
        className="relative p-2 text-primary font-serif hover:text-primary transition-colors"
      >
        <FaShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-[#181a1b] text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-background border border-[#eee] rounded-xl shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#eee]">
            <h3 className="text-lg font-semibold text-primary font-serif">
              Giỏ hàng ({totalItems} sản phẩm)
            </h3>
            <button
              onClick={toggleCart}
              className="text-gray-500 hover:text-primary font-serif transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <FaShoppingCart size={48} className="text-[#4a4d4e] mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Giỏ hàng trống</p>
                <p className="text-sm text-[#6b7280]">
                  Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-surface border border-[#eee] rounded-lg">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-primary font-serif truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {item.category} • {item.volume}ml
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-primary">
                          {item.price.toLocaleString('vi-VN')}₫
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-[#6b7280] line-through">
                            {item.originalPrice.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center bg-[#3a3d3e] rounded-lg overflow-hidden">
                        <button
                          onClick={() => decreaseItemQuantity(item.id)}
                          className="px-2 py-1 hover:bg-[#4a4d4e] transition-colors text-primary"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="px-3 py-1 text-primary font-serif font-medium text-sm min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseItemQuantity(item.id)}
                          className="px-2 py-1 hover:bg-[#4a4d4e] transition-colors text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[#eee] p-4">
              {/* Summary */}
              <div className="space-y-2 mb-4">
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tiết kiệm:</span>
                    <span className="text-green-400 font-medium">
                      -{totalDiscount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-primary font-serif">Tổng cộng:</span>
                  <span className="text-primary">
                    {totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-[#d4b995] text-[#181a1b] py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Thanh toán
                  <FaArrowRight size={14} />
                </button>
                <button
                  onClick={toggleCart}
                  className="w-full border border-[#eee] text-primary font-serif hover:bg-surface border border-[#eee] py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleCart}
        />
      )}
    </div>
  );
};

export default MiniCart;

