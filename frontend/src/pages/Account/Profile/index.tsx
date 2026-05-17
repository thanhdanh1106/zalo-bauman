import { RootState } from "@shared/store";
import { ZaloUser } from "@shared/types/zmp";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserInfo, openShareSheet } from "zmp-sdk/apis";
import { Page, Text, Modal, Box, Button } from "zmp-ui";
import { logout } from "@shared/store/slices/authSlice";
import { getUserPoints } from "@shared/utils/Rewards";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { instance } from "@shared/utils/axiosInstance";
import Login from "../../Auth/Login";

const AccountProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [userInfo, setUserInfo] = useState<ZaloUser | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(0);
  const [membership, setMembership] = useState<any>(null);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>("");
  const [qrLoading, setQrLoading] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getUser();
    fetchPoints();
    fetchQR();
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await instance.get('/notifications/unread-count');
      if (res.data && res.data.error === false) {
        setUnreadNotifCount(res.data.count);
      }
    } catch (e) { }
  };

  const fetchPoints = async () => {
    setPointsLoading(true);
    try {
      const res = await getUserPoints();
      if (res && !res.error) {
        setPointsBalance(res.data?.balance_int ?? 0);
        setMembership(res.data?.membership);
        setAffiliate(res.data?.affiliate);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setPointsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (affiliate?.referral_link) {
      navigator.clipboard.writeText(affiliate.referral_link);
      alert("Đã sao chép link giới thiệu!");
    }
  };

  const fetchQR = async () => {
    if (!qrSvg) {
      setQrLoading(true);
      try {
        const { apiClient } = await import('@shared/services/authService');
        const res = await apiClient.get('/account/affiliate/qr').then(r => r.data);
        if (res && !res.error) {
          setQrSvg(res.data.svg);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setQrLoading(false);
      }
    }
  };

  const handleZaloShare = async () => {
    if (affiliate?.referral_link) {
      try {
        await openShareSheet({
          type: "link",
          data: {
            link: affiliate.referral_link,
            title: "Mời bạn tham gia cùng tôi!",
            description: "Nhận ưu đãi đặc quyền khi đăng ký qua link này.",
            thumbnail: "https://lh3.googleusercontent.com/aida/ADBb0uiZcunpRn4Wavs-U_I1mnSMvFdBKcrhIqztzw7iox55Z4-LnNQPvmFefGsbFMd8XB9fswLGCyrsyEUv2NyPY5wgOFVDdLbBfgPghZH-2oGTCM5e6pnjI5YbcW3NoQQkvsHkPFDIQdRIUnPmSIXsEYVXRkvlrBCALKkO59kH1sZDtFq64wroM17w0geVKHJspDkg6BwrroEGVoklRHYfmvCHQU5kfZ4ZofckNOt26iXEkMmqZHtQ158AvmV-4YxA3b-W_pD7dNZ4xA"
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getUser = async () => {
    try {
      const data = await getUserInfo({});
      setUserInfo(data.userInfo as ZaloUser);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("li_at");
    window.location.href = "/";
  };

  if (!user) {
    return <Login />;
  }

  const menuItems = [
    {
      id: "orders",
      title: "Đơn hàng của tôi",
      iconName: "inventory_2",
      path: "/account/orders",
    },
    {
      id: "notifications",
      title: "Thông báo",
      iconName: "notifications",
      path: "/notifications",
      badge: unreadNotifCount > 0 ? unreadNotifCount : null,
    },
    {
      id: "wishlist",
      title: "Sản phẩm yêu thích",
      iconName: "favorite",
      path: "/account/wishlist",
    },
    {
      id: "addresses",
      title: "Địa chỉ nhận hàng",
      iconName: "location_on",
      path: "/account/addresses",
    },

  ];

  return (
    <Page className="bg-[#f6f3f2] min-h-screen pb-32">

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Profile Header Section */}
        <section className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#b32025] p-1 bg-white">
              <img
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                src={user?.avatar_url ? getThumbnailUrl(user.avatar_url) : (userInfo?.avatar || "https://lh3.googleusercontent.com/aida/ADBb0uiZcunpRn4Wavs-U_I1mnSMvFdBKcrhIqztzw7iox55Z4-LnNQPvmFefGsbFMd8XB9fswLGCyrsyEUv2NyPY5wgOFVDdLbBfgPghZH-2oGTCM5e6pnjI5YbcW3NoQQkvsHkPFDIQdRIUnPmSIXsEYVXRkvlrBCALKkO59kH1sZDtFq64wroM17w0geVKHJspDkg6BwrroEGVoklRHYfmvCHQU5kfZ4ZofckNOt26iXEkMmqZHtQ158AvmV-4YxA3b-W_pD7dNZ4xA")}
              />
            </div>
            <button
              onClick={() => navigate("/account/edit-profile")}
              className="absolute bottom-0 right-0 bg-[#8f0012] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-[20px] font-bold text-on-surface">
              {user?.name || userInfo?.name || "Khách hàng"}
            </h2>
            <div className="inline-flex items-center px-3 py-1 mt-1 rounded-full bg-[#8f0012]/10 text-[#8f0012] border border-[#8f0012]/20">
              <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="text-[12px] font-semibold">{pointsLoading ? "..." : (membership?.current_tier || "Thành viên")}</span>
            </div>
          </div>
        </section>

        {/* Loyalty Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8f0012] to-[#b32025] p-6 text-white shadow-[0_15px_35px_-5px_rgba(143,0,18,0.05)]">

          <div className="relative z-10">
            <p className="text-[12px] font-semibold uppercase tracking-widest opacity-80">Điểm tích lũy hiện có</p>
            <div className="flex items-baseline mt-2">
              <span className="text-[32px] font-bold">{pointsLoading ? "..." : pointsBalance.toLocaleString("vi-VN")}</span>
              <span className="ml-2 text-[14px] opacity-90">điểm</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => navigate("/account/points-history")}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors"
              >
                Lịch sử điểm
              </button>
              <button
                onClick={() => navigate("/account/rewards")}
                className="px-4 py-2 bg-white text-[#8f0012] rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform"
              >
                Đổi quà ngay
              </button>
            </div>
          </div>
        </section>

        {/* Affiliate Section */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className=" items-center justify-between">
            <h3 className="text-[18px] mb-2 font-bold text-[#8f0012] flex items-center">
              <span className="material-symbols-outlined mr-2">share_reviews</span>
              Chương trình cộng tác
            </h3>

          </div>
          <p className="text-[#5a403e] text-[14px]">Chia sẻ link giới thiệu của bạn để nhận thêm điểm thưởng và ưu đãi đặc quyền.</p>
          <div className="flex items-center space-x-2 p-3 bg-[#f6f3f2] rounded-xl border border-gray-100">
            <span className="text-xs truncate text-[#5a403e] flex-1">{affiliate?.referral_link || "Đang tải..."}</span>
            <button onClick={handleCopyLink} className="text-[#8f0012] hover:bg-[#8f0012]/5 p-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined">content_copy</span>
            </button>
          </div>

          {/* Inline QR Code below the referral link */}
          <div className="flex flex-col items-center justify-center py-4 bg-[#f6f3f2]/40 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-gray-500 mb-2">Mã QR Giới Thiệu</span>
            {qrLoading ? (
              <div className="w-40 h-40 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">Đang tạo mã...</span>
              </div>
            ) : qrSvg ? (
              <div
                className="w-40 h-40 bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              <span className="text-gray-400 text-xs">Không thể tải mã QR</span>
            )}
            <p className="mt-2 text-[11px] text-gray-500 text-center px-4 leading-relaxed">
              Khách hàng quét mã này sẽ được ghi nhận là cấp dưới của bạn.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleCopyLink} className="flex items-center justify-center space-x-2 py-3 bg-white border border-gray-200 rounded-xl font-semibold hover:bg-neutral-50 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[#8f0012]">content_copy</span>
              <span className="text-[12px] font-bold">Copy Link</span>
            </button>
            <button onClick={handleZaloShare} className="flex items-center justify-center space-x-2 py-3 bg-[#b32025] text-white rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm">
              <img
                alt="Zalo"
                className="w-5 h-5 object-contain invert brightness-0"
                src="https://lh3.googleusercontent.com/aida/ADBb0ujDq6JnMBfE75CRjC_FeG7nN508SbtHRWfSIFVPZPlBg8WmUd8DMKWWEE0Hoz_QtmB2it_gtVd_n--81XeD2XU3cY1TvA4YX6QAXsqTM0TDss_xdZaURGS8NO1IpqGRYgNsAOGXcQkdXLE-8edvziZknPh9Ut5W_V35e2T7m1KPMTYfcZg8SJEaM9nCsoAGzHzRi5w-g012384FckvGc37R1LnBH3r-09SG--M_kBCfJT4ufb1paylrOY7oP8tmrO30jYW60XgJEw"
              />
              <span className="text-[12px] font-bold">Zalo Share</span>
            </button>
          </div>
        </section>

        {/* Menu Section */}
        <section className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="divide-y divide-gray-50">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center p-4 hover:bg-neutral-50 transition-colors active:bg-neutral-100 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#8f0012]/5 text-[#8f0012] flex items-center justify-center mr-4">
                  <span className="material-symbols-outlined">{item.iconName}</span>
                </div>
                <span className="flex-1 text-[16px] font-medium text-[#1c1b1b]">{item.title}</span>
                {item.badge && (
                  <span className="bg-[#8f0012] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                <span className="material-symbols-outlined text-neutral-300">chevron_right</span>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="w-full py-4 text-[#ba1a1a] font-semibold flex items-center justify-center space-x-2 active:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Đăng xuất</span>
        </button>
      </main>
    </Page>
  );
};

export default AccountProfile;
