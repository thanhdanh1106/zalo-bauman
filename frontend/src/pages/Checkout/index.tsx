import PromoCodeForm from "@shared/components/PromoCodeForm";
import { useToasterContext } from "@shared/components/ToasterContext";

import { getAddresses } from "@shared/utils/Account";
import { useCart } from "@shared/hooks/useCart";
import { RootState } from "@shared/store";
import {
  selectAppliedPromotion,
  selectAppliedReward,
  selectCartDiscount,
  selectCartSubtotal,
  selectCartTotal,
  applyPromotion,
  removePromotion,
  applyReward,
  removeReward,
} from "@shared/store/slices/cartSlice";
import { getThumbnailUrl, getUserFullName } from "@shared/utils/Hooks";
import { createOrder } from "@shared/utils/Orders";
import { findManyPromotions, findMyVouchers } from "@shared/utils/Promotions";
import { findManyRewards, getUserPoints, redeemReward, getUserRedemptions } from "@shared/utils/Rewards";
import { promotionProps } from "@shared/types/promotion";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Box, Sheet, Text } from "zmp-ui";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCreditCard,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingCart,
  FaTruck,
  FaUser,
} from "react-icons/fa";

interface CheckoutForm {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_street: string;
  shipping_city: string;
  shipping_district: string;
  shipping_ward: string;
  shipping_postal_code?: string;
  payment_method: "cod" | "banking" | "zalopay";
  notes?: string;
  agreeToTerms: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearAllItems } = useCart();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { showMessage } = useToasterContext();

  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const totalFromRedux = useSelector(selectCartTotal);
  const appliedPromotion = useSelector(selectAppliedPromotion);
  const appliedReward = useSelector(selectAppliedReward);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const dispatch = useDispatch();

  const [vouchers, setVouchers] = useState<promotionProps[]>([]);
  const [allPromotions, setAllPromotions] = useState<promotionProps[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [showVouchers, setShowVouchers] = useState(false);
  const [activeTab, setActiveTab] = useState<"vouchers" | "rewards">("vouchers");
  const [isRedeeming, setIsRedeeming] = useState<number | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<any>({
    default_shipping_fee: 30000,
    free_shipping_threshold: 500000,
    bank_name: "Vietcombank",
    bank_account_number: "1029384756",
    bank_account_name: "CÔNG TY TNHH NHÂN SÂM BAUMANN",
    enable_cod: true,
    cod_description: "Thanh toán tiền mặt khi nhận hàng tại nhà.",
    zalopay_app_id: "2553",
  });

  const fetchData = async () => {
    try {
      const pConfRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/settings/payment`).then(r => r.json()).catch(() => null);
      if (pConfRes && !pConfRes.error && pConfRes.data) {
        setPaymentConfig((prev: any) => ({ ...prev, ...pConfRes.data }));
      }
    } catch (e) {
      console.error(e);
    }

    const [vouchersRes, promosRes, rewardsRes, pointsRes, redemptionsRes, addressesRes] = await Promise.all([
      findMyVouchers(),
      findManyPromotions(),
      findManyRewards({ per_page: 20 }),
      getUserPoints(),
      getUserRedemptions(),
      getAddresses()
    ]);

    if (vouchersRes && !vouchersRes.error) setVouchers(vouchersRes.data);
    if (promosRes && !promosRes.error) setAllPromotions(promosRes.data);
    if (rewardsRes && !rewardsRes.error) {
      const data = Array.isArray(rewardsRes.data) ? rewardsRes.data : rewardsRes.data?.data || [];
      setRewards(data);
    }
    if (redemptionsRes && !redemptionsRes.error) setRedemptions(redemptionsRes.data);
    if (pointsRes && !pointsRes.error) setUserPoints(pointsRes.data?.balance_int ?? 0);
    if (addressesRes && !addressesRes.error) {
      setSavedAddresses(addressesRes.data || []);
      // Auto select default address
      const defaultAddr = (addressesRes.data || []).find((a: any) => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        // Fill form fields
        setValue("customer_name", defaultAddr.name || getUserFullName(user));
        setValue("customer_phone", defaultAddr.phone || user?.information?.phone);
        setValue("shipping_street", defaultAddr.street || defaultAddr.address);
        setValue("shipping_city", defaultAddr.city || "");
        setValue("shipping_district", defaultAddr.state || "");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedeemReward = async (reward: any) => {
    if (reward.outOfStock || userPoints < reward.points || isRedeeming) return;
    setIsRedeeming(reward.id);
    try {
      const res = await redeemReward(reward.id);
      if (res && !res.error) {
        showMessage("success", `Đổi "${reward.name}" thành công!`);
        await fetchData(); // Refresh vouchers and points
        setActiveTab("vouchers");
      } else {
        showMessage("error", res?.message || "Lỗi đổi quà");
      }
    } catch (e) {
      showMessage("error", "Đã có lỗi xảy ra");
    } finally {
      setIsRedeeming(null);
    }
  };

  const shipping = subtotal >= (paymentConfig.free_shipping_threshold ?? 500000) ? 0 : (paymentConfig.default_shipping_fee ?? 30000);
  const finalTotal = totalFromRedux + shipping;

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<CheckoutForm>({
    defaultValues: {
      customer_name: getUserFullName(user) || "",
      customer_phone: user?.information?.phone || "",
      shipping_street: user?.information?.address || "",
      shipping_city: user?.information?.city || "",
      shipping_district: user?.information?.district || "",
      shipping_ward: user?.information?.ward || "",
      shipping_postal_code: user?.information?.postal_code || "",
      payment_method: "cod",
      notes: "",
      agreeToTerms: true,
    },
    mode: "onChange",
  });

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setValue("customer_name", addr.name || getUserFullName(user));
    setValue("customer_phone", addr.phone || user?.information?.phone);
    setValue("shipping_street", addr.street || addr.address || "");
    setValue("shipping_city", addr.city || "");
    setValue("shipping_district", addr.district || addr.state || "");
    setValue("shipping_ward", addr.ward || "");
  };

  const paymentMethod = watch("payment_method");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f3f2] flex items-center justify-center">
        <div className="text-center px-6">
          <FaShoppingCart className="text-6xl text-[#8f0012]/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-8">Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-[#8f0012] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#8f0012]/20"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: (keyof CheckoutForm)[] = [];
    if (step === 1) {
      fieldsToValidate.push(
        "customer_name",
        "customer_phone",
        "shipping_street",
        "shipping_city",
        "shipping_district",
        "shipping_ward"
      );
    }
    return await trigger(fieldsToValidate);
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmitOrder = async (data: CheckoutForm) => {
    if (!user) {
      showMessage("warning", "Vui lòng đăng nhập tài khoản để đặt hàng!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        payment_method: data.payment_method,
        payment_status: "pending",
        notes: data.notes,
        shipping_address: {
          address_line_1: data.shipping_street,
          ward: data.shipping_ward,
          district: data.shipping_district,
          city: data.shipping_city,
          country: "vn",
          postal_code: data.shipping_postal_code || "",
        },
        order_items: items,
        total_amount: finalTotal.toString(),
        shipping_fee: shipping.toString(),
        promotion_id: appliedPromotion?.id,
        reward_id: appliedReward?.id,
        ref: localStorage.getItem("affiliate_ref") || undefined,
      };

      const response = await createOrder(orderData);
      if (response && !response.error) {
        showMessage("success", "Đặt hàng thành công!");
        clearAllItems();
        navigate(`/thank-you`, { state: { orderData: response.data } });
      } else {
        showMessage("error", "Lỗi đặt hàng, vui lòng thử lại.");
      }
    } catch (error) {
      showMessage("error", "Đã có lỗi xảy ra.");
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, title: "Thông tin", icon: FaUser },
    { id: 2, title: "Xác minh", icon: FaCheck },
  ];

  const formData = watch();

  return (
    <div className="min-h-screen bg-[#f6f3f2]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8f0012] to-[#b32025] text-white py-10 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/30">
              <FaLock className="text-xl text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold uppercase mb-1 tracking-wider">Thanh toán an toàn</h1>
          <p className="text-white/80 text-sm">Hoàn tất đơn hàng của bạn</p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-[180px]">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            {/* Login Prompt Banner if Unauthenticated */}
            {!user && (
              <div className="mt-4 p-4 bg-[#fff8e1] rounded-2xl border border-[#ffe082] flex items-center justify-between shadow-sm animate-fade-in">
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-[#f57f17] text-2xl shrink-0">lock_person</span>
                  <div>
                    <p className="text-xs font-bold text-[#b71c1c]">Bạn chưa đăng nhập tài khoản</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">Đăng nhập để nhận điểm thưởng và tự động điền thông tin.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="bg-[#8f0012] text-white text-xs font-bold px-3 py-2 rounded-xl shrink-0 shadow active:scale-95 transition-all"
                >
                  Đăng nhập
                </button>
              </div>
            )}

            {/* Progress Steps */}
            <div className="mt-6 mb-8 px-4">
              <div className="flex items-center justify-center space-x-12">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                              ? "bg-white border-[#8f0012] text-[#8f0012] scale-110"
                              : "bg-white border-gray-100 text-gray-300"
                            }`}
                        >
                          {isCompleted ? <FaCheck /> : <Icon />}
                        </div>
                        <span className={`mt-2 text-[10px] font-bold uppercase tracking-tighter ${isActive ? "text-[#8f0012]" : "text-gray-400"}`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-20 h-0.5 mt-[-18px] ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleFormSubmit(handleSubmitOrder)} className="space-y-4">
              {/* Step 1: Input Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Saved Addresses Section */}
                  {savedAddresses.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white">
                      <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center uppercase tracking-wider">
                        <FaMapMarkerAlt className="mr-3 text-[#8f0012]" />
                        Địa chỉ đã lưu
                      </h2>
                      <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            className={`min-w-[240px] p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddressId === addr.id
                              ? "border-[#8f0012] bg-[#8f0012]/5"
                              : "border-gray-50 bg-gray-50"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-gray-800 text-sm truncate">{addr.name}</span>
                              {addr.is_default && (
                                <span className="bg-[#8f0012] text-white text-[9px] px-2 py-0.5 rounded-full uppercase">Mặc định</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mb-2 h-8">{addr.street || addr.address}</p>
                            <div className="flex items-center text-[11px] text-gray-400">
                              <FaPhone className="mr-1 text-[10px]" />
                              {addr.phone}
                            </div>
                          </div>
                        ))}
                        <div
                          onClick={() => setSelectedAddressId(null)}
                          className={`min-w-[120px] flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${selectedAddressId === null ? "border-[#8f0012] bg-[#8f0012]/5" : "border-gray-200"}`}
                        >
                          <span className="material-symbols-outlined text-gray-400 mb-1">add_location_alt</span>
                          <span className="text-[11px] font-bold text-gray-500 text-center leading-tight">Nhập địa chỉ mới</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                      <FaUser className="mr-3 text-[#8f0012]" />
                      Thông tin nhận hàng
                    </h2>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Họ và tên *</label>
                        <Controller
                          name="customer_name"
                          control={control}
                          rules={{ required: "Vui lòng nhập họ tên" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className={`w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800 ${errors.customer_name ? "border-red-500" : ""}`}
                              placeholder="Nhập họ và tên đầy đủ"
                            />
                          )}
                        />
                        {errors.customer_name && <p className="mt-1 text-xs text-red-500">{errors.customer_name.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Số điện thoại *</label>
                        <Controller
                          name="customer_phone"
                          control={control}
                          rules={{ required: "Vui lòng nhập số điện thoại" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="tel"
                              className={`w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800 ${errors.customer_phone ? "border-red-500" : ""}`}
                              placeholder="0912345678"
                            />
                          )}
                        />
                        {errors.customer_phone && <p className="mt-1 text-xs text-red-500">{errors.customer_phone.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Địa chỉ chi tiết *</label>
                        <Controller
                          name="shipping_street"
                          control={control}
                          rules={{ required: "Vui lòng nhập địa chỉ" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className={`w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800 ${errors.shipping_street ? "border-red-500" : ""}`}
                              placeholder="Số nhà, tên đường..."
                            />
                          )}
                        />
                        {errors.shipping_street && <p className="mt-1 text-xs text-red-500">{errors.shipping_street.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Tỉnh/Thành phố *</label>
                          <Controller
                            name="shipping_city"
                            control={control}
                            rules={{ required: "Bắt buộc" }}
                            render={({ field }) => (
                              <input {...field} className="w-full px-4 py-2.5 bg-[#f6f3f2] rounded-xl text-sm outline-none" placeholder="Tỉnh/TP" />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Quận/Huyện *</label>
                          <Controller
                            name="shipping_district"
                            control={control}
                            rules={{ required: "Bắt buộc" }}
                            render={({ field }) => (
                              <input {...field} className="w-full px-4 py-2.5 bg-[#f6f3f2] rounded-xl text-sm outline-none" placeholder="Quận/Huyện" />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Phường/Xã *</label>
                          <Controller
                            name="shipping_ward"
                            control={control}
                            rules={{ required: "Bắt buộc" }}
                            render={({ field }) => (
                              <input {...field} className="w-full px-4 py-2.5 bg-[#f6f3f2] rounded-xl text-sm outline-none" placeholder="Phường/Xã" />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white">
                    <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[#8f0012] mr-2">payments</span>
                      Phương thức thanh toán
                    </h2>
                    <div className="space-y-3">
                      {[
                        { id: "cod", label: "Thanh toán khi nhận hàng (COD)", desc: paymentConfig.cod_description || "Nhận hàng rồi mới thanh toán tiền mặt", visible: paymentConfig.enable_cod ?? true },
                        { id: "banking", label: "Chuyển khoản ngân hàng", desc: "Thanh toán an toàn qua ứng dụng ngân hàng", visible: true },
                        { id: "zalopay", label: "Ví ZaloPay", desc: "Thanh toán tiện lợi qua cổng thanh toán tự động", visible: true }
                      ].filter(m => m.visible).map((method) => (
                        <div key={method.id} className="space-y-2">
                          <div
                            onClick={() => setValue("payment_method", method.id as any, { shouldValidate: true })}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === method.id ? "border-[#8f0012] bg-[#8f0012]/5" : "border-gray-50 bg-gray-50/50 hover:bg-gray-50"
                              }`}
                          >
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">{method.label}</span>
                              <span className="text-[11px] text-gray-500 block mt-0.5">{method.desc}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? "border-[#8f0012] bg-[#8f0012]" : "border-gray-300 bg-white"
                              }`}>
                              {paymentMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>

                          {/* Dynamic Gateway Credentials / Info Box when Selected */}
                          {paymentMethod === method.id && method.id === "banking" && (
                            <div className="p-3 bg-[#f6f3f2] rounded-xl border border-gray-200 text-xs space-y-1 text-gray-700 animate-fade-in">
                              <div className="font-bold text-[#8f0012] mb-1">Thông tin tài khoản chuyển khoản:</div>
                              <div>• <span className="font-semibold">Ngân hàng:</span> {paymentConfig.bank_name || "Vietcombank"}</div>
                              <div>• <span className="font-semibold">Số tài khoản:</span> <span className="font-mono font-bold text-sm select-all">{paymentConfig.bank_account_number || "1029384756"}</span></div>
                              <div>• <span className="font-semibold">Chủ tài khoản:</span> {paymentConfig.bank_account_name || "CÔNG TY TNHH NHÂN SÂM BAUMANN"}</div>
                              <div className="text-[10px] text-gray-500 italic mt-1">Hệ thống sẽ cung cấp mã QR chuyển khoản chính xác tại bước Đặt hàng thành công.</div>
                            </div>
                          )}

                          {paymentMethod === method.id && method.id === "zalopay" && (
                            <div className="p-3 bg-[#e8f5e9] rounded-xl border border-green-200 text-xs text-green-800 animate-fade-in">
                              <span className="font-bold block mb-0.5">Thanh toán qua Ví ZaloPay</span>
                              Hệ thống sẽ tự động gạch nợ đơn hàng sau khi hoàn tất thanh toán qua App ZaloPay.
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Verification / Review */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                      <FaCheck className="mr-3 text-green-500" />
                      Xác minh thông tin
                    </h2>

                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400 font-medium">Người nhận:</span>
                          <span className="text-xs font-bold text-gray-800">{formData.customer_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400 font-medium">Số điện thoại:</span>
                          <span className="text-xs font-bold text-gray-800">{formData.customer_phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400 font-medium">Thanh toán:</span>
                          <span className="text-xs font-bold text-[#8f0012]">
                            {paymentMethod === "banking" ? "Chuyển khoản ngân hàng" : paymentMethod === "zalopay" ? "Ví ZaloPay" : "Ship COD (Tiền mặt)"}
                          </span>
                        </div>
                        <div className="flex flex-col pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400 font-medium mb-1">Địa chỉ nhận hàng:</span>
                          <span className="text-xs font-bold text-gray-800 leading-relaxed">
                            {formData.shipping_street}, {formData.shipping_ward}, {formData.shipping_district}, {formData.shipping_city}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sản phẩm của bạn</h3>
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                            <img src={getThumbnailUrl(item.product?.thumbnail)} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{item.product?.name || item.title}</p>
                              <p className="text-[10px] text-gray-400">SL: {item.quantity}</p>
                            </div>
                            <span className="text-xs font-bold text-[#8f0012] shrink-0">{(item.price * item.quantity).toLocaleString()}đ</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Tạm tính:</span>
                          <span className="font-bold text-gray-800">{subtotal.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Phí vận chuyển:</span>
                          <span className="font-bold text-gray-800">{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()}đ`}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[#8f0012]">Giảm giá:</span>
                            <span className="font-bold text-[#8f0012]">-{discount.toLocaleString()}đ</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-bold text-gray-800">Tổng cộng:</span>
                          <span className="text-lg font-bold text-[#8f0012]">{finalTotal.toLocaleString()}đ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-white">
                    <Controller
                      name="agreeToTerms"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1 mr-3 accent-[#8f0012]"
                          />
                          <span className="text-xs text-gray-500">
                            Tôi xác nhận các thông tin trên là chính xác và đồng ý với <span className="text-[#8f0012] underline">điều khoản đặt hàng</span>.
                          </span>
                        </label>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center space-x-4 pt-4 px-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="flex-1 flex items-center justify-center py-4 text-sm font-bold text-gray-500 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all disabled:opacity-30"
                >
                  <FaArrowLeft className="mr-2" />
                  Quay lại
                </button>

                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-[2] flex items-center justify-center py-4 text-sm font-bold text-white bg-[#8f0012] rounded-2xl shadow-lg shadow-[#8f0012]/20 active:scale-95 transition-all"
                  >
                    Tiếp tục xác minh
                    <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isProcessing || !formData.agreeToTerms}
                    className="flex-[2] flex items-center justify-center py-4 text-sm font-bold text-white bg-[#8f0012] rounded-2xl shadow-lg shadow-[#8f0012]/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? "Đang tạo đơn..." : "Đặt mua ngay"}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="col-span-12 mt-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Ưu đãi của bạn</h3>
                <button
                  onClick={() => setShowVouchers(true)}
                  className="text-[#8f0012] text-[12px] font-bold flex items-center"
                >
                  {vouchers.length > 0 ? `Chọn mã (${vouchers.length})` : "Tất cả ưu đãi"}
                  <FaArrowRight className="ml-1 text-[10px]" />
                </button>
              </div>

              <PromoCodeForm className="mb-4" />


            </div>

            <Sheet
              visible={showVouchers}
              onClose={() => setShowVouchers(false)}
              autoHeight
              mask
              handler
              swipeToClose
              title="Chọn Voucher"
            >
              <Box className="px-0 pb-10">
                {/* Tab Header */}
                <Box className="flex border-b border-gray-100 mb-4 px-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("vouchers")}
                    className={`flex-1 py-3 text-[14px] font-bold transition-all border-b-2 ${activeTab === "vouchers" ? "text-[#8f0012] border-[#8f0012]" : "text-gray-400 border-transparent"}`}
                  >
                    Voucher
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("rewards")}
                    className={`flex-1 py-3 text-[14px] font-bold transition-all border-b-2 ${activeTab === "rewards" ? "text-[#8f0012] border-[#8f0012]" : "text-gray-400 border-transparent"}`}
                  >
                    Tích điểm
                  </button>
                </Box>

                <Box className="px-4 space-y-4">
                  {activeTab === "vouchers" ? (
                    <>
                      <Text className="text-gray-500 text-sm mb-4">
                        Danh sách các chương trình khuyến mãi đang diễn ra.
                      </Text>
                      <Box className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
                        {allPromotions.filter(v => v.is_visible).length > 0 ? allPromotions.filter(v => v.is_visible).map((v) => {
                          const isSelected = appliedPromotion?.id === v.id;
                          return (
                            <Box
                              key={v.id}
                              onClick={() => {
                                if (isSelected) {
                                  dispatch(removePromotion());
                                } else {
                                  dispatch(applyPromotion(v));
                                }
                                setShowVouchers(false);
                              }}
                              className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${isSelected
                                ? "border-[#8f0012] bg-[#8f0012]/5 shadow-sm"
                                : "border-gray-100 bg-white hover:bg-gray-50 cursor-pointer"
                                }`}
                            >
                              <Box className="flex items-center space-x-4">
                                <Box className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#8f0012] text-white" : "bg-gray-50 text-[#8f0012]"}`}>
                                  <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
                                </Box>
                                <Box>
                                  <Text className={`text-[15px] font-bold ${isSelected ? "text-[#8f0012]" : "text-gray-800"}`}>
                                    {v.title || v.promotion_code}
                                  </Text>
                                  <Text className="text-[12px] text-gray-500">Giảm {v.discount}% đơn hàng</Text>
                                  <Text className="text-[10px] text-gray-400 mt-0.5">HSD: {v.end_date ? new Date(v.end_date).toLocaleDateString("vi-VN") : "Vĩnh viễn"}</Text>
                                </Box>
                              </Box>
                              <Box>
                                {isSelected ? (
                                  <span className="material-symbols-outlined text-green-600 font-bold">check_circle</span>
                                ) : (
                                  <Box className="w-6 h-6 rounded-full border-2 border-gray-200" />
                                )}
                              </Box>
                            </Box>
                          );
                        }) : (
                          <Box className="py-10 text-center">
                            <Text className="text-gray-400">Hiện không có voucher khuyến mãi nào</Text>
                          </Box>
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box className="flex items-center justify-between bg-[#fdf8e9] p-3 rounded-xl border border-[#f5e6ba] mb-4">
                        <Box className="flex items-center space-x-2">
                          <span className="material-symbols-outlined text-[#735c00] text-[20px] icon-fill">stars</span>
                          <Text className="text-[#735c00] font-bold text-[13px]">Điểm của bạn:</Text>
                        </Box>
                        <Text className="text-[#8f0012] font-extrabold text-[15px]">{userPoints.toLocaleString()} điểm</Text>
                      </Box>
                      <Box className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
                        <Text className="text-[13px] font-bold text-gray-800 mb-2">Phần thưởng đã đổi:</Text>
                        {/* Combine vouchers and non-voucher redemptions */}
                        {([...vouchers, ...redemptions.filter(r => r.category !== "voucher")]).length > 0 ? (
                          ([...vouchers, ...redemptions.filter(r => r.category !== "voucher")]).map((v, idx) => {
                            const isVoucher = (v as any).promotion_code !== undefined;
                            const isRewardSelected = appliedReward?.id === v.id;
                            const isPromoSelected = isVoucher && appliedPromotion?.id === v.id;
                            const isSelected = isRewardSelected || isPromoSelected;

                            return (
                              <Box
                                key={isVoucher ? `v-${v.id}` : `r-${v.id}-${idx}`}
                                onClick={() => {
                                  if (isVoucher) {
                                    if (isPromoSelected) {
                                      dispatch(removePromotion());
                                    } else {
                                      dispatch(applyPromotion(v as promotionProps));
                                    }
                                  } else {
                                    if (isRewardSelected) {
                                      dispatch(removeReward());
                                    } else {
                                      dispatch(applyReward(v));
                                    }
                                  }
                                  setShowVouchers(false);
                                }}
                                className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${isSelected
                                  ? "border-[#8f0012] bg-[#8f0012]/5 shadow-sm"
                                  : isVoucher ? "border-gray-100 bg-white hover:bg-gray-50 cursor-pointer" : "border-gray-50 bg-gray-50/30 opacity-80"
                                  }`}
                              >
                                <Box className="flex items-center space-x-4">
                                  <Box className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#8f0012] text-white" : "bg-gray-50 text-[#8f0012]"}`}>
                                    <span className="material-symbols-outlined text-[24px]">{isVoucher ? "confirmation_number" : "redeem"}</span>
                                  </Box>
                                  <Box>
                                    <Text className={`text-[15px] font-bold ${isSelected ? "text-[#8f0012]" : "text-gray-800"}`}>
                                      {isVoucher ? ((v as any).title || (v as any).promotion_code) : (v as any).name}
                                    </Text>
                                    <Box className="flex items-center space-x-2">
                                      <Text className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium uppercase">
                                        {isVoucher ? "Voucher" : (v as any).category === 'product' ? 'Sản phẩm' : (v as any).category === 'service' ? 'Dịch vụ' : 'Phần thưởng'}
                                      </Text>
                                      <Text className="text-[12px] text-gray-500">
                                        {isVoucher ? `Giảm ${(v as any).discount}% đơn hàng` : `Đã đổi: ${new Date((v as any).redeemed_at).toLocaleDateString("vi-VN")}`}
                                      </Text>
                                    </Box>
                                  </Box>
                                </Box>
                                <Box>
                                  {isVoucher ? (
                                    isSelected ? (
                                      <span className="material-symbols-outlined text-green-600 font-bold">check_circle</span>
                                    ) : (
                                      <Box className="w-6 h-6 rounded-full border-2 border-gray-200" />
                                    )
                                  ) : (
                                    <Text className="text-[10px] text-gray-400 font-bold uppercase">Quà tặng</Text>
                                  )}
                                </Box>
                              </Box>
                            );
                          })
                        ) : (
                          <Box className="py-4 text-center">
                            <Text className="text-gray-400 text-[12px]">Bạn chưa có phần thưởng nào từ tích điểm</Text>
                          </Box>
                        )}

                        <div className="border-t border-dashed border-gray-200 my-4 pt-4">
                          <Text className="text-[13px] font-bold text-gray-800 mb-2">Đổi thêm quà tặng:</Text>
                          {rewards.length > 0 ? (
                            rewards.map((r) => (
                              <Box
                                key={r.id}
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50 mb-3"
                              >
                                <Box className="flex items-center space-x-4">
                                  <Box className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#8f0012] shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">redeem</span>
                                  </Box>
                                  <Box>
                                    <Text className="text-[13px] font-bold text-gray-800">{r.name}</Text>
                                    <Text className="text-[11px] text-[#8f0012] font-bold">{r.points.toLocaleString()} điểm</Text>
                                  </Box>
                                </Box>
                                <button
                                  type="button"
                                  onClick={() => handleRedeemReward(r)}
                                  disabled={r.outOfStock || userPoints < r.points || isRedeeming === r.id}
                                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${r.outOfStock ? "bg-gray-100 text-gray-400" : userPoints >= r.points ? "bg-[#8f0012] text-white active:scale-95 shadow-sm" : "bg-gray-200 text-gray-400"}`}
                                >
                                  {isRedeeming === r.id ? "..." : r.outOfStock ? "Hết hàng" : "Đổi quà"}
                                </button>
                              </Box>
                            ))
                          ) : (
                            <Box className="py-4 text-center">
                              <Text className="text-gray-400 text-[12px]">Hiện không có quà thưởng để đổi</Text>
                            </Box>
                          )}
                        </div>
                      </Box>
                    </>
                  )}
                </Box>
                <Box className="px-4">
                  <button
                    type="button"
                    onClick={() => setShowVouchers(false)}
                    className="w-full bg-[#8f0012] text-white h-12 rounded-xl font-bold mt-6"
                  >
                    Xác nhận
                  </button>
                </Box>
              </Box>
            </Sheet>

            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white">
              <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Tóm tắt đơn hàng</h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={getThumbnailUrl(item.thumbnail)}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-xl bg-[#f6f3f2]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate">{item.title}</h4>
                      <p className="text-[11px] text-gray-400">
                        {item.quantity}x • {item.price.toLocaleString()}đ
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#8f0012]">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-bold text-gray-800">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="font-bold text-gray-800">{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()}đ`}</span>
                </div>
                {appliedPromotion && (
                  <div className="flex justify-between text-sm text-[#8f0012]">
                    <span>Giảm giá ({appliedPromotion.title})</span>
                    <span className="font-bold">-{discount.toLocaleString()}đ</span>
                  </div>
                )}
                {appliedReward && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Quà tặng ({appliedReward.name})</span>
                    <span className="font-bold">Miễn phí</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-50">
                  <span className="text-base font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-xl font-bold text-[#8f0012]">{finalTotal.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
