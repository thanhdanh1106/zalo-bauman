import PageLoading from "@shared/components/PageLoading";
import { useToasterContext } from "@shared/components/ToasterContext";
import {
  createZaloOrder,
  transformCartToZaloOrder,
  ZALO_PAYMENT_METHODS,
} from "@shared/services/zaloPayment";
import { orderProps } from "@shared/types/order";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";
import { cancelOrder, findOneOrderByCode } from "@shared/utils/Orders";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaCheck,
  FaMapMarkerAlt,
  FaTruck,
  FaUniversity,
  FaRegMoneyBillAlt,
  FaHome,
  FaTimesCircle,
  FaCopy,
  FaDownload,
} from "react-icons/fa";
import { useNavigate, useParams } from "zmp-ui";
import { CheckoutSDK, EventName, events } from "zmp-sdk/apis";
import { apiClient } from "@shared/services/authService";

const OrderSuccess: React.FC = () => {
  const { order_code } = useParams();
  const navigate = useNavigate();
  const { showMessage } = useToasterContext();
  const [orderData, setOrderData] = useState<orderProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingZaloPayment, setLoadingZaloPayment] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("cod");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [paymentConfig, setPaymentConfig] = useState<any>({
    bank_name: "Vietcombank",
    bank_account_number: "1029384756",
    bank_account_name: "CÔNG TY TNHH NHÂN SÂM BAUMANN",
    vietqr_enabled: false,
    vietqr_bank_bin: "",
    vietqr_template: "compact2",
    bank_transfer_description: "Thanh toan DH {order_number}",
  });

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

  const handleZaloPayment = async () => {
    try {
      if (!orderData) return;
      setLoadingZaloPayment(true);

      const amount = Number(orderData.total_amount);
      const finalAmount = selectedMethod === "vnpay_qr" ? amount * 0.9 : amount;

      const zaloOrderData = transformCartToZaloOrder(
        orderData.order_items,
        finalAmount,
        `Thanh toán đơn hàng #${orderData.order_number}`,
        {
          order_number: orderData.order_number,
          paymentMethod: selectedMethod,
        }
      );

      let paymentMethodId: string = ZALO_PAYMENT_METHODS.BANK;
      if (selectedMethod === "vnpay_qr") paymentMethodId = ZALO_PAYMENT_METHODS.VNPAY;
      else if (selectedMethod === "cod") paymentMethodId = ZALO_PAYMENT_METHODS.COD;

      await createZaloOrder({
        ...zaloOrderData,
        method: {
          id: paymentMethodId,
          isCustom: false,
        },
      });
    } catch (error) {
      console.error("Zalo payment failed:", error);
      showMessage("error", "Thanh toán thất bại, vui lòng thử lại.");
    } finally {
      setLoadingZaloPayment(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderData) return;
    setShowCancelModal(false);
    try {
      setCancellingOrder(true);
      const response = await cancelOrder(orderData.id);
      if (response && !response.error) {
        showMessage("success", "Đã hủy đơn hàng thành công.");
        setOrderData(prev => prev ? { ...prev, status: "cancelled" } : null);
      } else {
        showMessage("error", response?.message || "Không thể hủy đơn hàng lúc này.");
      }
    } catch (error) {
      showMessage("error", "Có lỗi xảy ra khi hủy đơn hàng.");
    } finally {
      setCancellingOrder(false);
    }
  };

  const handlePaymentDone = useCallback(async (data) => {
    try {
      const result = await CheckoutSDK.checkTransaction({ data });
      if (result.resultCode === 1) navigate("/payment-success");
      else if (result.resultCode === 0) navigate("/payment-pending");
      else navigate("/payment-failed");
    } catch (error) {
      showMessage("error", "Lỗi xác thực giao dịch.");
    }
  }, [navigate, showMessage]);

  useEffect(() => {
    events.on(EventName.PaymentDone, handlePaymentDone);
    return () => events.off(EventName.PaymentDone, handlePaymentDone);
  }, [handlePaymentDone]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order_code) return;
      try {
        const response = await findOneOrderByCode(order_code);
        if (response.error) setError(response.message);
        else {
          setOrderData(response.data);
          setSelectedMethod(response.data.payment_method || "cod");
        }
      } catch (err) {
        setError("Lỗi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [order_code]);

  if (loading) return <PageLoading height={300} />;
  if (error || !orderData) return <div className="p-10 text-center text-gray-500 font-medium">{error || "Không tìm thấy đơn hàng"}</div>;

  const shippingAddress = typeof orderData.shipping_address === "string" ? JSON.parse(orderData.shipping_address) : orderData.shipping_address;
  const shippingAddressDisplay = [
    shippingAddress?.street,
    shippingAddress?.state,
    shippingAddress?.city,
  ].filter(Boolean).join(", ");

  const getTransferDescription = () => {
    const template = paymentConfig.bank_transfer_description || "Thanh toan DH {order_number}";
    return template.replace("{order_number}", orderData.order_number);
  };

  const getVietQrUrl = () => {
    if (!paymentConfig.vietqr_enabled) return "";
    if (!paymentConfig.vietqr_bank_bin || !paymentConfig.bank_account_number) return "";

    const amount = Math.round(Number(orderData.total_amount || 0));
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
      link.download = `VietQR-${orderData.order_number || "checkout"}.png`;
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
  const subtotal = Number(orderData.subtotal);
  const total = Number(orderData.total_amount);

  // Status rendering metadata
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "cancelled":
        return { label: "Đã hủy", bg: "bg-gray-100 text-gray-600 border-gray-200" };
      case "delivered":
        return { label: "Đã giao hàng", bg: "bg-green-100 text-green-700 border-green-200" };
      case "shipped":
        return { label: "Đang vận chuyển", bg: "bg-blue-100 text-blue-700 border-blue-200" };
      default:
        return { label: "Chờ xử lý", bg: "bg-amber-100 text-amber-700 border-amber-200" };
    }
  };

  const statusMeta = getStatusDisplay(orderData.status);

  const cannotCancelStatuses = ['shipped', 'delivering', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-40 animate-fade-in">

      {/* ===== CONFIRM CANCEL MODAL ===== */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setShowCancelModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <FaTimesCircle className="text-3xl text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Hủy đơn hàng?</h3>
              <p className="text-sm text-gray-500 mb-1">Bạn có chắc chắn muốn hủy đơn hàng</p>
              <p className="text-base font-bold text-gray-800 mb-6">#{orderData?.order_number}</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Không, giữ lại
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancellingOrder}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {cancellingOrder ? "Đang hủy..." : "Xác nhận hủy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Không dùng custom duplicate header tại đây vì IndexLayout đã bao gồm header chính */}

      <div className="p-4 space-y-4 pt-6">
        {/* Order Status Ribbon */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Thông tin đơn hàng</span>
            <span className="text-sm font-bold text-gray-800">#{orderData.order_number}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${statusMeta.bg}`}>
              {statusMeta.label}
            </span>
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${orderData.payment_status === "paid" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
              {orderData.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center text-[#8f0012] font-bold mb-3 text-sm">
            <FaMapMarkerAlt className="mr-2" />
            <span>Địa chỉ nhận hàng</span>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-gray-800 text-sm">
              {orderData.customer_name} | {orderData.customer_phone}
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              {shippingAddressDisplay || ""}
            </div>
          </div>
        </div>

        {/* Dynamic Payment Method Render */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Phương thức thanh toán</h3>
          <div className="bg-white rounded-2xl p-4 flex items-center border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-[#8f0012]/5 rounded-xl flex items-center justify-center mr-3 shrink-0">
              {selectedMethod === "banking" ? (
                <FaUniversity className="text-[#8f0012] text-lg" />
              ) : selectedMethod === "zalopay" ? (
                <span className="font-bold text-[#8f0012] text-xs">Zalo</span>
              ) : (
                <FaRegMoneyBillAlt className="text-[#8f0012] text-lg" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-gray-800 text-xs block truncate">
                {selectedMethod === "banking" ? "Chuyển khoản ngân hàng" : selectedMethod === "zalopay" ? "Ví ZaloPay" : "Thanh toán khi nhận hàng (COD)"}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                {orderData.payment_status === "paid" ? "Đã thanh toán" : "Chờ thanh toán / Thu hộ"}
              </span>
            </div>
          </div>

          {selectedMethod === "banking" && orderData.status !== "cancelled" && orderData.payment_status !== "paid" && (
            <div className="bg-[#fffdfd] p-5 rounded-2xl border border-[#8f0012]/10 space-y-4 text-gray-700 animate-fade-in shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-1">
                <div className="font-bold text-[#8f0012] text-sm flex items-center gap-1.5">

                  <span>Thông tin chuyển khoản</span>
                </div>

              </div>

              <div className="space-y-3 text-xs">
                <div
                  onClick={() => copyToClipboard(paymentConfig.bank_name, "Tên ngân hàng")}
                  className="flex justify-between items-center py-1.5 px-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                >
                  <span className="text-gray-400 font-medium">Ngân hàng</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-gray-900 font-semibold">{paymentConfig.bank_name}</strong>
                    <FaCopy className="text-gray-300 text-[10px]" />
                  </div>
                </div>

                <div
                  onClick={() => copyToClipboard(paymentConfig.bank_account_number, "Số tài khoản")}
                  className="flex justify-between items-center py-1.5 px-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                >
                  <span className="text-gray-400 font-medium">Số tài khoản</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-[#8f0012] font-mono font-bold text-sm select-all">{paymentConfig.bank_account_number}</strong>
                    <FaCopy className="text-[#8f0012]/40 text-[10px]" />
                  </div>
                </div>

                <div
                  onClick={() => copyToClipboard(paymentConfig.bank_account_name, "Chủ tài khoản")}
                  className="flex justify-between items-center py-1.5 px-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                >
                  <span className="text-gray-400 font-medium">Chủ tài khoản</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-gray-900 font-semibold uppercase">{paymentConfig.bank_account_name}</strong>
                    <FaCopy className="text-gray-300 text-[10px]" />
                  </div>
                </div>

                <div
                  onClick={() => copyToClipboard(getTransferDescription(), "Nội dung chuyển khoản")}
                  className="flex justify-between items-center py-1.5 px-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                >
                  <span className="text-gray-400 font-medium">Nội dung CK</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-gray-900 font-mono font-bold select-all">{getTransferDescription()}</strong>
                    <FaCopy className="text-gray-400 text-[10px]" />
                  </div>
                </div>

                <div
                  onClick={() => copyToClipboard(Math.round(total).toString(), "Số tiền")}
                  className="flex justify-between items-center py-1.5 px-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                >
                  <span className="text-gray-400 font-medium">Số tiền</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-[#8f0012] font-bold text-sm">{formatCurrency(total)}</strong>
                    <FaCopy className="text-[#8f0012]/40 text-[10px]" />
                  </div>
                </div>
              </div>

              {paymentConfig.vietqr_enabled && getVietQrUrl() && (
                <div className="pt-3 border-t border-gray-100 flex flex-col items-center">
                  <div className="text-[11px] font-semibold text-[#8f0012] text-center mb-2.5 uppercase tracking-wider flex items-center gap-1">
                    <span>Quét mã VietQR để thanh toán</span>
                  </div>
                  <div className="bg-white border border-[#8f0012]/10 flex flex-col items-center justify-center ">
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
                  <div className="text-[10px] text-gray-400 mt-2 text-center leading-relaxed">
                    Mở app ngân hàng bất kỳ để quét mã VietQR tự động nhập số tiền và nội dung chuyển khoản.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chi tiết sản phẩm</h3>
          <div className="space-y-4">
            {orderData.order_items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={getThumbnailUrl(item.product?.thumbnail)} className="w-12 h-12 object-cover rounded-xl bg-gray-50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 truncate mb-0.5">
                    {item.product?.name || item.title}
                  </h4>
                  {item.selected_option && !item.product?.name?.includes(item.selected_option) && (
                    <span className="inline-block px-1.5 py-0.5 bg-primary/5 text-primary text-[9px] font-bold rounded mb-1">
                      {item.selected_option}
                    </span>
                  )}
                  <p className="text-[10px] text-gray-400">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-[#8f0012]">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-50 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Tạm tính</span>
              <span className="font-bold text-gray-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Phí vận chuyển</span>
              <span className="font-bold text-gray-800">{orderData.shipping_fee === 0 ? "Miễn phí" : formatCurrency(orderData.shipping_fee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-50 items-end">
              <span className="text-xs text-gray-500 font-bold">Tổng thanh toán</span>
              <span className="text-base font-bold text-[#8f0012]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Cancellation Section */}
        {!cannotCancelStatuses.includes(orderData.status) && (
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={cancellingOrder}
            className="w-full py-3.5 text-xs font-bold text-red-500 bg-red-50 rounded-xl active:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100"
          >
            <FaTimesCircle />
            {cancellingOrder ? "Đang xử lý hủy đơn..." : "Hủy đơn hàng này"}
          </button>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-4 pb-safe flex flex-col gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50 max-w-[768px] mx-auto"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        {selectedMethod === "zalopay" && orderData.payment_status !== "paid" && orderData.status !== "cancelled" ? (
          <button
            onClick={handleZaloPayment}
            disabled={loadingZaloPayment}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#0088ff] flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all text-xs"
          >
            {loadingZaloPayment ? "Đang kết nối cổng ZaloPay..." : "Thanh toán qua Ví ZaloPay ngay"}
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#8f0012] flex items-center justify-center gap-2 shadow-lg shadow-[#8f0012]/20 active:scale-[0.98] transition-all text-xs"
          >
            <FaHome className="text-sm" />
            Tiếp tục mua sắm
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
