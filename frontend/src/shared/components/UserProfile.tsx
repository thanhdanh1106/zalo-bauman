import { RootState } from "@shared/store";
import { ZaloUser } from "@shared/types/zmp";
import { getUserFullName } from "@shared/utils/Hooks";
import { useEffect, useState } from "react";
import {
  FaBoxes,
  FaChevronRight,
  FaHeart,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { getUserInfo } from "zmp-sdk/apis";
import { useNavigate } from "zmp-ui";

const quickActions = [
  {
    id: 1,
    title: "Sản phẩm",
    icon: FaBoxes,
    path: "/products",
  },
  {
    id: 2,
    title: "Yêu thích",
    icon: FaHeart,
    path: "/account/wishlist",
  },
  {
    id: 3,
    title: "Giỏ hàng",
    icon: FaShoppingCart,
    path: "/cart",
  },
  {
    id: 4,
    title: "Tài khoản",
    icon: FaUser,
    path: "/account",
  },
];

const UserProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [userInfo, setUserInfo] = useState<ZaloUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const data = await getUserInfo({});
      setUserInfo(data.userInfo as ZaloUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-surface border border-[#eee] border border-[#eee] rounded-lg p-4 m-4">
      {/* User Info Header */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary flex items-center justify-center">
          {userInfo?.avatar?.startsWith("http") ? (
            <img
              src={userInfo.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-[#181a1b]">
              {(userInfo?.name || getUserFullName(user) || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs text-gray-500">Xin chào,</span>
          </div>
          <h2 className="text-sm font-semibold text-primary font-serif truncate">
            {userInfo?.name ||
              getUserFullName(user) ||
              user?.email ||
              "Người dùng Zalo"}
          </h2>
          <p className="text-xs text-primary">Khách hàng thân thiết</p>
        </div>

        {/* Arrow Button */}
        <button
          onClick={() => navigate("/account")}
          className="w-8 h-8 bg-primary/10 border border-[#cbb27c]/30 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className="bg-background hover:bg-[#3a3d3e] border border-[#eee] rounded-lg p-3 text-center transition-colors"
              onClick={() => navigate(action.path)}
            >
              <div className="flex justify-center mb-2">
                <IconComponent className="text-primary text-lg" />
              </div>
              <span className="text-primary font-serif text-xs font-medium">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserProfile;


