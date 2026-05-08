import React from "react";
import {
  FaCheck,
  FaHome,
  FaShoppingBag,
  FaTruck,
  FaTrophy,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { formatCurrency } from "@shared/utils/Hooks";

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  const totalAmount = Number(orderData?.total_amount || 0);
  const orderNumber = orderData?.number || orderData?.order_number || "---";
  
  // Calculate points (assuming 1 point per 10,000 VND)
  const earnedPoints = Math.floor(totalAmount / 10000);

  // Estimate delivery date (order date + 2-4 days)
  const orderDate = orderData?.order_date ? new Date(orderData.order_date) : new Date();
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(orderDate.getDate() + 2);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(orderDate.getDate() + 4);

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = `${start.getDate()}`;
    const endStr = `${end.getDate()} Th${end.getMonth() + 1}, ${end.getFullYear()}`;
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="min-h-screen bg-[#fcf5f5] flex flex-col items-center py-10 px-6">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-[#fce4e6] rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <FaCheck className="text-3xl text-[#8f0012]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#8f0012] mb-2 text-center">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-500 text-sm text-center max-w-[280px]">
          Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden mb-6 border-t-[3px] border-[#8f0012]">
        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Thông tin đơn hàng</h2>
          
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Mã đơn hàng</span>
              <span className="px-3 py-1 bg-[#f0f2f5] text-gray-700 text-xs font-bold rounded-lg tracking-wider uppercase">
                #{orderNumber}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Dự kiến</span>
              <div className="flex items-center text-sm font-bold text-gray-800">
                <FaTruck className="mr-2 text-[#8f0012]/60" />
                {formatDateRange(deliveryStart, deliveryEnd)}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full my-6"></div>

            <div className="flex justify-between items-end">
              <span className="text-sm text-gray-500 pb-1">Tổng thanh toán</span>
              <span className="text-xl font-bold text-[#8f0012]">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Points Reward Card */}
      <div className="w-full max-w-md bg-gradient-to-r from-[#fbd77a] to-[#ffe59e] rounded-2xl p-6 flex items-center shadow-lg shadow-[#fbd77a]/20 mb-10">
        <div className="w-12 h-12 bg-[#cbb27c]/20 rounded-full flex items-center justify-center mr-4 shrink-0 border border-[#cbb27c]/30">
          <FaTrophy className="text-xl text-[#856404]" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#856404]">
            Tích lũy {earnedPoints} điểm 
          </h4>
        </div>
        <button className="bg-[#6b520b] text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-black transition-colors ml-2">
          Tham gia
        </button>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-4">
        <button
          onClick={() => navigate(`/order-success/${orderNumber}`)}
          className="w-full bg-[#8f0012] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-[#8f0012]/20 active:scale-[0.98] transition-all"
        >
          Xem chi tiết đơn hàng
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-transparent text-[#8f0012] py-4 rounded-xl font-bold text-sm border border-[#8f0012] active:scale-[0.98] transition-all"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};

export default ThankYou;


