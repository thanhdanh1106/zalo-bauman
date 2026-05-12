import React from "react";
import {
  FaCheck,
  FaCreditCard,
  FaEnvelope,
  FaHome,
  FaPhone,
  FaShoppingBag,
} from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen bg-[#f6f3f2] pb-20 antialiased font-sans">
      {/* Top Banner Accent */}
      <div className="h-3 bg-gradient-to-r from-[#8f0012] to-[#b32025]" />

      <div className="max-w-[768px] mx-auto px-4 pt-8">
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-white text-center mb-6 animate-fade-in">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full mb-6 shadow-inner">
            <FaCheck className="text-3xl" />
          </div>

          <h1 className="font-serif font-bold text-2xl text-gray-800 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Cảm ơn bạn đã tin tưởng và mua sắm. Đơn hàng của bạn đã được thanh toán và đang trong quá trình chuẩn bị.
          </p>

          {/* Transaction Info Box */}
          {(orderId || transactionId) && (
            <div className="bg-[#f6f3f2] rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 mb-8 border border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8f0012] mb-1 uppercase tracking-wider">
                <FaCreditCard />
                <span>Thông tin giao dịch</span>
              </div>
              {orderId && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <span className="font-bold text-gray-800">{orderId}</span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Mã giao dịch:</span>
                  <span className="font-bold text-gray-800">{transactionId}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              onClick={() => navigate("/account/orders")}
              className="flex-1 h-12 bg-[#8f0012] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8f0012]/10 hover:opacity-95 active:scale-95 transition-all"
            >
              <FaShoppingBag />
              Xem đơn hàng
            </button>
            <Link
              to="/"
              className="flex-1 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <FaHome />
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-white text-center">
          <h3 className="font-serif font-bold text-base text-gray-800 mb-1">
            Bạn cần hỗ trợ?
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Vui lòng liên hệ với bộ phận chăm sóc khách hàng nếu có thắc mắc
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${import.meta.env.VITE_COMPANY_PHONE || "0931207702"}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f6f3f2] text-gray-700 rounded-xl text-xs font-bold transition-colors hover:bg-gray-200"
            >
              <FaPhone className="text-[#8f0012] text-[10px]" />
              {import.meta.env.VITE_COMPANY_PHONE || "0931207702"}
            </a>
            <a
              href={`mailto:${import.meta.env.VITE_COMPANY_EMAIL || "contact@appbase.vn"}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f6f3f2] text-gray-700 rounded-xl text-xs font-bold transition-colors hover:bg-gray-200"
            >
              <FaEnvelope className="text-[#8f0012] text-[10px]" />
              {import.meta.env.VITE_COMPANY_EMAIL || "contact@appbase.vn"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
