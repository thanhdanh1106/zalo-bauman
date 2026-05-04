import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Page } from "zmp-ui";
import { RootState } from "@shared/store";
import { getUserPoints, getPointsHistory } from "@shared/utils/Rewards";
import PageLoading from "@shared/components/PageLoading";

interface Transaction {
  id: number;
  type: "earn" | "spend";
  title: string;
  time: string;
  date: string;
  points: number;
}

const filterOptions = [
  { key: "all", label: "Tất cả" },
  { key: "earn", label: "Nhận điểm" },
  { key: "spend", label: "Tiêu điểm" },
];

// Removed local TIER_CONFIG and getTier as they are now handled by the backend

const getTransactionIcon = (title: string, type: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("đơn hàng") || lower.includes("mua")) return "shopping_cart";
  if (lower.includes("đổi quà") || lower.includes("voucher")) return "confirmation_number";
  if (lower.includes("sinh nhật")) return "redeem";
  if (lower.includes("điểm danh")) return "event_available";
  if (lower.includes("giới thiệu")) return "group_add";
  if (type === "spend") return "redeem";
  return "stars";
};

const PointsHistory: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [membership, setMembership] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pointsRes, historyRes] = await Promise.all([
        getUserPoints(),
        getPointsHistory({ per_page: 50 }),
      ]);

      if (pointsRes && !pointsRes.error) {
        setUserPoints(pointsRes.data?.balance_int ?? 0);
        setMembership(pointsRes.data?.membership);
      }

      if (historyRes && !historyRes.error && Array.isArray(historyRes.data)) {
        setTransactions(
          historyRes.data.map((tx: any) => ({
            id: tx.id,
            type: tx.type as "earn" | "spend",
            title: tx.title || (tx.type === "earn" ? "Nhận điểm" : "Tiêu điểm"),
            time: tx.time || "",
            date: tx.date || "",
            points: tx.points,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching points data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tierName = membership?.current_tier || "Thành viên";
  const progressPercent = membership?.progress_percent ?? 0;
  const pointsNeeded = membership?.points_to_next_tier ?? 0;
  const nextTierPoints = membership?.next_tier_min_points ?? 0;

  const formatPoints = (pts: number) =>
    (pts > 0 ? "+" : "") + pts.toLocaleString("vi-VN");

  const filteredTransactions =
    activeFilter === "all"
      ? transactions
      : transactions.filter((t) => t.type === activeFilter);

  if (loading) {
    return <PageLoading height={400} />;
  }

  return (
    <Page className="bg-[#f6f3f2] min-h-screen pb-32">

      <main className="max-w-md mx-auto px-4 pt-5 space-y-5">
        {/* Points Summary Card */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8f0012] to-[#b32025] p-6 text-white shadow-[0_15px_35px_-5px_rgba(143,0,18,0.15)]">
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5" />

          <div className="relative z-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">
              Tổng điểm hiện tại
            </p>
            <div className="flex items-baseline justify-center mt-2">
              <span className="text-[40px] font-extrabold leading-none">
                {userPoints.toLocaleString("vi-VN")}
              </span>
              <span className="ml-2 text-[15px] opacity-80 font-medium border border-white/30 px-2 py-0.5 rounded-full text-[12px]">
                điểm
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex justify-center space-x-3">
              <button
                onClick={() => navigate("/account/rewards")}
                className="px-5 py-2.5 bg-white text-[#8f0012] rounded-full text-[13px] font-bold shadow-md active:scale-95 transition-transform"
              >
                Đổi quà
              </button>
              <button className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-[13px] font-semibold active:scale-95 transition-transform">
                Tích điểm
              </button>
            </div>
          </div>
        </section>

        {/* Transaction History Header */}
        <div className="items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#1c1b1b] mb-4">
            Lịch sử giao dịch
          </h2>
          <div className="flex gap-1.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${activeFilter === opt.key
                  ? "bg-[#8f0012] text-white"
                  : "bg-white text-[#5a403e] border border-gray-200"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "earn"
                  ? "bg-[#f0fdf4] text-[#16a34a]"
                  : "bg-[#fff5f5] text-[#b32025]"
                  }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {getTransactionIcon(tx.title, tx.type)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1c1b1b] truncate">
                  {tx.title}
                </p>
                <p className="text-[12px] text-[#5a403e] mt-0.5">
                  {tx.time} • {tx.date}
                </p>
              </div>

              {/* Points */}
              <span
                className={`text-[16px] font-bold flex-shrink-0 ${tx.points > 0 ? "text-[#16a34a]" : "text-[#b32025]"
                  }`}
              >
                {formatPoints(tx.points)}
              </span>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <span
              className="material-symbols-outlined text-gray-300 text-[48px] mb-3"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              receipt_long
            </span>
            <h3 className="text-[16px] font-bold text-[#1c1b1b] mb-1">
              Chưa có giao dịch
            </h3>
            <p className="text-[13px] text-[#5a403e]">
              {transactions.length === 0
                ? "Bạn chưa có giao dịch nào. Hãy mua sắm để tích điểm!"
                : "Không tìm thấy giao dịch nào trong bộ lọc này."}
            </p>
          </div>
        )}

        {/* Tier Progress Card */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#8f0012] mb-2">
            Hạng {tierName}
          </h3>
          <p className="text-[13px] text-[#5a403e] leading-relaxed mb-4">
            {pointsNeeded > 0 ? (
              <>
                Bạn chỉ còn thiếu{" "}
                <span className="font-bold text-[#8f0012]">
                  {pointsNeeded.toLocaleString("vi-VN")}
                </span>{" "}
                điểm để duy trì hạng mức {tierName} trong năm tới.
              </>
            ) : (
              <>Chúc mừng! Bạn đã đạt hạng cao nhất.</>
            )}
          </p>

          {/* Progress bar */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8f0012] to-[#b32025] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-bold text-[#5a403e] uppercase tracking-wider">
                {userPoints.toLocaleString("vi-VN")} điểm
              </span>
              <span className="text-[10px] font-bold text-[#5a403e] uppercase tracking-wider">
                {nextTierPoints.toLocaleString("vi-VN")} điểm
              </span>
            </div>
          </div>
        </section>
      </main>
    </Page>
  );
};

export default PointsHistory;
