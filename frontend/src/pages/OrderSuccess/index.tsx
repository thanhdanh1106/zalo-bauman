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
import { Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCheck,
  FaCreditCard,
  FaEnvelope,
  FaExclamationTriangle,
  FaHome,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingCart,
  FaSpinner,
  FaTimes,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const [cancelMessage, setCancelMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleZaloPayment = async () => {
    try {
      if (!orderData) return;
      setLoadingZaloPayment(true);

      const zaloOrderData = transformCartToZaloOrder(
        orderData.order_items,
        Number(orderData.total_amount),
        `Đơn hàng ${import.meta.env.VITE_COMPANY_NAME || "ALPHA X"} - ${
          orderData.order_number
        }`,
        {
          order_number: orderData.order_number,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          myTransactionId: `ALPHAX_${orderData.id}_${Date.now()}`,
          storeName: import.meta.env.VITE_COMPANY_NAME || "ALPHA X",
          storeId: "ALPHAX_STORE",
          paymentMethod: orderData.payment_method,
        }
      );

      let paymentMethodId: string = ZALO_PAYMENT_METHODS.BANK;

      switch (orderData.payment_method) {
        case "vnpay_qr":
          paymentMethodId = ZALO_PAYMENT_METHODS.VNPAY;
          break;
        case "banking":
          paymentMethodId = ZALO_PAYMENT_METHODS.BANK;
          break;
        case "vietqr":
          paymentMethodId = ZALO_PAYMENT_METHODS.BANK;
          break;
        case "cod":
          paymentMethodId = ZALO_PAYMENT_METHODS.COD;
          break;
        default:
          paymentMethodId = ZALO_PAYMENT_METHODS.BANK;
      }

      const zaloResponse = await createZaloOrder({
        ...zaloOrderData,
        method: {
          id: paymentMethodId,
          isCustom: false,
        },
      });
    } catch (error) {
      console.error("Zalo payment failed:", error);
      alert("Thanh toán Zalo thất bại, vui lòng thử lại.");
    } finally {
      setLoadingZaloPayment(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderData) return;
    if (
      !confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderData.order_number}?`)
    ) {
      return;
    }

    try {
      setCancellingOrder(true);
      setCancelMessage(null);
      const response = await cancelOrder(orderData.id);

      if (response.error) {
        setCancelMessage({
          type: "error",
          text: "Không thể hủy đơn hàng. Vui lòng thử lại sau.",
        });
      } else {
        setCancelMessage({
          type: "success",
          text: "Đơn hàng đã được hủy thành công!",
        });
        const refreshResponse = await findOneOrderByCode(
          orderData.order_number
        );
        if (!refreshResponse.error && refreshResponse.data) {
          setOrderData(refreshResponse.data);
        }
        setTimeout(() => setCancelMessage(null), 5000);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setCancelMessage({
        type: "error",
        text: "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.",
      });
    } finally {
      setCancellingOrder(false);
    }
  };

  const handlePaymentDone = useCallback(async (data) => {
    try {
      const result = await CheckoutSDK.checkTransaction({ data });
      switch (result.resultCode) {
        case 1:
          navigate("/payment-success");
          break;
        case 0:
          navigate("/payment-pending");
          break;
        case -1:
          navigate("/payment-failed");
          break;
        case -2:
          showMessage("error", "Vui lòng chọn phương thức thanh toán");
          break;
        default:
          showMessage(
            "error",
            result.msg || "Đã xảy ra lỗi, vui lòng thử lại sau"
          );
          break;
      }
    } catch (error) {
      showMessage("error", "Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  }, [navigate, showMessage]);

  useEffect(() => {
    events.on(EventName.PaymentDone, handlePaymentDone);
    return () => {
      events.off(EventName.PaymentDone, handlePaymentDone);
    };
  }, [handlePaymentDone]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order_code || order_code === "undefined") {
        setError("Không tìm thấy mã đơn hàng hợp lệ");
        setLoading(false);
        return;
      }

      try {
        const response = await findOneOrderByCode(order_code);
        if (response.error) {
          setError(response.message || "Không thể tải thông tin đơn hàng");
        } else {
          setOrderData(response.data);
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_code]);

  useEffect(() => {
    if (orderData && orderData.payment_status === "paid") {
      const timer = setTimeout(() => {
        navigate("/thank-you", {
          state: {
            orderNumber: orderData.order_number,
            paymentMethod: orderData.payment_method,
            orderData: {
              orderId: orderData.id,
              orderNumber: orderData.order_number,
              totalAmount: orderData.total_amount,
              customerName: orderData.customer_name,
            },
          },
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [orderData, navigate]);

  if (loading) {
    return <PageLoading height={300} />;
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-[#f6f3f2] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <FaExclamationTriangle className="text-6xl text-[#8f0012]/20 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Thông báo</h2>
          <p className="text-gray-500 mb-8">{error || "Không tìm thấy thông tin đơn hàng"}</p>
          <Link
            to="/"
            className="block w-full bg-[#8f0012] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#8f0012]/20 transition-transform active:scale-95"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date(orderData.order_date);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

  const paymentMethodLabels: Record<string, string> = {
    cod: "Thanh toán khi nhận hàng (COD)",
    banking: "Chuyển khoản ngân hàng",
    vnpay_qr: "Ví VNPAY",
  };

  const statusLabels: Record<string, string> = {
    new: "Đơn hàng mới",
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
  };

  const shippingAddress =
    typeof orderData.shipping_address === "string"
      ? JSON.parse(orderData.shipping_address)
      : orderData.shipping_address;

  return (
    <div className="min-h-screen bg-[#f6f3f2] pb-20">
      {/* Success Hero Section */}
      <section className="bg-gradient-to-r from-[#8f0012] to-[#b32025] text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30">
              {orderData.status === "cancelled" ? (
                <FaTimes className="text-3xl text-white" />
              ) : (
                <FaCheck className="text-3xl text-white" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {orderData.status === "cancelled" ? "Đơn hàng đã hủy" : "Đặt hàng thành công!"}
          </h1>
          <p className="text-white/80 text-sm mb-6">
            {orderData.status === "cancelled"
              ? "Cảm ơn bạn đã quan tâm đến sản phẩm của chúng tôi."
              : "Chúng tôi đã nhận được đơn hàng của bạn."}
          </p>
          <div className="inline-block px-6 py-2 bg-white/10 rounded-full border border-white/20">
            <span className="text-sm font-medium">Mã đơn hàng: {orderData.order_number}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6">
        <div className="space-y-6">
          {/* Order Status Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
             <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-800 flex items-center">
                  <FaTruck className="mr-2 text-[#8f0012]" />
                  Trạng thái đơn hàng
                </h2>
                <span className="px-4 py-1 bg-[#8f0012]/5 text-[#8f0012] text-xs font-bold rounded-full border border-[#8f0012]/10">
                  {statusLabels[orderData.status] || orderData.status}
                </span>
             </div>
             <div className="flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-2 text-gray-300" />
                <span>Ngày đặt hàng: {new Date(orderData.order_date).toLocaleDateString("vi-VN")}</span>
             </div>
          </div>

          {/* Items Summary Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center border-b border-gray-50 pb-4">
              <FaShoppingCart className="mr-2 text-[#8f0012]" />
              Sản phẩm đã chọn
            </h2>
            <div className="space-y-6">
              {orderData.order_items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={getThumbnailUrl(item.product?.thumbnail)}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-xl bg-[#f6f3f2]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-800 truncate">{item.product?.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.quantity} x {formatCurrency(Number(item.price))}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#8f0012]">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-bold">{formatCurrency(Number(orderData.subtotal))}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí giao hàng</span>
                  <span className="font-bold">{Number(orderData.shipping_fee) === 0 ? "Miễn phí" : formatCurrency(Number(orderData.shipping_fee))}</span>
               </div>
               <div className="flex justify-between pt-3 border-t border-gray-50">
                  <span className="font-bold text-gray-800">Tổng thanh toán</span>
                  <span className="text-xl font-bold text-[#8f0012]">{formatCurrency(Number(orderData.total_amount))}</span>
               </div>
            </div>
          </div>

          {/* Shipping & Payment Info Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 space-y-8">
            <div>
              <h2 className="font-bold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-[#8f0012]" />
                Thông tin nhận hàng
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <FaEnvelope className="mr-3 mt-1 text-gray-300" />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{orderData.customer_name}</span>
                    <span className="text-gray-400">{orderData.customer_email}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-3 text-gray-300" />
                  <span>{orderData.customer_phone}</span>
                </div>
                <div className="flex items-start">
                  <FaTruck className="mr-3 mt-1 text-gray-300" />
                  <div className="text-gray-500">
                    {shippingAddress ? (
                      <>
                        <p>{shippingAddress.street || shippingAddress.address_line_1}</p>
                        <p>{shippingAddress.state ? `${shippingAddress.state}, ` : ""}{shippingAddress.city}</p>
                      </>
                    ) : "Chưa có thông tin địa chỉ"}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-[#8f0012]" />
                Thanh toán
              </h2>
              <div className="bg-[#f6f3f2] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Phương thức</span>
                  <span className="text-sm font-bold text-gray-800">
                    {paymentMethodLabels[orderData.payment_method] || orderData.payment_method}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  orderData.payment_status === "paid" ? "bg-green-100 text-green-600" : "bg-[#8f0012]/10 text-[#8f0012]"
                }`}>
                  {orderData.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 px-2">
            {orderData.payment_status !== "paid" && orderData.status !== "cancelled" && (
              <>
                {["banking", "vnpay_qr", "cod"].includes(orderData.payment_method) && (
                  <button
                    onClick={handleZaloPayment}
                    disabled={loadingZaloPayment}
                    className="w-full bg-[#8f0012] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#8f0012]/20 transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {loadingZaloPayment ? "Đang xử lý..." : "Thanh toán ngay"}
                  </button>
                )}
                
                {orderData.status === "new" && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancellingOrder}
                    className="w-full bg-white text-red-500 py-4 rounded-2xl font-bold border border-red-100 transition-transform active:scale-95"
                  >
                    {cancellingOrder ? "Đang hủy..." : "Hủy đơn hàng"}
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={() => navigate("/")}
              className="w-full bg-white text-gray-500 py-4 rounded-2xl font-bold border border-gray-100 transition-transform active:scale-95"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
