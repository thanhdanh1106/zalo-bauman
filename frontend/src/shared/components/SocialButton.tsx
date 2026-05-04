import { loginSuccess } from "@shared/store/slices/authSlice";
import { userLoginWithZalo } from "@shared/utils/Auth";
import { useState } from "react";
import { SiZalo } from "react-icons/si";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCookie } from "@shared/utils/Hooks";
import api from "zmp-sdk";
import { useToasterContext } from "./ToasterContext";

const { login, getAccessToken, getUserInfo, authorize } = api;

const SocialButton = () => {
  const navigate = useNavigate();
  const { showMessage } = useToasterContext();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleZaloLogin = () => {
    try {
      setIsLoading(true);
      console.log("Bắt đầu đăng nhập Zalo...");
      
      // 1. Yêu cầu cấp quyền (Authorize)
      authorize({
        scopes: ["scope.userInfo"],
        success: () => {
          console.log("Cấp quyền thành công, đang lấy thông tin...");
          
          // 2. Lấy thông tin người dùng
          getUserInfo({
            success: (res) => {
              const userInfo = res.userInfo;
              console.log("Lấy userInfo thành công:", userInfo.name);

              // 3. Lấy Access Token
              getAccessToken({
                success: (accessToken) => {
                  console.log("Lấy Access Token thành công");
                  performBackendLogin(accessToken, userInfo);
                },
                fail: (err) => {
                  console.error("Lỗi getAccessToken:", err);
                  // Fallback cho môi trường dev nếu cần
                  if (window.location.hostname === "localhost" || window.location.hostname.includes("127.0.0.1")) {
                     performBackendLogin("mock_token_" + Date.now(), userInfo);
                  } else {
                     showMessage("error", `Lỗi lấy Token (${err.code}): ${err.message}`);
                     setIsLoading(false);
                  }
                }
              });
            },
            fail: (err) => {
              console.error("Lỗi getUserInfo:", err);
              showMessage("error", `Lỗi lấy thông tin (${err.code}): ${err.message}`);
              setIsLoading(false);
            }
          });
        },
        fail: (err) => {
          console.error("Lỗi authorize:", err);
          // Nếu không authorize được, vẫn thử lấy token xem sao
          getAccessToken({
            success: (accessToken) => performBackendLogin(accessToken, { name: "Người dùng Zalo", avatar: "" }),
            fail: () => {
              showMessage("error", `Lỗi xác thực (-1401): Vui lòng kiểm tra App ID trong app-config.json`);
              setIsLoading(false);
            }
          });
        }
      });
    } catch (error) {
      console.error("Zalo Login Exception:", error);
      setIsLoading(false);
    }
  };

  const performBackendLogin = async (accessToken: string, userInfo: any) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const referralId = searchParams.get('ref') || localStorage.getItem('referred_by');

      const response = await userLoginWithZalo({
        zalo_token: accessToken,
        userInfo: userInfo,
        referred_by: referralId
      });

      if (response && !response.error) {
        dispatch(loginSuccess(response));
        const token = response.li_at || response.credentials?.access_token;
        if (token) {
          localStorage.setItem("li_at", token);
        }
        localStorage.removeItem('referred_by');
        showMessage("success", "Đăng nhập Zalo thành công");
        navigate("/");
      } else {
        showMessage("error", response?.message || "Đăng nhập Zalo thất bại");
      }
    } catch (error: any) {
      console.error("Zalo Backend Login Error:", error);
      const backendMessage = error.response?.data?.message;
      showMessage("error", backendMessage || "Lỗi kết nối máy chủ (500)");
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
    </div>
  );
};

export default SocialButton;


