import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const bottomNavItems = [
    { title: "Trang chủ", path: "/", icon: "home" },
    { title: "Sản phẩm", path: "/products", icon: "grid_view" },
    { title: "Cẩm nang", path: "/blog", icon: "menu_book" },
        { title: "Giỏ hàng", path: "/cart", icon: "shopping_cart" },
    { title: "Tài khoản", path: "/account", icon: "person" },
  ];

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
                <span className={`material-symbols-outlined ${active ? 'icon-fill' : ''}`} style={{ fontSize: '24px' }}>
                  {item.icon}
                </span>
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
