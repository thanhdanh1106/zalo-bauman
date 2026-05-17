import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSettings } from "@shared/utils/Settings";
import { instance } from "@shared/utils/axiosInstance";

const HomeHeader = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>({});

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await getSettings({ settings: ['site_name', 'site_description', 'logo_id'] });
      if (res && !res.error && res.data) {
        setSettings(res.data);
      }
    };
    
    const fetchUnreadCount = async () => {
      try {
        const res = await instance.get('/notifications/unread-count');
        if (res.data && res.data.error === false) {
          setUnreadCount(res.data.count);
        }
      } catch (e) {}
    };

    fetchSettings();
    fetchUnreadCount();

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

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 flex justify-between items-center w-full px-4 h-20 transition-all">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="w-12 h-12 rounded-full border-2 border-secondary overflow-hidden flex items-center justify-center p-0.5">
          <img 
            alt={settings.site_name || "Logo"} 
            className="w-full h-full object-contain scale-150" 
            src={settings.logo_url || "https://lh3.googleusercontent.com/aida/ADBb0ui5429VN9syOrK8xyo7lxPRjCq-7aiZOF8NpYMqpuQn272QiWQ7z_xdH-jShFQMkYELkHb57naA5udL_yvBnyu8T2r3TF8DOmsPeXGEITunpGvlyUeBMG5uaoJHn7HyAlbbMmNpMQp4fYbdp_euVFk0wp5qdpSl6bBex3o_6809RpVro2oWDzOtF2PASPP4v-8vJ-B9QR5eXUfQk1oiT8Ax-z8y6i7BE-WcL8zhnVo_Ww96lFPYt0N3k8s-08v-Kv0v2YxrvCf8Gg"}
          />
        </Link>
        {/* Brand Info */}
        <div className="flex flex-col">
          <h1 className="font-serif font-extrabold text-base sm:text-lg leading-tight text-primary uppercase tracking-tight">
            {settings.site_name || "BAUMANN"}
          </h1>
          <p className="font-serif italic text-[9px] sm:text-[10px] text-on-surface-variant font-medium">
            {settings.site_description || "Tinh hoa thảo dược"}
          </p>
        </div>
      </div>
      
      {/* Action Icons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate("/notifications")}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors relative"
        >
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8f0012] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse-slow">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => navigate("/cart")}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>shopping_cart</span>
        </button>
      </div>
    </header>
  );
};

const SubHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 flex justify-between items-center w-full px-4 h-20 transition-all">
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h1 className="text-primary font-serif font-extrabold text-base sm:text-lg leading-tight uppercase tracking-tight truncate flex-1">
          {title}
        </h1>
      </div>
      
      {/* Action Icons */}
      <div className="flex items-center gap-2 ml-4">
        {location.pathname === "/notifications" ? (
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('mark-all-read'))}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
            title="Đánh dấu tất cả là đã đọc"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">done_all</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate("/notifications")}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors relative"
          >
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>notifications</span>
          </button>
        )}
        {!isCartPage && (
          <button 
            onClick={() => navigate("/cart")}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>shopping_cart</span>
          </button>
        )}
      </div>
    </header>
  );
};

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/products") return "Sản phẩm nổi bật";
    if (path === "/blog") return "Cẩm nang sức khỏe";
    if (path === "/account") return "Cá nhân";
    if (path === "/notifications") return "Thông báo";
    if (path.startsWith("/products/")) return "Chi tiết sản phẩm";
    if (path === "/cart") return "Giỏ hàng của tôi";
    return "Nhân Sâm Baumann Wisconsin";
  };

  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return <HomeHeader />;
  }

  return <SubHeader title={getPageTitle()} />;
};

export default Header;
