import { useToasterContext } from "@shared/components/ToasterContext";
import { userProps } from "@shared/types/user";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { useUserLabel } from "@shared/utils/useUserLabel";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Avatar, Badge, Tooltip } from "@mui/material";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserCell: React.FC<{ data: userProps }> = ({ data }) => {
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

  return (
    <div className="relative" ref={avatarRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-full relative" // Added relative for label positioning
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            isSpecialMember ? (
              <Tooltip title={memberLabel}>
                <VerifiedIcon className={labelColorClass} sx={{ width: 16 }} />
              </Tooltip>
            ) : (
              ""
            )
          }
        >
          <div
            className={classNames(
              "border-2 rounded-full p-[2px]",
              borderColorClass
            )}
          >
            <Avatar
              sx={{ width: 30, height: 30 }}
              src={getThumbnailUrl(data?.information?.avatar)}
            />
          </div>
        </Badge>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-800  max-w-[140px] line-clamp-1">
            {memberLabel && (
              <span
                className={classNames(
                  "inline-flex items-center rounded-full text-xs font-bold",
                  labelColorClass
                )}
              >
                {memberLabel}
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 ">{data?.email}</p>
        </div>
      </button>
    </div>
  );
};

export default UserCell;


