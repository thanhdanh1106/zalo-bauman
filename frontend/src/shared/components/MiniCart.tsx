import { useCart } from "@shared/hooks/useCart";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";
import React, { useState } from "react";
import {
  FaArrowRight,
  FaCartPlus,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const MiniCart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    total,
    removeFromCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    getTotalItems,
  } = useCart();

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleIncreaseQuantity = (id: number) => {
    increaseItemQuantity(id);
  };

  const handleDecreaseQuantity = (id: number) => {
    decreaseItemQuantity(id);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  return (
    <div className="">
      {/* Cart Button */}
      <button
        onClick={toggleCart}
        className="relative p-2 text-primary font-serif hover:text-primary transition-colors duration-200"
      >
        <FaShoppingCart className="text-xl" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-[#181a1b] text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {getTotalItems()}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={closeCart}
        />
      )}

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-0 w-full bg-background shadow-xl border border-[#eee] z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#eee]">
            <h3 className="text-sm uppercase text-primary font-serif flex items-center">
              <FaCartPlus className="mr-2 text-primary" />
              Giỏ hàng ({items.length})
            </h3>
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-primary font-serif transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-60 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <FaShoppingCart className="text-4xl text-gray-500 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">
                  Giỏ hàng của bạn đang trống
                </p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="inline-flex items-center px-4 py-2 bg-primary text-[#181a1b] rounded-md hover:bg-[#d4b995] transition-colors font-medium"
                >
                  Mua bia ngay
                </Link>
              </div>
            ) : (
              <div className="p-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 hover:bg-surface border border-[#eee] rounded-lg transition-colors"
                  >
                    {/* Product Image */}
                    <img
                      src={
                        getThumbnailUrl(item.thumbnail) ||
                        "/assets/default-product.png"
                      }
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-primary font-serif truncate">
                        {item.title}
                      </h4>
                      <div className="text-[10px] text-gray-500">
                        SKU: {item.sku} • {item.brand?.name || "N/A"}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-semibold text-primary">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="p-1 text-gray-500 hover:text-primary transition-colors"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center text-primary font-serif">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="p-1 text-gray-500 hover:text-primary transition-colors"
                        disabled={item.quantity >= (item.stock || 0)}
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[#eee] p-4 bg-background">
              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium text-primary font-serif">
                  Tổng cộng:
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-[#cbb27c] text-primary rounded-md hover:bg-surface border border-[#eee] transition-colors font-medium"
                >
                  Giỏ hàng
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-[#181a1b] rounded-md hover:bg-[#b8a06a] transition-colors font-semibold"
                >
                  Thanh toán
                  <FaArrowRight className="ml-2 text-sm" />
                </Link>
              </div>

              {/* Free Shipping Notice */}
              <div className="mt-3 p-2 bg-surface border border-[#eee] rounded-md">
                <p className="text-xs text-gray-500 text-center">
                  🚚 Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCart;


