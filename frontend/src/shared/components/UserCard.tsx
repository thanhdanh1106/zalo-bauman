import { userProps } from "@shared/types/user";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { useUserLabel } from "@shared/utils/useUserLabel";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Avatar, Badge, Button, Tooltip } from "@mui/material";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PhoneQRCode from "./PhoneQRCode";

const UserCard = ({ data }: { data: userProps }) => {
  const { t } = useTranslation();
  const {
    isSpecialMember,
    label: memberLabel,
    labelColorClass,
    borderColorClass,
    isHasProfile,
  } = useUserLabel(data);

  const location = [
    data?.information?.city,
    data?.information?.state,
    data?.information?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800   mb-4">
        {t("Listed by")}
      </h3>
      <div className="flex items-center space-x-4 mb-4">
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
          <div className={classNames("border-2  rounded", borderColorClass)}>
            <Avatar
              sx={{ width: 70, height: 70, borderRadius: 0 }}
              className="rounded"
              src={getThumbnailUrl(data?.information?.avatar)}
            />
          </div>
        </Badge>
        <div className="text-left">
          <p className="text-base font-medium text-gray-800  max-w-[140px] line-clamp-1">
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
          <p className="text-sm text-gray-500 ">{data.email}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="w-[30px] h-[30px] text-slate-600  flex items-center justify-center rounded-full border border-gray-300  bg-white "
              to={`tel:${data?.information?.phone}`}
            >
              <FaPhoneAlt size={14} />
            </Link>

            <Link
              className="w-[30px] h-[30px] text-slate-600  flex items-center justify-center rounded-full border border-gray-300  bg-white "
              to={`mailto:${data.email}`}
            >
              <FaEnvelope size={14} />
            </Link>

            <Link
              className="w-[30px] h-[30px] text-slate-600  flex items-center justify-center rounded-full border border-gray-300  bg-white "
              to="/"
            >
              <FaGlobe size={14} />
            </Link>
          </div>
        </div>
      </div>
      {location ? (
        <p className="text-sm text-gray-500  flex items-center mb-3">
          <FaMapMarkerAlt className="mr-1" /> {location}
        </p>
      ) : (
        ""
      )}
      <div className="mt-5 space-y-3 py-3">
        {data.companies?.length ? (
          <Link to={`/showroom/${data.companies[0]?.title}`}>
            <Button fullWidth variant="text" size="small">
              {t("View showroom")}
            </Button>
          </Link>
        ) : (
          ""
        )}
        <PhoneQRCode phone={data?.information?.phone} />
      </div>
    </div>
  );
};

export default UserCard;


