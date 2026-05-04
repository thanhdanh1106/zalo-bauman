import PageLoading from "@shared/components/PageLoading";
import { orderProps } from "@shared/types/order";
import { findManyUserOrders } from "@shared/utils/Account";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";
import { cancelOrder } from "@shared/utils/Orders";
import React, { useEffect, useState } from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaExclamationTriangle,
  FaEye,
  FaHandHoldingUsd,
  FaMobile,
  FaSearch,
  FaShoppingBag,
  FaSpinner,
  FaTimesCircle,
  FaTruck,
  FaUniversity,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@shared/store";

const AccountOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<orderProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: "Đã giao hàng",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: <FaCheckCircle className="w-3 h-3" />,
        };
      case "shipped":
        return {
          label: "Đang giao hàng",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          icon: <FaTruck className="w-3 h-3" />,
        };
      case "processing":
        return {
          label: "Đang xử lý",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          icon: <FaClock className="w-3 h-3" />,
        };
      case "confirmed":
        return {
          label: "Đã xác nhận",
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          icon: <FaCheckCircle className="w-3 h-3" />,
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: <FaTimesCircle className="w-3 h-3" />,
        };
      default:
        return {
          label: "Chờ xác nhận",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          icon: <FaBox className="w-3 h-3" />,
        };
    }
  };

  const getPaymentStatusInfo = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return {
          label: "Đã thanh toán",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      default:
        return {
          label: "Chưa thanh toán",
          color: "text-[#8f0012]",
          bgColor: "bg-[#8f0012]/5",
        };
    }
  };

  async function fetchOrders(filter: Record<string, any>) {
    try {
      setIsLoading(true);
      const response = await findManyUserOrders(filter);
      if (response.error) {
        setData([]);
      } else {
        setData(response.data || []);
      }
    } catch (error) {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancelOrder = async (e: React.MouseEvent, orderId: number, orderNumber: string) => {
    e.stopPropagation();
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderNumber}?`)) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      setMessage(null);
      const response = await cancelOrder(orderId);

      if (response.error) {
        setMessage({
          type: "error",
          text: "Không thể hủy đơn hàng. Vui lòng thử lại sau.",
        });
      } else {
        await fetchOrders({ user_id: user?.id });
        setMessage({
          type: "success",
          text: "Đơn hàng đã được hủy thành công!",
        });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders({ user_id: user?.id });
    }
  }, [user]);

  const filteredOrders = data.filter((order) => {
    const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
        searchTerm === "" ||
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.order_items && order.order_items.some((item) =>
            item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    return matchesStatus && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f3f2] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <FaExclamationTriangle className="text-6xl text-[#8f0012]/20 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Thông báo</h2>
          <p className="text-gray-500 mb-8">Vui lòng đăng nhập để xem đơn hàng của bạn</p>
          <Link
            to="/login"
            className="block w-full bg-[#8f0012] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#8f0012]/20"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoading height={300} />;
  }

  return (
    <div className="min-h-screen bg-[#f6f3f2] pb-24">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <FaShoppingBag className="mr-3 text-[#8f0012]" />
              Đơn hàng của tôi
           </h1>
           <span className="text-xs font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
             {data.length} đơn hàng
           </span>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
           <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text"
                placeholder="Tìm mã đơn hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border-none shadow-[0_4px_15px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#8f0012]/10 transition-all text-sm"
              />
           </div>
           
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'new', label: 'Mới' },
                { id: 'confirmed', label: 'Đã xác nhận' },
                { id: 'processing', label: 'Đang xử lý' },
                { id: 'shipped', label: 'Đang giao' },
                { id: 'delivered', label: 'Đã giao' },
                { id: 'cancelled', label: 'Đã hủy' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    statusFilter === tab.id 
                    ? "bg-[#8f0012] text-white border-[#8f0012] shadow-md shadow-[#8f0012]/20" 
                    : "bg-white text-gray-500 border-gray-100 hover:border-[#8f0012]/30"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
           </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
            message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}>
             {message.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
             <span className="text-xs font-bold">{message.text}</span>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white">
               <div className="bg-[#f6f3f2] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FaShoppingBag className="text-3xl text-gray-300" />
               </div>
               <h3 className="text-base font-bold text-gray-800 mb-2">Chưa có đơn hàng</h3>
               <p className="text-sm text-gray-400 mb-8">Bạn vẫn chưa thực hiện bất kỳ giao dịch nào</p>
               <button 
                 onClick={() => navigate('/products')}
                 className="px-8 py-4 bg-[#8f0012] text-white rounded-2xl font-bold shadow-lg shadow-[#8f0012]/20 active:scale-95 transition-transform"
               >
                 Mua sắm ngay
               </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = getStatusInfo(order.status);
              const payment = getPaymentStatusInfo(order.payment_status);
              
              return (
                <div 
                  key={order.id}
                  onClick={() => navigate(`/order-success/${order.order_number}`)}
                  className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white overflow-hidden active:scale-[0.98] transition-transform"
                >
                  {/* Top Bar */}
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đơn hàng</span>
                        <span className="text-sm font-bold text-gray-800">#{order.order_number}</span>
                     </div>
                     <div className={`px-4 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${status.bgColor} ${status.color} border border-current/10`}>
                        {status.icon}
                        {status.label}
                     </div>
                  </div>

                  {/* Items Preview */}
                  <div className="p-6 space-y-4">
                    {order.order_items?.slice(0, 1).map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <img 
                          src={getThumbnailUrl(item.product?.thumbnail)} 
                          className="w-16 h-16 rounded-2xl object-cover bg-[#f6f3f2] flex-shrink-0"
                          alt="Product"
                        />
                        <div className="flex-1 min-w-0 py-1">
                           <h4 className="text-sm font-bold text-gray-800 truncate">{item.product?.name}</h4>
                           <p className="text-xs text-gray-400 mt-1">{item.quantity} sản phẩm</p>
                           <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-bold text-[#8f0012]">{formatCurrency(Number(order.total_amount))}</span>
                              <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${payment.bgColor} ${payment.color}`}>
                                {payment.label}
                              </span>
                           </div>
                        </div>
                      </div>
                    ))}
                    {order.order_items && order.order_items.length > 1 && (
                      <div className="text-[10px] text-gray-400 font-medium bg-[#f6f3f2] px-3 py-1 rounded-lg inline-block">
                        Và {order.order_items.length - 1} sản phẩm khác
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                     <div className="flex items-center text-[10px] text-gray-400">
                        <FaCalendarAlt className="mr-2 opacity-50" />
                        {new Date(order.order_date).toLocaleDateString("vi-VN")}
                     </div>
                     <div className="flex gap-2">
                        {order.status === 'new' && order.payment_status === 'pending' && (
                          <button 
                            onClick={(e) => handleCancelOrder(e, order.id, order.order_number)}
                            disabled={cancellingOrderId === order.id}
                            className="px-4 py-2 text-[10px] font-bold text-red-500 border border-red-100 rounded-xl bg-white hover:bg-red-50 transition-colors"
                          >
                            {cancellingOrderId === order.id ? "Đang hủy..." : "Hủy đơn"}
                          </button>
                        )}
                        <button className="px-4 py-2 text-[10px] font-bold text-[#8f0012] border border-[#8f0012]/10 rounded-xl bg-white hover:bg-[#8f0012]/5 transition-colors">
                          Chi tiết
                        </button>
                     </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountOrders;
