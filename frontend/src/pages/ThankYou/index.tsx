import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaHome,
  FaShoppingBag,
  FaTruck,
  FaTrophy,
  FaUniversity,
  FaQrcode,
  FaCopy,
  FaDownload,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { formatCurrency } from "@shared/utils/Hooks";
import { createZaloOrder, transformCartToZaloOrder, ZALO_PAYMENT_METHODS } from "@shared/services/zaloPayment";
import { useToasterContext } from "@shared/components/ToasterContext";
import { apiClient } from "@shared/services/authService";

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage } = useToasterContext();
  const orderData = location.state?.orderData;
  const pointsEarned = Number(location.state?.pointsEarned ?? location.state?.points_earned ?? orderData?.points_earned ?? 0);

  const totalAmount = Number(orderData?.total_amount || 0);
  const orderNumber = orderData?.number || orderData?.order_number || "---";
  const paymentMethod = orderData?.payment_method || "cod";
  const orderItems = orderData?.order_items || [];

  const [paymentConfig, setPaymentConfig] = useState<any>({
    bank_name: "Vietcombank",
    bank_account_number: "1029384756",
    bank_account_name: "CÔNG TY TNHH NHÂN SÂM BAUMANN",
    zalopay_app_id: "2553",
    vietqr_enabled: false,
    vietqr_bank_bin: "",
    vietqr_template: "compact2",
    bank_transfer_description: "Thanh toan DH {order_number}",
  });
  const [isCallingZaloPay, setIsCallingZaloPay] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showMessage("success", `Đã sao chép ${label}!`);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        showMessage("success", `Đã sao chép ${label}!`);
      } catch (err) {
        showMessage("error", "Không thể sao chép");
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    apiClient.get('/settings/payment')
      .then(res => {
        if (res.data && !res.data.error && res.data.data) {
          setPaymentConfig((prev: any) => ({
            ...prev,
            ...res.data.data,
            vietqr_enabled: res.data.data.vietqr_enabled !== undefined ? Boolean(res.data.data.vietqr_enabled) : prev.vietqr_enabled,
          }));
        }
      })
      .catch(e => console.error(e));
  }, []);

  const handleTriggerZaloPay = async () => {
    try {
      setIsCallingZaloPay(true);
      const zaloOrderData = transformCartToZaloOrder(
        orderItems,
        totalAmount,
        `Thanh toán đơn hàng #${orderNumber}`,
        {
          order_number: orderNumber,
          paymentMethod: "zalopay",
        }
      );

      await createZaloOrder({
        ...zaloOrderData,
        method: {
          id: ZALO_PAYMENT_METHODS.BANK,
          isCustom: false,
        },
      });
    } catch (error) {
      console.error("Zalo payment failed:", error);
      showMessage("error", "Không thể gọi cổng ZaloPay lúc này, vui lòng thử lại.");
    } finally {
      setIsCallingZaloPay(false);
    }
  };

  const earnedPoints = Number.isFinite(pointsEarned) ? pointsEarned : 0;

  const getTransferDescription = () => {
    const template = paymentConfig.bank_transfer_description || "Thanh toan DH {order_number}";
    return template.replace("{order_number}", orderNumber);
  };

  const getVietQrUrl = () => {
    if (!paymentConfig.vietqr_enabled) return "";
    if (!paymentConfig.vietqr_bank_bin || !paymentConfig.bank_account_number) return "";

    const amount = Math.round(totalAmount);
    const addInfo = getTransferDescription();
    const params = new URLSearchParams({
      amount: amount.toString(),
      addInfo,
      accountName: paymentConfig.bank_account_name || "",
    });

    return `https://img.vietqr.io/image/${paymentConfig.vietqr_bank_bin}-${paymentConfig.bank_account_number}-${paymentConfig.vietqr_template || "compact2"}.png?${params.toString()}`;
  };

  const handleDownloadQr = async () => {
    const url = getVietQrUrl();
    if (!url) return;
    try {
      showMessage("info", "Đang chuẩn bị tải mã QR...");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `VietQR-${orderNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showMessage("success", "Đã tải mã QR về máy thành công!");
    } catch (error) {
      window.open(url, "_blank");
      showMessage("success", "Đã mở mã QR trong tab mới. Hãy nhấn giữ hoặc click chuột phải để tải về.");
    }
  };

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
    <div className="min-h-screen bg-[#fcf5f5] flex flex-col items-center py-10 px-6 pb-24">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
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
              <span className="text-sm text-gray-500">Phương thức</span>
              <span className="text-sm font-bold text-[#8f0012]">
                {paymentMethod === "banking" ? "Chuyển khoản" : paymentMethod === "zalopay" ? "Ví ZaloPay" : "Ship COD"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Dự kiến giao</span>
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

      {/* Dynamic Gateway/Banking Instruction Area */}
      {paymentMethod === "banking" && (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-[#8f0012]/10 mb-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-1">
            <div className="flex items-center text-[#8f0012] font-bold text-sm gap-2">

              <span>Thông tin Chuyển khoản Ngân hàng</span>
            </div>

          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Vui lòng thực hiện chuyển khoản số tiền <strong className="text-[#8f0012]">{formatCurrency(totalAmount)}</strong> theo thông tin liên kết dưới đây để đơn hàng được xác nhận nhanh nhất:
          </p>

          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => copyToClipboard(paymentConfig.bank_name, "Tên ngân hàng")}
              className="flex justify-between items-center py-2 px-3 rounded-xl bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-gray-400 font-medium">Ngân hàng</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-gray-900 font-semibold">{paymentConfig.bank_name}</strong>
                <FaCopy className="text-gray-300 text-[10px]" />
              </div>
            </div>

            <div
              onClick={() => copyToClipboard(paymentConfig.bank_account_number, "Số tài khoản")}
              className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#fcf5f5] border border-[#8f0012]/5 hover:bg-[#faeded] active:bg-[#f5d5d7] transition-colors cursor-pointer"
            >
              <span className="text-gray-400 font-medium">Số tài khoản</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-[#8f0012] font-mono font-bold text-sm select-all">{paymentConfig.bank_account_number}</strong>
                <FaCopy className="text-[#8f0012]/40 text-[10px]" />
              </div>
            </div>

            <div
              onClick={() => copyToClipboard(paymentConfig.bank_account_name, "Chủ tài khoản")}
              className="flex justify-between items-center py-2 px-3 rounded-xl bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-gray-400 font-medium">Chủ tài khoản</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-gray-900 font-semibold uppercase">{paymentConfig.bank_account_name}</strong>
                <FaCopy className="text-gray-300 text-[10px]" />
              </div>
            </div>

            <div
              onClick={() => copyToClipboard(getTransferDescription(), "Nội dung chuyển khoản")}
              className="flex justify-between items-center py-2 px-3 rounded-xl bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-gray-400 font-medium">Nội dung CK</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-gray-900 font-mono font-bold select-all">{getTransferDescription()}</strong>
                <FaCopy className="text-gray-400 text-[10px]" />
              </div>
            </div>

            <div
              onClick={() => copyToClipboard(Math.round(totalAmount).toString(), "Số tiền")}
              className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#fcf5f5] border border-[#8f0012]/5 hover:bg-[#faeded] active:bg-[#f5d5d7] transition-colors cursor-pointer"
            >
              <span className="text-gray-400 font-medium">Số tiền</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-[#8f0012] font-bold text-sm">{formatCurrency(totalAmount)}</strong>
                <FaCopy className="text-[#8f0012]/40 text-[10px]" />
              </div>
            </div>
          </div>

          {paymentConfig.vietqr_enabled && getVietQrUrl() && (
            <div className="pt-3 border-t border-gray-100 flex flex-col items-center">
              <div className="text-[11px] font-semibold text-[#8f0012] text-center mb-2.5 uppercase tracking-wider">
                Quét mã VietQR để thanh toán
              </div>
              <div className="bg-white border border-[#8f0012]/10 flex flex-col items-center justify-center">
                <img
                  src={getVietQrUrl()}
                  alt="VietQR"
                  className="w-60 h-60 md:w-64 md:h-64 object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />

              </div>
              <button
                onClick={handleDownloadQr}
                className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-[#8f0012]/5 hover:bg-[#8f0012]/10 active:scale-95 text-[#8f0012] text-xs font-bold rounded-xl transition-all shadow-sm border border-[#8f0012]/10"
              >
                <FaDownload className="text-xs" />
                <span>Tải mã QR</span>
              </button>
              <div className="text-[10px] text-gray-400 mt-2 text-center leading-relaxed px-2">
                Mở app ngân hàng bất kỳ để quét mã VietQR tự động nhập số tiền và nội dung chuyển khoản.
              </div>
            </div>
          )}
        </div>
      )}

      {paymentMethod === "zalopay" && (
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-green-100 mb-6 space-y-4 animate-fade-in text-center">
          <div className="flex items-center justify-center text-green-700 font-bold text-sm">
            <FaQrcode className="mr-2 text-lg" />
            Cổng thanh toán tự động ZaloPay
          </div>
          <p className="text-xs text-gray-500 px-2">
            Đơn hàng đã được ghi nhận. Vui lòng nhấn nút dưới đây để khởi chạy cổng thanh toán an toàn ZaloPay App.
          </p>
          <button
            onClick={handleTriggerZaloPay}
            disabled={isCallingZaloPay}
            className="w-full bg-[#0088ff] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isCallingZaloPay ? "Đang kết nối..." : "Thanh toán ngay qua ZaloPay"}
          </button>
        </div>
      )}

      {/* Points Reward Card */}
      <div className="w-full max-w-md bg-gradient-to-r from-[#fbd77a] to-[#ffe59e] rounded-xl p-6 flex items-center shadow-lg shadow-[#fbd77a]/20 mb-10">
        <div className="w-12 h-12 bg-[#cbb27c]/20 rounded-full flex items-center justify-center mr-4 shrink-0 border border-[#cbb27c]/30">
          <FaTrophy className="text-xl text-[#856404]" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#856404]">
            Tích lũy {earnedPoints} điểm thưởng
          </h4>
        </div>
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
