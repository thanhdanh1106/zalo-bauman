import { userProps } from "@shared/types/user";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { useUserLabel } from "@shared/utils/useUserLabel";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Avatar, Badge, Tooltip } from "@mui/material";
import classNames from "classnames";

type Props = {
  data: userProps;
};

const UserAvatar = (props: Props) => {
  const { data } = props;
  const {
    isSpecialMember,
    label: memberLabel,
    labelColorClass,
    borderColorClass,
  } = useUserLabel(data);
  return (
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
  );
};

export default UserAvatar;


