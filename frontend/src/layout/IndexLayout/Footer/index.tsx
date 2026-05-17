import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "@shared/utils/axiosInstance";

const Footer = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const bottomNavItems = [
    { title: "Trang chủ", path: "/", icon: "home" },
    { title: "Sản phẩm", path: "/products", icon: "grid_view" },
    { title: "Cẩm nang", path: "/blog", icon: "menu_book" },
    { title: "Giỏ hàng", path: "/cart", icon: "shopping_cart" },
    { title: "Tài khoản", path: "/account", icon: "person" },
  ];

  const fetchUnreadCount = async () => {
    try {
      const res = await instance.get('/notifications/unread-count');
      if (res.data && res.data.error === false) {
        setUnreadCount(res.data.count);
      }
    } catch (e) {
      console.error("Error fetching unread count in footer:", e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Listen to custom notification update events
    const handleNotificationUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener('notification-updated', handleNotificationUpdate);
    window.addEventListener('mark-all-read', handleNotificationUpdate);

    return () => {
      window.removeEventListener('notification-updated', handleNotificationUpdate);
      window.removeEventListener('mark-all-read', handleNotificationUpdate);
    };
  }, []);

  // Also fetch unread count when location changes to ensure absolute consistency
  useEffect(() => {
    fetchUnreadCount();
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation - ZMP Style */}
      <nav className="fixed max-w-[768px] w-full bottom-0 left-0 right-0 -translate-x-1/2 bg-white/90 backdrop-blur-lg border-t border-[#EEEEEE] z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.04)] rounded-t-xl" style={{ left: "50%" }}>
        <div className="flex items-center justify-around py-3 pb-safe">
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                  active ? "text-primary scale-110" : "text-slate-400 hover:text-primary"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span className={`material-symbols-outlined ${active ? 'icon-fill' : ''}`} style={{ fontSize: '24px' }}>
                    {item.icon}
                  </span>
                  {item.path === "/account" && unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
                  )}
                </div>
                <span
                  className="font-serif text-[10px] font-semibold mt-1"
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Spacing */}
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default Footer;
