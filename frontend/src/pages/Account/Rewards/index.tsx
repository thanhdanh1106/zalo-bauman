import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Page } from "zmp-ui";
import { RootState } from "@shared/store";
import { findManyRewards, getUserPoints, redeemReward } from "@shared/utils/Rewards";
import PageLoading from "@shared/components/PageLoading";

interface RewardItem {
  id: number;
  name: string;
  description: string;
  points: number;
  image: string;
  category: "voucher" | "product" | "service";
  badge?: string;
  outOfStock?: boolean;
}

const categories = [
  { key: "all", label: "Tất cả" },
  { key: "voucher", label: "Voucher" },
  { key: "product", label: "Sản phẩm" },
  { key: "service", label: "Dịch vụ" },
];

const RewardsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [membership, setMembership] = useState<any>(null);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const progressPercent = membership?.progress_percent ?? 0;
  const pointsToNextTier = membership?.points_to_next_tier ?? 0;
  const currentTierLabel = membership?.current_tier || "Hội viên";
  const nextTierLabel = membership?.next_tier || "";

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pointsRes, rewardsRes] = await Promise.all([
        getUserPoints(),
        findManyRewards({ per_page: 50 }),
      ]);

      if (pointsRes && !pointsRes.error) {
        setUserPoints(pointsRes.data?.balance_int ?? 0);
        setMembership(pointsRes.data?.membership);
      }

      if (rewardsRes && !rewardsRes.error) {
        const data = Array.isArray(rewardsRes.data) ? rewardsRes.data : rewardsRes.data?.data || [];
        setRewards(
          data.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description || "",
            points: r.points || r.points_required || 0,
            image: r.image || "",
            category: r.category || "voucher",
            badge: r.badge || undefined,
            outOfStock: r.outOfStock || r.out_of_stock || false,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching rewards data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: RewardItem) => {
    if (reward.outOfStock || userPoints < reward.points || redeeming) return;

    setRedeeming(reward.id);
    try {
      const result = await redeemReward(reward.id);

      if (result && !result.error) {
        setToastMessage({ type: "success", text: `Đổi "${reward.name}" thành công!` });
        // Update local points
        setUserPoints((prev) => prev - reward.points);
        // Refresh data
        fetchData();
      } else {
        setToastMessage({ type: "error", text: result?.message || "Không thể đổi quà. Vui lòng thử lại." });
      }
    } catch (error) {
      setToastMessage({ type: "error", text: "Có lỗi xảy ra khi đổi quà." });
    } finally {
      setRedeeming(null);
    }
  };

  const filteredRewards =
    activeCategory === "all"
      ? rewards
      : rewards.filter((r) => r.category === activeCategory);

  const formatPoints = (pts: number) => pts.toLocaleString("vi-VN");

  const getRewardIcon = (reward: RewardItem) => {
    if (reward.category === "voucher" && !reward.image) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#fff5f5] to-[#ffe8e8] flex flex-col items-center justify-center">
          <span
            className="material-symbols-outlined text-[#b32025] text-[36px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            confirmation_number
          </span>
          <span className="text-[#b32025] font-bold text-[14px] mt-1">
            {reward.points >= 5000 ? `-${reward.points / 100}K` : `-${Math.floor(reward.points / 50)}K`}
          </span>
        </div>
      );
    }
    if (reward.category === "service" && !reward.image) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] flex flex-col items-center justify-center">
          <span
            className="material-symbols-outlined text-[#16a34a] text-[36px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            health_and_safety
          </span>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#fef3c7] to-[#fde68a] flex items-center justify-center">
        <span
          className="material-symbols-outlined text-[#92400e] text-[36px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          redeem
        </span>
      </div>
    );
  };

  if (loading) {
    return <PageLoading height={400} />;
  }

  return (
    <Page className="bg-[#f6f3f2] min-h-screen pb-32">

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className={`px-5 py-3 rounded-2xl shadow-lg text-white text-[13px] font-semibold flex items-center gap-2 ${toastMessage.type === "success" ? "bg-[#16a34a]" : "bg-[#b32025]"}`}>
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {toastMessage.type === "success" ? "check_circle" : "error"}
            </span>
            {toastMessage.text}
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 pt-5 space-y-5">
        {/* Member Points Card */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8f0012] to-[#b32025] p-6 text-white shadow-[0_15px_35px_-5px_rgba(143,0,18,0.15)]">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <span
                className="material-symbols-outlined text-[#fed65b] mr-2 text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="text-[12px] font-bold uppercase tracking-widest opacity-90">
                {currentTierLabel}
              </span>
            </div>

            <p className="text-[12px] opacity-80 mb-1">Số dư của bạn</p>
            <div className="flex items-baseline">
              <span className="text-[36px] font-extrabold leading-none">
                {formatPoints(userPoints)}
              </span>
              <span className="ml-2 text-[15px] opacity-80 font-medium">
                điểm
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fed65b] to-[#fbbf24] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] opacity-80 mt-2">
                {pointsToNextTier > 0 ? (
                  <>
                    Bạn cần thêm{" "}
                    <span className="font-bold text-[#fed65b]">
                      {formatPoints(pointsToNextTier)}
                    </span>{" "}
                    điểm để lên hạng {nextTierLabel}
                  </>
                ) : (
                  "Chúc mừng! Bạn đã đạt hạng cao nhất."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat.key
                  ? "bg-[#1c1b1b] text-white border-[#1c1b1b] shadow-sm"
                  : "bg-white text-[#5a403e] border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col transition-transform active:scale-[0.98] ${
                reward.outOfStock ? "opacity-75" : ""
              }`}
            >
              {/* Image / Icon area */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {reward.image ? (
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getRewardIcon(reward)
                )}

                {/* Badge */}
                {reward.badge && (
                  <div className="absolute top-2 left-2 bg-[#b32025] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {reward.badge}
                  </div>
                )}

                {/* Out of stock overlay */}
                {reward.outOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-[#1c1b1b]/80 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg">
                      HẾT HÀNG
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-[#b32025] text-[13px] font-bold mb-1">
                  {formatPoints(reward.points)} điểm
                </p>
                <p className="text-[#1c1b1b] text-[12px] font-medium leading-snug line-clamp-2 flex-1">
                  {reward.name}
                </p>

                {/* Action Button */}
                <button
                  disabled={reward.outOfStock || userPoints < reward.points || redeeming === reward.id}
                  onClick={() => handleRedeem(reward)}
                  className={`mt-3 w-full py-2 rounded-xl text-[12px] font-bold transition-all duration-200 active:scale-95 ${
                    redeeming === reward.id
                      ? "bg-[#8f0012] text-white cursor-wait"
                      : reward.outOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : userPoints < reward.points
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#b32025] text-white shadow-sm hover:bg-[#8f0012] active:shadow-none"
                  }`}
                >
                  {redeeming === reward.id
                    ? "Đang đổi..."
                    : reward.outOfStock
                    ? "Hết quà"
                    : userPoints < reward.points
                    ? "Không đủ điểm"
                    : "Đổi ngay"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRewards.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <span
              className="material-symbols-outlined text-gray-300 text-[48px] mb-3"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              redeem
            </span>
            <h3 className="text-[16px] font-bold text-[#1c1b1b] mb-1">
              Chưa có quà thưởng
            </h3>
            <p className="text-[13px] text-[#5a403e]">
              {rewards.length === 0
                ? "Hệ thống chưa có quà thưởng nào. Hãy quay lại sau nhé!"
                : "Danh mục này chưa có quà thưởng nào. Hãy quay lại sau nhé!"}
            </p>
          </div>
        )}

        {/* Points History Link */}
        <button
          onClick={() => navigate("/account/points-history")}
          className="w-full flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#8f0012]/5 flex items-center justify-center mr-3">
              <span className="material-symbols-outlined text-[#8f0012]">
                history
              </span>
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-[#1c1b1b]">
                Lịch sử đổi điểm
              </p>
              <p className="text-[12px] text-[#5a403e]">
                Xem lại các giao dịch đổi quà
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-300">
            chevron_right
          </span>
        </button>
      </main>
    </Page>
  );
};

export default RewardsPage;
