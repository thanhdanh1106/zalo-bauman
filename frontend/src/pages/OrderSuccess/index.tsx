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
  FaCreditCard,
  FaMapMarkerAlt,
  FaTruck,
  FaLock,
  FaChevronLeft,
  FaEllipsisH,
  FaRegMoneyBillAlt,
  FaUniversity,
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
      if (response.error) {
        showMessage("error", "Không thể hủy đơn hàng lúc này.");
      } else {
        showMessage("success", "Đã hủy đơn hàng thành công.");
        const refresh = await findOneOrderByCode(orderData.order_number);
        if (!refresh.error) setOrderData(refresh.data);
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
          setSelectedMethod(response.data.payment_method);
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
  if (error || !orderData) return <div className="p-10 text-center">{error || "Không tìm thấy đơn hàng"}</div>;

  const shippingAddress = typeof orderData.shipping_address === "string" ? JSON.parse(orderData.shipping_address) : orderData.shipping_address;
  const subtotal = Number(orderData.subtotal);
  const total = Number(orderData.total_amount);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-40">
      {/* Header Navigation */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2"><FaChevronLeft className="text-gray-600" /></button>
        <h1 className="text-lg font-bold text-gray-800">Thanh toán</h1>
        <button className="p-2"><FaEllipsisH className="text-gray-600" /></button>
      </div>

      <div className="p-4 space-y-4">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-[#8f0012] font-bold">
              <FaMapMarkerAlt className="mr-2" />
              <span>Địa chỉ nhận hàng</span>
            </div>
            <button className="text-sm text-[#8f0012] font-bold">Thay đổi</button>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-gray-800 text-base">
              {orderData.customer_name} | {orderData.customer_phone}
            </div>
            <div className="text-sm text-gray-500 leading-relaxed">
              {shippingAddress?.street || shippingAddress?.address_line_1}, {shippingAddress?.ward ? `${shippingAddress.ward}, ` : ""}{shippingAddress?.city}
            </div>
          </div>
        </div>

        {/* Payment Methods - Fixed to COD */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 ml-1">Phương thức thanh toán</h3>
          
          <div className="bg-white rounded-2xl p-4 flex items-center border-2 border-[#8f0012] transition-all">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mr-4">
               <FaRegMoneyBillAlt className="text-orange-500 text-xl" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-gray-800 text-sm">Thanh toán khi nhận hàng (COD)</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Thanh toán bằng tiền mặt khi nhận hàng</p>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-[#8f0012] flex items-center justify-center">
              <div className="w-3 h-3 bg-[#8f0012] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Chi tiết đơn hàng</h3>
          <div className="space-y-6">
            {orderData.order_items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <img src={getThumbnailUrl(item.product?.thumbnail)} className="w-16 h-16 object-cover rounded-xl bg-gray-50" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 leading-tight mb-1">{item.product?.name}</h4>
                  <p className="text-xs text-gray-400">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Tạm tính</span>
                <span className="font-bold text-gray-800">{formatCurrency(subtotal)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Phí vận chuyển</span>
                <span className="text-gray-800 font-medium">Miễn phí</span>
             </div>
             {selectedMethod === "vnpay_qr" && (
               <div className="flex justify-between text-sm">
                  <span className="text-[#8f0012] font-medium">Giảm giá (Ưu đãi ZaloPay)</span>
                  <span className="text-[#8f0012] font-bold">-{formatCurrency(total * 0.1)}</span>
               </div>
             )}
             <div className="flex justify-between pt-4 border-t border-gray-100 items-end">
                <span className="text-sm text-gray-500 font-medium">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-[#8f0012]">
                  {formatCurrency(selectedMethod === "vnpay_qr" ? total * 0.9 : total)}
                </span>
             </div>
          </div>
        </div>

        {/* Cancellation Section */}
        {["new", "confirmed", "pending"].includes(orderData.status) && (
           <button 
             onClick={handleCancelOrder}
             disabled={cancellingOrder}
             className="w-full py-4 text-sm font-bold text-red-500 bg-red-50 rounded-2xl active:bg-red-100 transition-colors"
           >
             {cancellingOrder ? "Đang xử lý..." : "Hủy đơn hàng này"}
           </button>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
        <div className="flex justify-between items-center">
           <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng thanh toán</span>
              <span className="text-xl font-bold text-[#8f0012]">{formatCurrency(selectedMethod === "vnpay_qr" ? total * 0.9 : total)}</span>
           </div>
           <span className="text-[10px] text-gray-300 italic">Giá đã bao gồm VAT</span>
        </div>
        <button 
          onClick={() => navigate("/thank-you", { state: { orderData } })}
          disabled={orderData.status === "cancelled"}
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${orderData.status === "cancelled" ? "bg-gray-400" : "bg-[#8f0012] shadow-lg shadow-[#8f0012]/20"}`}
        >
          {orderData.status === "cancelled" ? (
             "Đơn hàng đã hủy"
          ) : (
             <>
               Xác nhận đơn hàng <FaCheck className="ml-2 text-xs" />
             </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
