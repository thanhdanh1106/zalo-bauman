import { logout } from "@shared/store/slices/authSlice";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { useUserLabel } from "@shared/utils/useUserLabel";
import React from "react";
import {
  FaHeart,
  FaShoppingBag,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ScrollContainer from "react-indiana-drag-scroll";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { RootState } from "@shared/store";

import Login from "../../pages/Auth/Login";

const AccountLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Login />;
  }

  const {
    isSpecialMember,
    label: memberLabel,
    labelColorClass,
    borderColorClass,
  } = useUserLabel(user);

  const navigationItems = [
    {
      path: "/account",
      icon: FaTachometerAlt,
      label: "Tổng quan",
      description: "Thông tin tài khoản",
    },
    {
      path: "/account/orders",
      icon: FaShoppingBag,
      label: "Đơn hàng",
      description: "Theo dõi đơn hàng",
    },
    {
      path: "/account/wishlist",
      icon: FaHeart,
      label: "Yêu thích",
      description: "Sản phẩm đã lưu",
    },
  ];

  const isActivePath = (path: string) => {
    if (path === "/account") {
      return location.pathname === "/account";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f6f3f2]">
      <div className="max-w-7xl mx-auto lg:px-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-surface border border-[#eee] rounded-2xl border border-[#eee] overflow-hidden sticky top-8">
              {/* Desktop User Info Header */}
              <div className="p-6 border-b border-[#eee] bg-gradient-to-r from-[#cbb27c]/10 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`border-2 rounded-full p-0.5 ${borderColorClass}`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                        {user?.avatar_url ? (
                          <img
                            src={getThumbnailUrl(user.avatar_url)}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-[#181a1b]">
                            {user.name ? user.name[0].toUpperCase() : "U"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verified Badge */}
                    {isSpecialMember && (
                      <div className="absolute -bottom-1 -right-1 bg-surface border border-[#eee] rounded-full p-1 border-2 border-[#eee]">
                        <RiVerifiedBadgeFill
                          className={`w-4 h-4 ${labelColorClass}`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-primary font-serif truncate">
                        {user?.name || "Khách hàng"}
                      </h3>
                      {memberLabel && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${labelColorClass} bg-opacity-20 border`}
                        >
                          {memberLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation Menu */}
              <div className="p-4">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = isActivePath(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? "bg-primary text-[#181a1b] shadow-lg"
                            : "text-primary font-serif hover:bg-[#3a3d3e] hover:text-primary"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive
                              ? "text-[#181a1b]"
                              : "text-gray-500 group-hover:text-primary"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium text-sm ${
                              isActive ? "text-[#181a1b]" : "text-primary font-serif"
                            }`}
                          >
                            {item.label}
                          </div>
                          <div
                            className={`text-xs ${
                              isActive
                                ? "text-[#181a1b]/70"
                                : "text-gray-500 group-hover:text-primary/70"
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Desktop Logout Button */}
                <div className="mt-6 pt-4 border-t border-[#eee]">
                  <button
                    onClick={() => {
                      dispatch(logout());
                      localStorage.removeItem("li_at");
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200 group"
                  >
                    <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">Đăng xuất</div>
                      <div className="text-xs text-red-400/70 group-hover:text-red-300/70">
                        Thoát khỏi tài khoản
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 h-screen overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;


