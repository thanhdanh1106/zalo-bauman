import React, { useEffect } from "react";
import {
  FaClock,
  FaHome,
  FaPhone,
  FaShoppingBag,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");

  // Auto redirect after 30 seconds to check status
  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderNumber) {
        navigate(`/order-success/${orderNumber}`);
      } else {
        navigate("/account/orders");
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate, orderNumber]);

  return (
    <div className="min-h-screen bg-background">
      {/* Pending Hero Section */}
      <section className="bg-gradient-to-br from-[#181a1b] via-[#2a2d2e] to-[#181a1b] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            {/* Pending Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500/30 p-4 rounded-full border border-yellow-400/30">
                <FaClock className="text-2xl text-yellow-400" />
              </div>
            </div>

            {/* Pending Message */}
            <h1 className="text-lg font-bold text-primary font-serif mb-3">
              Đang xử lý thanh toán
            </h1>
            <p className="text-sm text-yellow-400 mb-2">
              Giao dịch đang được xử lý
            </p>

            {/* Processing Animation */}
            <div className="bg-[#1e2021] border border-[#cbb27c]/20 rounded-lg p-4 mb-6">
              <div className="text-center space-y-3">
                <FaSpinner className="text-2xl text-primary mx-auto animate-spin" />
                <div className="text-sm font-medium text-primary font-serif">
                  Đang xử lý thanh toán...
                </div>
                {orderNumber && (
                  <div className="text-xs text-primary/70">
                    Đơn hàng: #{orderNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#1e2021] border border-[#cbb27c]/20 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <h3 className="text-sm font-medium text-primary font-serif mb-2">
                  Lưu ý quan trọng:
                </h3>
                <ul className="text-xs text-primary/80 space-y-1">
                  <li>• Thời gian xử lý có thể mất 1-3 phút</li>
                  <li>• Bạn sẽ nhận được thông báo khi hoàn tất</li>
                  <li>
                    • Bạn có thể kiểm tra trạng thái đơn hàng trong phần "Đơn
                    hàng của tôi"
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to={
                  orderNumber
                    ? `/order-success/${orderNumber}`
                    : "/account/orders"
                }
                className="block w-full px-4 py-2 bg-primary text-[#181a1b] text-sm font-medium rounded-lg hover:bg-[#d4b995] transition-colors"
              >
                <FaShoppingBag className="inline mr-2" />
                Kiểm tra trạng thái đơn hàng
              </Link>

              <Link
                to="/"
                className="block w-full px-4 py-2 bg-[#3a3d3e] text-primary font-serif text-sm font-medium rounded-lg hover:bg-[#4a4d4e] transition-colors"
              >
                <FaHome className="inline mr-2" />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-6 border-t border-[#eee]">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-medium text-primary font-serif mb-3 text-center">
              Cần hỗ trợ?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-[#1e2021] border border-[#cbb27c]/20 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-primary text-sm" />
                  <div>
                    <div className="text-xs font-medium text-primary font-serif">
                      Hotline
                    </div>
                    <div className="text-xs text-primary/80">
                      {import.meta.env.VITE_COMPANY_PHONE || "1900-xxxx"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentPending;


