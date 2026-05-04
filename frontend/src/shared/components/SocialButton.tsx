import { loginSuccess } from "@shared/store/slices/authSlice";
import { userLoginWithZalo } from "@shared/utils/Auth";
import { useState } from "react";
import { SiZalo } from "react-icons/si";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getUserInfo } from "zmp-sdk/apis";
import { useToasterContext } from "./ToasterContext";
import { setCookie } from "@shared/utils/Hooks";

const SocialButton = () => {
  const navigate = useNavigate();
  const { showMessage } = useToasterContext();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleZaloLogin = async () => {
    try {
      setIsLoading(true);
      
      // 1. Get User Info from Zalo - request permission if not granted
      const userInfoRes = await getUserInfo({
        autoRequestPermission: true
      });
      const userInfo = userInfoRes.userInfo;

      // 2. Get Access Token from Zalo
      let accessToken = "";
      try {
        accessToken = await getAccessToken({});
      } catch (tokenError: any) {
        console.error("Zalo SDK getAccessToken error:", tokenError);
        // If -1401, it means session is invalid or not authorized
        if (tokenError.code === -1401 || tokenError.code === -1402) {
          // You might want to call login() here if you have code exchange set up
          // For now, we'll try to continue with empty token and let backend handle it or show error
        }
      }
      
      // Fallback for test environment only in development
      if (!accessToken && process.env.NODE_ENV === 'development') {
        accessToken = "mock_access_token_" + Date.now();
      }

      if (!accessToken) {
        showMessage("error", "Không thể lấy Access Token từ Zalo");
        return;
      }

      // 3. Send to backend for authentication/registration
      const searchParams = new URLSearchParams(window.location.search);
      const referralId = searchParams.get('ref') || localStorage.getItem('referred_by');

      const response = await userLoginWithZalo({
        zalo_token: accessToken,
        userInfo: userInfo,
        referred_by: referralId
      });

      if (response && !response.error) {
        // Redux slice handles the cookie setting
        dispatch(loginSuccess(response));
        
        // Persist to localStorage for other utilities
        const token = response.li_at || response.credentials?.access_token;
        if (token) {
          localStorage.setItem("li_at", token);
        }

        localStorage.removeItem('referred_by'); // Clear after successful login
        showMessage("success", "Đăng nhập Zalo thành công");
        navigate("/");
      } else {
        showMessage("error", response?.message || "Đăng nhập Zalo thất bại");
      }
    } catch (error) {
      console.error("Zalo Login Error:", error);
      showMessage("error", "Không thể kết nối với Zalo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Zalo Login */}
      <button
        type="button"
        disabled={isLoading}
        onClick={handleZaloLogin}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#0068ff] bg-[#0068ff] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0052cc] focus:outline-none focus:ring-2 focus:ring-[#0068ff] focus:ring-offset-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
      >
        <SiZalo className="text-2xl" />
        <span>Đăng nhập bằng Zalo</span>
      </button>

      {/* Divider if multiple social options are needed later */}
      {/* <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
        </div>
      </div> */}
    </div>
  );
};

export default SocialButton;


