import ScrollToTop from "@shared/components/ScrollToTop";
import { getUser } from "@shared/services/authService";
import { setUser } from "@shared/store/slices/authSlice";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@shared/hooks/useAuth";
import { useZaloAuth } from "@shared/hooks/useZaloAuth";
import Footer from "./Footer";
import { setNavigationBarTitle } from "zmp-sdk/apis";

// Create context for LoginModal
interface LoginModalContextType {
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const LoginModalContext = createContext<
  LoginModalContextType | undefined
>(undefined);

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return context;
};

// Types for ChatComponents
type ChatComponentsProps = {
  currentUser: any;
  project: string;
  apiConfig: any;
  pusherConfig: any;
};

const IndexLayout = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  useAuth(null);
  useZaloAuth();

  const isMessagesRoute = useMemo(
    () => pathname.startsWith("/messages"),
    [pathname]
  );

  const hideFooterRoutes = ["/cart", "/checkout", "/account/edit-profile", "/account/addresses", "/account/wishlist"];

  const shouldHideFooter = useMemo(() => {
    if (isMessagesRoute) return true;
    if (hideFooterRoutes.includes(pathname)) return true;
    if (pathname.startsWith("/products/")) return true;
    if (pathname.startsWith("/blog/")) return true;
    if (pathname.startsWith("/order-success/")) return true;
    if (pathname.startsWith("/promotion/")) return true;
    return false;
  }, [isMessagesRoute, pathname]);

  const handleGetPageSettings = useCallback(async () => {
    // try {
    //   const schema = [...footerSchema.fields, ...headerSchema.fields];
    //   const fields = schema.map((val) => val.name);
    //   const response = await getSettings({
    //     settings: fields,
    //   });
    //   localStorage.setItem('appLayout', JSON.stringify(response));
    // } catch (error) {
    //   console.log('error', error);
    // }
  }, [dispatch]);

  // Fetch user information is already handled by useAuth(null) hook
  // which is called at the top of IndexLayout component.

  useEffect(() => {
    handleGetPageSettings();
  }, [handleGetPageSettings]);

  useEffect(() => {
    if (isMessagesRoute) return;

    let title = "Nhân sâm Baumann Wisconsin";

    if (pathname === "/") title = "Trang chủ";
    else if (pathname.startsWith("/products")) title = "Sản phẩm";
    else if (pathname.startsWith("/blog")) title = "Cẩm nang";
    else if (pathname.startsWith("/promotion")) title = "Khuyến mãi";
    else if (pathname.startsWith("/cart")) title = "Giỏ hàng";
    else if (pathname.startsWith("/checkout")) title = "Thanh toán";
    else if (pathname.startsWith("/order-success")) title = "Đặt hàng";
    else if (pathname.startsWith("/payment-success")) title = "Thanh toán";
    else if (pathname.startsWith("/payment-pending")) title = "Thanh toán";
    else if (pathname.startsWith("/payment-failed")) title = "Thanh toán";
    else if (pathname.startsWith("/account")) title = "Tài khoản";
    else if (pathname.startsWith("/notifications")) title = "Thông báo";
    else if (pathname.startsWith("/contact")) title = "Liên hệ";

    setNavigationBarTitle({ title });
  }, [isMessagesRoute, pathname]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message from iframe:', event.data);
      if (event.data.type === 'OPTIONS_RECEIVED') {
        console.log('Iframe confirmed receiving OPTIONS');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="relative">
      {/* Use Zalo action bar header instead of custom UI header. */}
      <Outlet />
      {!shouldHideFooter && <Footer />}
      {!isMessagesRoute && <ScrollToTop />}
    </div>
  );
};

export default IndexLayout;


