import React, { useState, useEffect } from "react";
import { Page, Box, Text, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { instance } from "@shared/utils/axiosInstance";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface Notification {
  id: string;
  type: string;
  data: {
    title: string;
    message: string;
    type: string;
    icon: string;
    color: string;
    post_slug?: string;
    order_code?: string;
    promotion_slug?: string;
  };
  read_at: string | null;
  created_at: string;
}

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchNotifications = async (type = "all") => {
    setLoading(true);
    try {
      const res = await instance.get(`/notifications?type=${type}`);
      if (res && !res.error && res.data) {
        setNotifications(res.data.data.data); // Pagination data
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleGlobalMarkRead = () => {
      handleMarkAllRead();
    };
    window.addEventListener('mark-all-read', handleGlobalMarkRead);
    return () => window.removeEventListener('mark-all-read', handleGlobalMarkRead);
  }, []);

  const handleMarkAsRead = async (id: string, notif: Notification) => {
    try {
      if (!notif.read_at) {
        await instance.post(`/notifications/${id}/read`);
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
        );
      }

      // Handle Navigation based on notification type
      const { type, post_slug, order_code, promotion_slug } = notif.data;
      
      if (type === 'content' && post_slug) {
        navigate(`/blog/${post_slug}`);
      } else if (type === 'order') {
        navigate('/account/orders');
      } else if (type === 'promotion' && promotion_slug) {
        navigate(`/promotion/${promotion_slug}`);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await instance.post("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  const getIcon = (iconName: string) => {
    return <span className="material-symbols-outlined text-[24px]">{iconName}</span>;
  };

  return (
    <Page className="bg-[#F8F9FA] min-h-screen pb-20">
      {/* Header handled by IndexLayout */}
      
      {/* Banner */}
      <Box className="relative w-full h-40 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000" 
          alt="Promotion" 
          className="w-full h-full object-cover"
        />
        <Box className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
          <Text className="text-white text-xl font-bold mb-1">Ưu đãi độc quyền</Text>
          <Text className="text-white/80 text-sm">Khám phá sức khỏe từ tinh hoa thiên nhiên</Text>
        </Box>
      </Box>

      {/* Tabs */}
      <Box className="bg-white px-2 py-3 border-b border-gray-100 sticky top-20 z-40">
        <Box className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Tất cả" },
            { id: "promotion", label: "Khuyến mãi" },
            { id: "order", label: "Đơn hàng" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? "bg-[#8f0012] text-white shadow-md shadow-red-900/10" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </Box>
      </Box>

      {/* Content */}
      <Box className="px-4 py-4 space-y-4">
        {loading ? (
          <Box className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8f0012]"></div>
          </Box>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((notif) => (
              <Box 
                key={notif.id} 
                onClick={() => handleMarkAsRead(notif.id, notif)}
                className={`bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-50 transition-all active:scale-[0.98] relative ${!notif.read_at ? 'ring-1 ring-red-50' : 'opacity-80'}`}
              >
                <Box 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: notif.data.color + '20', color: notif.data.color }}
                >
                  {getIcon(notif.data.icon)}
                </Box>
                <Box className="flex-1 min-w-0">
                  <Box className="flex justify-between items-start mb-1">
                    <Text className={`text-sm font-bold truncate pr-4 ${!notif.read_at ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notif.data.title}
                    </Text>
                    <Text className="text-[10px] text-gray-400 whitespace-nowrap">
                      {dayjs(notif.created_at).fromNow()}
                    </Text>
                  </Box>
                  <Text size="small" className={`line-clamp-2 leading-relaxed ${!notif.read_at ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                    {notif.data.message}
                  </Text>
                </Box>
                {!notif.read_at && (
                  <div className="absolute right-4 bottom-4 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </Box>
            ))}
            
            <Box className="py-10 flex flex-col items-center opacity-40">
              <span className="material-symbols-outlined text-[32px] mb-2">notifications_off</span>
              <Text className="text-[13px] font-medium text-gray-500">Không còn thông báo cũ hơn</Text>
            </Box>
          </>
        ) : (
          <Box className="flex flex-col items-center justify-center py-20 text-center">
            <Box className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[40px] text-gray-300">notifications_off</span>
            </Box>
            <Text className="text-gray-400 font-medium">Bạn chưa có thông báo nào</Text>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default NotificationPage;
