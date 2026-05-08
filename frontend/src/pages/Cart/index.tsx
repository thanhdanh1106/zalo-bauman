import React from "react";
import { Page, Header, Box, Text, Button, Icon, Sheet } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "@shared/hooks/useCart";
import {
  selectCartDiscount,
  selectCartSubtotal,
  selectCartTotal,
  selectAppliedPromotion,
  selectAppliedReward,
  applyPromotion,
  removePromotion,
  applyReward,
  removeReward,
} from "@shared/store/slices/cartSlice";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";
import PromoCodeForm from "@shared/components/PromoCodeForm";
import { findMyVouchers, findManyPromotions } from "@shared/utils/Promotions";
import { promotionProps } from "@shared/types/promotion";
import { useDispatch } from "react-redux";

import { flexbox } from "@mui/system";
import { findManyRewards, getUserPoints, redeemReward, getUserRedemptions } from "@shared/utils/Rewards";
import { useToasterContext } from "@shared/components/ToasterContext";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    loading,
    removeFromCart,
    updateItemQuantity,
    clearAllItems,
  } = useCart();

  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const total = useSelector(selectCartTotal);
  const appliedPromotion = useSelector(selectAppliedPromotion);
  const appliedReward = useSelector(selectAppliedReward);
  const dispatch = useDispatch();

  const [vouchers, setVouchers] = React.useState<promotionProps[]>([]);
  const [allPromotions, setAllPromotions] = React.useState<promotionProps[]>([]);
  const [rewards, setRewards] = React.useState<any[]>([]);
  const [redemptions, setRedemptions] = React.useState<any[]>([]);
  const [userPoints, setUserPoints] = React.useState(0);
  const [showVouchers, setShowVouchers] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"vouchers" | "rewards">("vouchers");
  const [isRedeeming, setIsRedeeming] = React.useState<number | null>(null);
  const { showMessage } = useToasterContext();

  const fetchData = async () => {
    const [vouchersRes, promosRes, rewardsRes, pointsRes, redemptionsRes] = await Promise.all([
      findMyVouchers(),
      findManyPromotions(),
      findManyRewards({ per_page: 20 }),
      getUserPoints(),
      getUserRedemptions()
    ]);

    if (vouchersRes && !vouchersRes.error) setVouchers(vouchersRes.data);
    if (promosRes && !promosRes.error) setAllPromotions(promosRes.data);
    if (rewardsRes && !rewardsRes.error) {
      const data = Array.isArray(rewardsRes.data) ? rewardsRes.data : rewardsRes.data?.data || [];
      setRewards(data);
    }
    if (redemptionsRes && !redemptionsRes.error) setRedemptions(redemptionsRes.data);
    if (pointsRes && !pointsRes.error) setUserPoints(pointsRes.data?.balance_int ?? 0);
  };

  React.useEffect(() => {
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

  const shippingFee = 30000;
  const finalTotal = total + shippingFee;

  if (loading) {
    return (
      <Page className="bg-[#f6f3f2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f0012]"></div>
      </Page>
    );
  }

  if (items.length === 0) {
    return (
      <Page className="bg-[#f6f3f2]">
        <Box className="flex flex-col items-center justify-center pt-20 px-6 text-center">
          <Box className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-gray-300">shopping_cart</span>
          </Box>
          <Text size="large" className="font-bold text-gray-800 mb-2">Giỏ hàng trống</Text>
          <Text className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</Text>
          <Button
            onClick={() => navigate("/products")}
            className="bg-[#8f0012] h-12 px-8 rounded-xl font-bold"
          >
            Khám phá sản phẩm
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-[#f6f3f2] min-h-screen pb-40">
      <main className="px-4 pt-4 space-y-6">
        {/* Product List Header */}
        <Box className="flex items-center justify-between mb-2">
          <Text className="text-[15px] font-bold text-gray-800">Sản phẩm ({items.length})</Text>
          <button onClick={clearAllItems} className="text-[#8f0012] text-[13px] font-semibold">Xóa tất cả</button>
        </Box>

        {/* Product Items */}
        <Box className="space-y-3">
          {items.map((item) => (
            <Box key={item.id} className="bg-white rounded-2xl p-3 flex space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white">
              <Box className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={getThumbnailUrl(item.thumbnail)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </Box>
              <Box className="flex-1 flex flex-col justify-between py-1">
                <Box>
                  <Text className="text-[14px] font-bold text-gray-800 line-clamp-2 leading-snug">{item.title}</Text>
                  {item.selected_option && (
                    <Text className="text-[11px] text-gray-400 mt-1">Phân loại: {item.selected_option}</Text>
                  )}
                </Box>
                <Box className="flex items-center justify-between">
                  <Text className="text-[16px] font-bold text-[#8f0012]">{item.price.toLocaleString()}đ</Text>
                  <Box className="flex items-center bg-[#f6f3f2] rounded-full p-0.5">
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <Text className="px-3 font-bold text-[14px]">{item.quantity}</Text>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Promo Code Section */}
        <Box className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
          <Box className="flex items-center justify-between">
            <Text className="text-[15px] font-bold text-gray-800">Ưu đãi của bạn</Text>
            <button
              onClick={() => setShowVouchers(true)}
              className="text-[#8f0012] text-[12px] font-bold flex items-center"
            >
              {vouchers.length > 0 ? `Chọn mã (${vouchers.length})` : "Tất cả ưu đãi"}
              <span className="material-symbols-outlined text-[16px] ml-1">chevron_right</span>
            </button>
          </Box>

          <PromoCodeForm />

          <Box className="bg-[#fdf8e9] p-3 rounded-xl border border-[#f5e6ba] flex items-start space-x-3 shadow-sm">
            <span className="material-symbols-outlined text-[#735c00] text-[20px] mt-0.5 icon-fill">stars</span>
            <Box>
              <Text className="text-[#735c00] font-bold text-[13px]">Ưu đãi Hội Viên</Text>
              <Text className="text-[#5a403e] text-[11px] leading-relaxed">Bạn đang được giảm 5% cho đơn hàng đầu tiên của thành viên mới.</Text>
            </Box>
          </Box>
        </Box>

        {/* Voucher Selection Sheet */}
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
                onClick={() => setActiveTab("vouchers")}
                className={`flex-1 py-3 text-[14px] font-bold transition-all border-b-2 ${activeTab === "vouchers" ? "text-[#8f0012] border-[#8f0012]" : "text-gray-400 border-transparent"}`}
              >
                Voucher
              </button>
              <button
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
              <Button
                fullWidth
                onClick={() => setShowVouchers(false)}
                className="bg-[#8f0012] h-12 rounded-xl font-bold mt-6"
              >
                Xác nhận
              </Button>
            </Box>
          </Box>
        </Sheet>

        {/* Order Summary */}
        <Box className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
          <Text className="text-[15px] font-bold text-gray-800 mb-2">Tóm tắt đơn hàng</Text>
          <Box className="flex justify-between items-center text-[14px]">
            <Text className="text-gray-500">Tạm tính</Text>
            <Text className="font-semibold text-gray-800">{subtotal.toLocaleString()}đ</Text>
          </Box>
          <Box className="flex justify-between items-center text-[14px]">
            <Text className="text-gray-500">Phí vận chuyển</Text>
            <Text className="font-semibold text-gray-800">{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}đ`}</Text>
          </Box>
          <Box className="flex justify-between items-center text-[14px]">
            <Text className="text-gray-500">Giảm giá voucher</Text>
            <Text className="font-semibold text-[#8f0012]">{discount > 0 ? `-${discount.toLocaleString()}đ` : "0đ"}</Text>
          </Box>
          <Box className="pt-3 border-t border-gray-50 flex justify-between items-center">
            <Text className="text-[15px] font-bold text-gray-800">Tổng cộng</Text>
            <Text className="text-[18px] font-bold text-[#8f0012]">{finalTotal.toLocaleString()}đ</Text>
          </Box>
        </Box>

        {/* Banner Decoration */}
        <Box className="rounded-2xl overflow-hidden shadow-sm">
          <img
            src="https://lh3.googleusercontent.com/aida/ADBb0uj_8Z8_6v_nZ_u_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v"
            className="w-full h-auto"
            alt="Banner"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />

        </Box>
      </main>

      {/* Bottom Action Bar */}
      <Box className="fixed  bottom-0 left-0 right-0 bg-white p-4 pb-8 border-t border-gray-100 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
        <Box>
          <Text className="text-[12px] text-gray-400">Tổng tiền thanh toán</Text>
          <Text className="text-[22px] font-bold text-[#8f0012]">{finalTotal.toLocaleString()}đ</Text>
        </Box>
        <Button
          onClick={() => navigate("/checkout")}
          className="bg-[#8f0012] h-14 px-8 rounded-2xl flex items-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <span style={{ display: 'flex', alignItems: 'center' }} >
            <span className="text-[16px] font-bold text-white">Thanh toán</span>

          </span>
        </Button>
      </Box>
    </Page>
  );
};

export default Cart;
