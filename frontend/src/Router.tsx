import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ZMPRouter } from "zmp-ui";
// Import PageRoute configuration
import ErrorBoundary from "@shared/components/ErrorBoundary";
import IndexLayout from "@/layout/IndexLayout";
import About from "@/pages/About";
import AccountAddresses from "@/pages/Account/Addresses";
import AccountOrders from "@/pages/Account/Orders";
import AccountProfile from "@/pages/Account/Profile";
import PointsHistory from "@/pages/Account/PointsHistory";
import RewardsPage from "@/pages/Account/Rewards";
import Wishlist from "@/pages/Account/Wishlist";
import EditProfilePage from "@/pages/Account/EditProfile";
import Login from "@/pages/Auth/Login";
import Blog from "@/pages/Blog";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import OrderSuccess from "@/pages/OrderSuccess";
import Products from "@/pages/Products"; 
import ProductDetailed from "@/pages/Products/ProductDetail";
import Promotion from "@/pages/Promotion";
import PromotionDetailed from "@/pages/Promotion/DetailPromotion";
import ThankYou from "@/pages/ThankYou";
import AccountLayout from "./layout/AccountLayout";
import DetailBlog from "./pages/Blog/DetailBlog";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentPending from "./pages/PaymentPending";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotificationPage from "./pages/Notification";
import PopupManager from "@shared/components/PopupManager";

const Router = () => {
  return (
   <ZMPRouter>
      <PopupManager />
      <Routes>
        <Route
          path="/"
          element={<IndexLayout />}
          errorElement={<ErrorBoundary />}
        >
          {/* Trang chủ */}
          <Route index element={<Home />} />{" "}
          <Route path="login" element={<Login />} />
          {/* Các trang chính của trang web */}
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<DetailBlog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetailed />} />
          <Route path="promotion" element={<Promotion />} />
          <Route path="promotion/:slug" element={<PromotionDetailed />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:order_code" element={<OrderSuccess />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-pending" element={<PaymentPending />} />
          <Route path="payment-failed" element={<PaymentFailed />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="notifications" element={<NotificationPage />} />
          {/* Trang Tài khoản */}
          <Route
            path="/account"
            element={<AccountLayout />}
            errorElement={<ErrorBoundary />}
          >
            <Route index={true} element={<AccountProfile />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="points-history" element={<PointsHistory />} />
            <Route path="edit-profile" element={<EditProfilePage />} />
          </Route>
          {/* Trang 404 */}
          <Route path="*" element={<ErrorBoundary />} />
        </Route>
      </Routes>
    </ZMPRouter>
  );
};
export default Router;


