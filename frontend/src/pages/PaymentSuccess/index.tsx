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
    <div className="min-h-screen bg-background">
      {/* Success Hero Section */}
      <section className="bg-gradient-to-br from-[#181a1b] via-[#2a2d2e] to-[#181a1b] py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/30 p-6 md:p-8 rounded-full border border-green-400/30">
                <FaCheck className="text-4xl md:text-5xl text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-5xl font-bold text-primary font-serif mb-4">
              Thanh toán thành công!
            </h1>
            <p className="text-lg md:text-xl text-primary mb-2">
              Giao dịch đã được xử lý thành công
            </p>
            <p className="text-base text-primary/80 mb-8">
              Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng của chúng tôi.
            </p>

            {/* Transaction Details */}
            <div className="bg-[#1e2021] border border-[#cbb27c]/20 rounded-xl p-6 mb-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-primary font-serif">
                  <FaCreditCard className="text-primary" />
                  <span className="text-lg font-medium">
                    Thanh toán đã được xác nhận
                  </span>
                </div>
                {(orderId || transactionId) && (
                  <div className="space-y-2">
                    {orderId && (
                      <p className="text-primary text-sm">
                        <span className="font-medium">Mã đơn hàng:</span>{" "}
                        {orderId}
                      </p>
                    )}
                    {transactionId && (
                      <p className="text-primary text-sm">
                        <span className="font-medium">Mã giao dịch:</span>{" "}
                        {transactionId}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-primary/80 text-sm">
                  Chúng tôi sẽ gửi email xác nhận và thông tin theo dõi đơn hàng
                  đến bạn trong vài phút tới.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-surface border border-[#eee]/50 border border-[#cbb27c]/10 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-primary font-serif mb-4">
                Bước tiếp theo
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="text-primary font-serif font-medium">
                      Thanh toán hoàn tất
                    </p>
                    <p className="text-primary/70 text-sm">
                      Giao dịch đã được xử lý thành công
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-[#181a1b] rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-primary font-serif font-medium">
                      Xác nhận đơn hàng
                    </p>
                    <p className="text-primary/70 text-sm">
                      Chúng tôi sẽ xác nhận đơn hàng và gửi email thông báo
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-[#181a1b] rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-primary font-serif font-medium">
                      Chuẩn bị & giao hàng
                    </p>
                    <p className="text-primary/70 text-sm">
                      Sản phẩm sẽ được chuẩn bị và giao đến bạn trong 1-3 ngày
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/account/orders")}
                className="flex items-center justify-center px-6 py-3 bg-primary text-[#181a1b] rounded-lg hover:bg-[#d4b995] transition-colors font-semibold"
              >
                <FaShoppingBag className="mr-2" />
                Xem đơn hàng
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

      {/* Contact Support Section */}
      <section className="py-12 bg-[#1e2021]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary font-serif mb-4">
              Cần hỗ trợ?
            </h3>
            <p className="text-primary/80 mb-6">
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng hoặc giao dịch, đừng
              ngần ngại liên hệ với chúng tôi.
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

      {/* Promotional Section - Continue Shopping */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary font-serif mb-4">
              Khám phá thêm sản phẩm
            </h3>
            <p className="text-primary/80 mb-6">
              Tìm hiểu thêm những sản phẩm tuyệt vời khác từ{" "}
              {import.meta.env.VITE_COMPANY_NAME || "ALPHA X"}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#cbb27c] to-[#d4b995] text-[#181a1b] rounded-lg hover:from-[#d4b995] hover:to-[#e5c9a6] transition-all duration-300 font-semibold"
            >
              <FaShoppingBag className="mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentSuccess;


