import React from "react";
import {
  FaCreditCard,
  FaEnvelope,
  FaExclamationTriangle,
  FaHome,
  FaPhone,
  FaRedo,
  FaShoppingBag,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const errorCode = searchParams.get("errorCode");
  const errorMessage = searchParams.get("errorMessage");

  return (
    <div className="min-h-screen bg-[#f6f3f2] pb-20 antialiased font-sans">
      {/* Top Banner Accent */}
      <div className="h-3 bg-gradient-to-r from-red-600 to-red-700" />

      <div className="max-w-[768px] mx-auto px-4 pt-8">
        {/* Main Failure Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-white text-center mb-6 animate-fade-in">
          {/* Failed Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-500 rounded-full mb-6 shadow-inner">
            <FaTimes className="text-3xl" />
          </div>

          <h1 className="font-serif font-bold text-2xl text-gray-800 mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng kiểm tra lại thông tin hoặc thử một phương thức thanh toán khác.
          </p>

          {/* Error Details Box */}
          {(orderId || errorCode || errorMessage) && (
            <div className="bg-red-50/50 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 mb-8 border border-red-100">
              <div className="flex items-center gap-2 text-xs font-bold text-red-700 mb-1 uppercase tracking-wider">
                <FaExclamationTriangle />
                <span>Chi tiết lỗi</span>
              </div>
              {orderId && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <span className="font-bold text-gray-800">{orderId}</span>
                </div>
              )}
              {errorCode && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Mã lỗi:</span>
                  <span className="font-bold text-red-600">{errorCode}</span>
                </div>
              )}
              {errorMessage && (
                <div className="flex flex-col text-xs pt-1 border-t border-red-100/50">
                  <span className="text-gray-500 mb-0.5">Lý do:</span>
                  <span className="font-semibold text-red-700 leading-tight">{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 h-12 bg-[#8f0012] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8f0012]/10 hover:opacity-95 active:scale-95 transition-all"
            >
              <FaRedo />
              Thử lại thanh toán
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

        {/* Alternative Methods Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-white mb-6">
          <h3 className="font-serif font-bold text-sm text-gray-800 mb-3 uppercase tracking-wider text-center">
            Gợi ý phương thức khác
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-[#f6f3f2] rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#8f0012] shrink-0 shadow-sm">
                <FaCreditCard className="text-lg" />
              </div>
              <div className="text-left min-w-0">
                <span className="font-bold text-xs text-gray-800 block truncate">Ship COD</span>
                <span className="text-[10px] text-gray-400 block">Thanh toán tiền mặt khi nhận</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#f6f3f2] rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#8f0012] shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-lg">account_balance</span>
              </div>
              <div className="text-left min-w-0">
                <span className="font-bold text-xs text-gray-800 block truncate">Chuyển khoản</span>
                <span className="text-[10px] text-gray-400 block">Chuyển khoản ngân hàng trực tiếp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-white text-center">
          <h3 className="font-serif font-bold text-base text-gray-800 mb-1">
            Bạn cần hỗ trợ?
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải quyết sự cố giúp bạn
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

export default PaymentFailed;
