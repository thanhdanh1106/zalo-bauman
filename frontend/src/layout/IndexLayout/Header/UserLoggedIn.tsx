import { useToasterContext } from "@shared/components/ToasterContext";
import { logout } from "@shared/services/authService";
import { userProps } from "@shared/types/user";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { useUserLabel } from "@shared/utils/useUserLabel";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { Avatar } from "@mui/material";
import {
  IoAnalytics,
  IoLogOutOutline,
  IoPersonCircleSharp,
  IoSettingsOutline,
} from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

interface NavLinkItem {
  to: string;
  icon: React.ElementType;
  text: string;
  type: "primary" | "secondary" | "danger";
}

const UserLoggedIn: React.FC<{ data: userProps }> = ({ data }) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { theme, showMessage } = useToasterContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    isSpecialMember,
    label: memberLabel,
    labelColorClass,
    borderColorClass,
  } = useUserLabel(data);

  // Unified navigation links based on user role
  const getNavigationLinks = (): NavLinkItem[] => {
    const baseLinks: NavLinkItem[] = [
      {
        to: "/account",
        icon: IoAnalytics,
        text: "Bảng điều khiển",
        type: "primary",
      },
      {
        to: "/account/profile",
        icon: IoPersonCircleSharp,
        text: "Hồ sơ cá nhân",
        type: "secondary",
      },
      {
        to: "/account/settings",
        icon: IoSettingsOutline,
        text: "Cài đặt",
        type: "secondary",
      },
    ];

    return baseLinks;
  };

  const navigationLinks = getNavigationLinks();

  const getLinkClassName = (
    type: "primary" | "secondary" | "danger"
  ): string => {
    switch (type) {
      case "primary":
        return "flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm";
      case "secondary":
        return "flex items-center w-full px-3 py-2 text-sm text-gray-700  rounded-md hover:bg-gray-100  transition-all duration-200";
      case "danger":
        return "flex items-center w-full px-3 py-2 text-sm text-red-600  rounded-md hover:bg-red-50  transition-all duration-200";
      default:
        return "flex items-center w-full px-3 py-2 text-sm text-gray-700  rounded-md hover:bg-gray-100  transition-all duration-200";
    }
  };

  return (
    <div className="relative" ref={avatarRef}>
      {/* Avatar Button - Optimized for top header */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100  transition-all duration-200 group"
      >
        {/* Avatar with Badge */}
        <div className="relative">
          <div className={`border-2 rounded-full p-0.5 ${borderColorClass}`}>
            <Avatar
              src={getThumbnailUrl(data?.information?.avatar)}
              className="!w-[20px] !h-[20px] !text-xs"
            >
              {data?.email?.charAt(0)}
            </Avatar>
          </div>
          {/* Verified Badge */}
          {isSpecialMember && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-white  rounded-full">
              <div
                className={`w-3 h-3 rounded-full flex items-center justify-center ${labelColorClass}`}
              >
                <RiVerifiedBadgeFill className={`w-3 h-3 ${labelColorClass}`} />
              </div>
            </div>
          )}
        </div>

        {/* User Info - Compact for header */}
        <div className="hidden lg:block text-left">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-gray-800  max-w-[100px] truncate">
              {data?.information?.first_name || "Người dùng"}
            </p>
            {memberLabel && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${labelColorClass}`}
              >
                {memberLabel}
              </span>
            )}
          </div>
        </div>

        {/* Dropdown Arrow - Smaller for header */}
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
            menuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu - Optimized for top header positioning */}
      {menuOpen && (
        <div className="absolute right-0 top-full w-full mt-1 bg-white  border border-gray-200  rounded-lg shadow-lg z-[9999] overflow-hidden">
          {/* User Info Header - Always visible for context */}
          <div className="px-3 py-2.5 border-b border-gray-200  bg-gray-50 ">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-800  truncate">
                {data?.information?.first_name || "Người dùng"}
              </p>
              {memberLabel && (
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${labelColorClass}`}
                >
                  {memberLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500  truncate">{data.email}</p>
          </div>

          {/* Navigation Links - Compact spacing */}
          <div className="p-1.5 space-y-0.5">
            {navigationLinks.map((linkItem) => {
              const IconComponent = linkItem.icon;
              return (
                <Link
                  key={linkItem.to}
                  to={linkItem.to}
                  className={getLinkClassName(linkItem.type)}
                  onClick={() => setMenuOpen(false)}
                >
                  <IconComponent className="mr-2.5 flex-shrink-0" size={16} />
                  <span className="text-sm">{linkItem.text}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="my-1.5 border-t border-gray-200 "></div>

            {/* Logout Button */}
            <button
              onClick={() => {
                setIsLoading(true);
                logout();
                setMenuOpen(false);
              }}
              disabled={isLoading}
              className={`${getLinkClassName("danger")} ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <IoLogOutOutline className="mr-2.5 flex-shrink-0" size={16} />
              <span className="text-sm">
                {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLoggedIn;


