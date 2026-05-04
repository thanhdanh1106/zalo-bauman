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

  const handleRetryPayment = () => {
    // Navigate back to payment page or cart
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Failed Hero Section */}
      <section className="bg-gradient-to-br from-[#181a1b] via-[#2a2d2e] to-[#181a1b] py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            {/* Failed Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-500/30 p-6 md:p-8 rounded-full border border-red-400/30">
                <FaTimes className="text-4xl md:text-5xl text-red-400" />
              </div>
            </div>

            {/* Failed Message */}
            <h1 className="text-3xl md:text-5xl font-bold text-primary font-serif mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-lg md:text-xl text-red-400 mb-2">
              Giao dịch không thể hoàn tất
            </p>
            <p className="text-base text-primary/80 mb-8">
              Rất tiếc, có lỗi xảy ra trong quá trình xử lý thanh toán của bạn.
            </p>

            {/* Error Details */}
            <div className="bg-[#1e2021] border border-red-400/20 rounded-xl p-6 mb-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-primary font-serif">
                  <FaExclamationTriangle className="text-red-400" />
                  <span className="text-lg font-medium">
                    Giao dịch không thành công
                  </span>
                </div>
                {(orderId || errorCode || errorMessage) && (
                  <div className="space-y-2 text-left bg-red-500/10 border border-red-400/20 rounded-lg p-4">
                    {orderId && (
                      <p className="text-primary text-sm">
                        <span className="font-medium">Mã đơn hàng:</span>{" "}
                        {orderId}
                      </p>
                    )}
                    {errorCode && (
                      <p className="text-red-400 text-sm">
                        <span className="font-medium">Mã lỗi:</span> {errorCode}
                      </p>
                    )}
                    {errorMessage && (
                      <p className="text-red-400 text-sm">
                        <span className="font-medium">Lý do:</span>{" "}
                        {errorMessage}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-primary/80 text-sm">
                  Đừng lo lắng, không có khoản phí nào được tính từ tài khoản
                  của bạn.
                </p>
              </div>
            </div>

            {/* Common Causes */}
            <div className="bg-surface border border-[#eee]/50 border border-[#cbb27c]/10 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-primary font-serif mb-4">
                Nguyên nhân có thể
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    !
                  </div>
                  <div>
                    <p className="text-primary font-serif font-medium">
                      Thông tin thẻ không chính xác
                    </p>
                    <p className="text-primary/70 text-sm">
                      Kiểm tra lại số thẻ, ngày hết hạn và mã CVV
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    !
                  </div>
                  <div>
                    <p className="text-primary font-serif font-medium">Số dư không đủ</p>
                    <p className="text-primary/70 text-sm">
                      Tài khoản hoặc thẻ của bạn không có đủ số dư
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    !
                  </div>
                  <div>
                    <p className="text-primary font-serif font-medium">
                      Thẻ bị khóa hoặc hạn chế
                    </p>
                    <p className="text-primary/70 text-sm">
                      Liên hệ ngân hàng để kiểm tra tình trạng thẻ
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    !
                  </div>
                  <div>
                    <p className="text-primary font-serif font-medium">
                      Lỗi kết nối mạng
                    </p>
                    <p className="text-primary/70 text-sm">
                      Kiểm tra kết nối internet và thử lại
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetryPayment}
                className="flex items-center justify-center px-6 py-3 bg-primary text-[#181a1b] rounded-lg hover:bg-[#d4b995] transition-colors font-semibold"
              >
                <FaRedo className="mr-2" />
                Thử lại thanh toán
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center justify-center px-6 py-3 border border-[#cbb27c]/30 text-primary font-serif rounded-lg hover:bg-surface border border-[#eee]/50 transition-colors font-medium"
              >
                <FaShoppingBag className="mr-2" />
                Quay lại giỏ hàng
              </button>
              <Link
                to="/"
                className="flex items-center justify-center px-6 py-3 border border-[#cbb27c]/30 text-primary font-serif rounded-lg hover:bg-surface border border-[#eee]/50 transition-colors font-medium"
              >
                <FaHome className="mr-2" />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Payment Methods */}
      <section className="py-12 bg-[#1e2021]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary font-serif mb-4">
              Thử phương thức thanh toán khác
            </h3>
            <p className="text-primary/80 mb-6">
              Bạn có thể sử dụng các phương thức thanh toán khác để hoàn tất đơn
              hàng.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface border border-[#eee] border border-[#cbb27c]/20 rounded-lg p-4">
                <FaCreditCard className="text-primary text-2xl mx-auto mb-2" />
                <h4 className="text-primary font-serif font-medium mb-1">
                  Thẻ tín dụng/ghi nợ
                </h4>
                <p className="text-primary/70 text-sm">
                  Visa, Mastercard, JCB
                </p>
              </div>
              <div className="bg-surface border border-[#eee] border border-[#cbb27c]/20 rounded-lg p-4">
                <div className="text-primary text-2xl mx-auto mb-2">💳</div>
                <h4 className="text-primary font-serif font-medium mb-1">Ví điện tử</h4>
                <p className="text-primary/70 text-sm">
                  ZaloPay, MoMo, VNPay
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary font-serif mb-4">
              Cần hỗ trợ thanh toán?
            </h3>
            <p className="text-primary/80 mb-6">
              Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp bạn giải quyết vấn đề
              thanh toán.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${import.meta.env.VITE_COMPANY_PHONE || "0931207702"
                  }`}
                className="flex items-center justify-center px-6 py-3 bg-surface border border-[#eee] border border-[#cbb27c]/30 text-primary font-serif rounded-lg hover:bg-[#3a3d3e] transition-colors"
              >
                <FaPhone className="mr-2" />
                {import.meta.env.VITE_COMPANY_PHONE || "0931207702"}
              </a>
              <a
                href={`mailto:${import.meta.env.VITE_COMPANY_EMAIL || "contact@appbase.vn"
                  }`}
                className="flex items-center justify-center px-6 py-3 bg-surface border border-[#eee] border border-[#cbb27c]/30 text-primary font-serif rounded-lg hover:bg-[#3a3d3e] transition-colors"
              >
                <FaEnvelope className="mr-2" />
                {import.meta.env.VITE_COMPANY_EMAIL || "contact@appbase.vn"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentFailed;


