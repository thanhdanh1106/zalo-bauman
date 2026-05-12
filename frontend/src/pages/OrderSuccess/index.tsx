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
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { CheckoutSDK, EventName, events } from "zmp-sdk/apis";

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

  const [paymentConfig, setPaymentConfig] = useState<any>({
    bank_name: "Vietcombank",
    bank_account_number: "1029384756",
    bank_account_name: "CÔNG TY TNHH NHÂN SÂM BAUMANN",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/settings/payment`)
      .then(r => r.json())
      .then(res => {
        if (res && !res.error && res.data) {
          setPaymentConfig((prev: any) => ({ ...prev, ...res.data }));
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
    if (!confirm(`Bạn có chắc muốn hủy đơn hàng #${orderData.order_number}?`)) return;

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

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-40 animate-fade-in">
      {/* Không dùng custom duplicate header tại đây vì IndexLayout đã bao gồm header chính */}

      <div className="p-4 space-y-4 pt-6">
        {/* Order Status Ribbon */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Trạng thái đơn hàng</span>
            <span className="text-sm font-bold text-gray-800">#{orderData.order_number}</span>
          </div>
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${statusMeta.bg}`}>
            {statusMeta.label}
          </span>
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
              {shippingAddress?.street || shippingAddress?.address_line_1 || ""}, {shippingAddress?.ward ? `${shippingAddress.ward}, ` : ""}{shippingAddress?.city || ""}
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
            <div className="bg-[#fffdfd] p-3 rounded-xl border border-[#8f0012]/10 text-xs space-y-1 text-gray-700 animate-fade-in">
              <div className="font-bold text-[#8f0012] mb-1">Thông tin chuyển khoản:</div>
              <div>• Ngân hàng: <strong className="text-gray-900">{paymentConfig.bank_name}</strong></div>
              <div>• Số tài khoản: <strong className="text-[#8f0012] select-all font-mono font-bold">{paymentConfig.bank_account_number}</strong></div>
              <div>• Chủ tài khoản: <strong className="text-gray-900">{paymentConfig.bank_account_name}</strong></div>
              <div>• Nội dung: <strong className="text-gray-900 select-all font-mono font-bold">Thanh toan DH {orderData.order_number}</strong></div>
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
        {["new", "confirmed", "pending"].includes(orderData.status) && (
           <button 
             onClick={handleCancelOrder}
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
