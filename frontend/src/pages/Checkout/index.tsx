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
  customer_email: string;
  customer_phone: string;
  shipping_street: string;
  shipping_city: string;
  shipping_district: string;
  shipping_ward: string;
  shipping_postal_code?: string;
  payment_method: "cod" | "banking";
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

  const fetchData = async () => {
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

  const shipping = subtotal >= 500000 ? 0 : 30000;
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
      customer_email: user?.email || "",
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
    setValue("shipping_street", addr.street || addr.address);
    setValue("shipping_city", addr.city || "");
    setValue("shipping_district", addr.state || "");
    // Note: ward might be part of street or not available separately
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
      fieldsToValidate.push("customer_name", "customer_email", "customer_phone");
    } else if (step === 2) {
      fieldsToValidate.push("shipping_street", "shipping_city", "shipping_district", "shipping_ward");
    }
    return await trigger(fieldsToValidate);
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitOrder = async (data: CheckoutForm) => {
    setIsProcessing(true);
    try {
      const orderData = {
        customer_name: data.customer_name,
        customer_email: data.customer_email,
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
      };

      const response = await createOrder(orderData);
      if (response && !response.error) {
        showMessage("success", "Đặt hàng thành công!");
        clearAllItems();
        navigate(`/order-success/${response.data.number}`);
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
    { id: 2, title: "Địa chỉ", icon: FaTruck },
    { id: 3, title: "Thanh toán", icon: FaCreditCard },
  ];

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

      <div className="container mx-auto px-4 pb-32">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            {/* Progress Steps */}
            <div className="mt-6 mb-8 px-4">
              <div className="flex items-center justify-between">
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
                        <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleFormSubmit(handleSubmitOrder)} className="space-y-4">
              {/* Step 1: Customer Information */}
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
                            className={`min-w-[240px] p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              selectedAddressId === addr.id
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
                          onClick={() => {
                            setSelectedAddressId(null);
                            // Optionally reset form
                          }}
                          className={`min-w-[120px] flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                            selectedAddressId === null ? "border-[#8f0012] bg-[#8f0012]/5" : "border-gray-200"
                          }`}
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
                      Thông tin khách hàng
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-2">Email *</label>
                          <Controller
                            name="customer_email"
                            control={control}
                            rules={{ required: "Vui lòng nhập email" }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="email"
                                className={`w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800 ${errors.customer_email ? "border-red-500" : ""}`}
                                placeholder="example@email.com"
                              />
                            )}
                          />
                          {errors.customer_email && <p className="mt-1 text-xs text-red-500">{errors.customer_email.message}</p>}
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
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white">
                  <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <FaMapMarkerAlt className="mr-3 text-[#8f0012]" />
                    Địa chỉ giao hàng
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Địa chỉ cụ thể *</label>
                      <Controller
                        name="shipping_street"
                        control={control}
                        rules={{ required: "Vui lòng nhập địa chỉ" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800 ${errors.shipping_street ? "border-red-500" : ""}`}
                            placeholder="Số nhà, tên đường"
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Tỉnh/Thành phố *</label>
                        <Controller
                          name="shipping_city"
                          control={control}
                          rules={{ required: "Vui lòng nhập tỉnh thành" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800"
                              placeholder="Tỉnh/Thành phố"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Quận/Huyện *</label>
                        <Controller
                          name="shipping_district"
                          control={control}
                          rules={{ required: "Vui lòng nhập quận huyện" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800"
                              placeholder="Quận/Huyện"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Phường/Xã *</label>
                        <Controller
                          name="shipping_ward"
                          control={control}
                          rules={{ required: "Vui lòng nhập phường xã" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800"
                              placeholder="Phường/Xã"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Ghi chú (tùy chọn)</label>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full px-4 py-3 bg-[#f6f3f2] border border-transparent rounded-xl focus:bg-white focus:border-[#8f0012]/30 outline-none transition-all text-gray-800"
                            placeholder="Ghi chú thêm cho đơn hàng..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 border border-white">
                  <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <FaCreditCard className="mr-3 text-[#8f0012]" />
                    Phương thức thanh toán
                  </h2>

                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-4">
                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === "cod" ? "border-[#8f0012] bg-[#8f0012]/5" : "border-gray-50 bg-gray-50"}`}>
                          <input
                            type="radio"
                            name={field.name}
                            value="cod"
                            checked={field.value === "cod"}
                            onChange={() => field.onChange("cod")}
                            className="mr-3 accent-[#8f0012]"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</div>
                            <div className="text-xs text-gray-400">Thanh toán bằng tiền mặt khi giao hàng</div>
                          </div>
                        </label>

                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === "banking" ? "border-[#8f0012] bg-[#8f0012]/5" : "border-gray-50 bg-gray-50"}`}>
                          <input
                            type="radio"
                            name={field.name}
                            value="banking"
                            checked={field.value === "banking"}
                            onChange={() => field.onChange("banking")}
                            className="mr-3 accent-[#8f0012]"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-gray-800">Chuyển khoản ngân hàng</div>
                            <div className="text-xs text-gray-400">Chuyển khoản qua Internet Banking</div>
                          </div>
                        </label>
                      </div>
                    )}
                  />

                  <div className="mt-6">
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
                            Tôi đồng ý với <span className="text-[#8f0012] underline">điều khoản sử dụng</span> và <span className="text-[#8f0012] underline">chính sách bảo mật</span>
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

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-[2] flex items-center justify-center py-4 text-sm font-bold text-white bg-[#8f0012] rounded-2xl shadow-lg shadow-[#8f0012]/20 active:scale-95 transition-all"
                  >
                    Tiếp tục
                    <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-[2] flex items-center justify-center py-4 text-sm font-bold text-white bg-[#8f0012] rounded-2xl shadow-lg shadow-[#8f0012]/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
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

              <div className="bg-[#fdf8e9] p-3 rounded-xl border border-[#f5e6ba] flex items-start space-x-3 shadow-sm">
                <span className="material-symbols-outlined text-[#735c00] text-[20px] mt-0.5 icon-fill">stars</span>
                <div>
                  <p className="text-[#735c00] font-bold text-[13px]">Ưu đãi Hội Viên</p>
                  <p className="text-[#5a403e] text-[11px] leading-relaxed">Bạn đang được giảm 5% cho đơn hàng đầu tiên của thành viên mới.</p>
                </div>
              </div>
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
                              className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${
                                isSelected 
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
                                className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${
                                  isSelected 
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
