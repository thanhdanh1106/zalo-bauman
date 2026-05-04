import { RootState } from "@shared/store";
import { Message } from "@shared/types/chat";
import { userProps } from "@shared/types/user";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { pusher } from "@shared/utils/Pusher";
import { useUserLabel } from "@shared/utils/useUserLabel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF8C00",
      light: "#FFA726",
      dark: "#E67E00",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f44336",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          textTransform: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  },
});

interface ExtendMessageProps extends Message {
  user: userProps;
  read: boolean;
}

const MessageNotification: React.FC<{ iconColor?: string }> = ({
  iconColor,
}) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<ExtendMessageProps[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (user) {
      const channel = pusher.subscribe(`receiver.${user.id}`);
      channel.bind(
        "App\\Events\\MessageReceiver",
        (data: ExtendMessageProps) => {
          setMessages((messages) => [...messages, { ...data, read: false }]);
        }
      );
      return () => {
        pusher.unsubscribe(`receiver.${user.id}`);
      };
    }
  }, [user]);

  useEffect(() => {
    const count = messages.filter((msg) => !msg.read).length;
    setUnreadCount(count);
  }, [messages]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({ ...msg, read: true }))
    );
  };

  const handleMarkOneAsRead = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id == id ? { ...msg, read: true } : msg))
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "message-popover" : undefined;

  return (
    <Fragment>
      <Tooltip
        title={
          unreadCount > 0
            ? `${unreadCount} ${t("new messages")}`
            : t("Nothing here!")
        }
      >
        <IconButton
          aria-label="show new messages"
          color="inherit"
          onClick={handleClick}
        >
          <Badge badgeContent={unreadCount} color="primary" overlap="circular">
            <NotificationsNoneIcon sx={{ color: iconColor || "#333" }} />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Popover for messages */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "90%", sm: 350 }, // Responsive width
              maxWidth: "100%",
              mt: 1, // Margin top from anchor
              maxHeight: "400px", // Limit height for scrolling
              overflowY: "auto", // Enable scrolling
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)", // Custom shadow
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
              {t("Notifications")}
            </Typography>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                size="small"
                color="primary"
                variant="outlined"
              >
                {t("Mark as read")}
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List sx={{ p: 0 }}>
            {messages.length > 0 ? (
              messages.map((msg) => {
                const {
                  isSpecialMember,
                  label: memberLabel,
                  labelColorClass,
                  borderColorClass,
                } = useUserLabel(msg.user);
                return (
                  <Link key={msg.id} to={`/messages/${msg.sender}`}>
                    <ListItem
                      disablePadding
                      sx={{
                        backgroundColor: msg.read
                          ? "transparent"
                          : theme.palette.grey[100] + "1A", // Light orange for unread
                        borderRadius: 1,
                        mb: 1,
                        "&:hover": {
                          backgroundColor: msg.read
                            ? "rgba(0,0,0,0.04)"
                            : theme.palette.primary.main + "1A",
                        },
                        cursor: "pointer",
                        transition: "background-color 0.2s ease-in-out",
                      }}
                      onClick={() => !msg.read && handleMarkOneAsRead(msg.id)} // Mark as read on click if unread
                    >
                      <ListItemText
                        primary={
                          <Box>
                            <Stack
                              sx={{ mb: 1 }}
                              alignItems={"center"}
                              direction="row"
                              spacing={1}
                            >
                              <Badge
                                overlap="circular"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                badgeContent={
                                  isSpecialMember ? (
                                    <Tooltip title={memberLabel}>
                                      <VerifiedIcon
                                        className={labelColorClass}
                                        sx={{ width: 16 }}
                                      />
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
                                    sx={{ width: 24, height: 24 }}
                                    src={getThumbnailUrl(
                                      msg.user?.information?.avatar
                                    )}
                                  />
                                </div>
                              </Badge>
                              <div className="flex-1">
                                <span
                                  className={classNames(
                                    "inline-flex items-center rounded-full text-xs font-bold",
                                    labelColorClass
                                  )}
                                >
                                  {memberLabel}
                                </span>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: 12,
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {msg.user?.email}
                                </Typography>
                              </div>
                            </Stack>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: msg.read ? "normal" : "bold",
                                color: msg.read
                                  ? theme.palette.text.secondary
                                  : theme.palette.text.primary,
                              }}
                            >
                              {msg.content}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(msg.created_at).fromNow()}
                          </Typography>
                        }
                        sx={{ pl: 2, py: 1 }}
                      />
                      {msg.read && (
                        <ListItemIcon sx={{ minWidth: 40, pr: 1 }}>
                          <CheckCircleOutlineIcon
                            color="action"
                            fontSize="small"
                          />
                        </ListItemIcon>
                      )}
                    </ListItem>
                  </Link>
                );
              })
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                {t("Yout don't have any message!")}
              </Typography>
            )}
          </List>
        </Box>
      </Popover>
    </Fragment>
  );
};

export default MessageNotification;


