import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken, getUserInfo } from "zmp-sdk/apis";
import { userLoginWithZalo } from "@shared/utils/Auth";
import { loginSuccess } from "@shared/store/slices/authSlice";
import { RootState } from "@shared/store";
import { setCookie } from "@shared/utils/Hooks";

export function useZaloAuth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Removed useEffect auto-login to prevent "tự map" (automatic mapping)
  // Users must now login explicitly via the UI
  /*
  useEffect(() => {
    // Only perform auto-login if not already logged in
    if (!user) {
      handleZaloLogin();
    }
  }, [user]);
  */

  const handleZaloLogin = async () => {
    try {
      let accessToken = "";
      let userInfo = {};

      try {
        // 1. Try to get real Zalo User Information
        const userInfoResponse = await getUserInfo({
          autoRequestPermission: true
        });
        userInfo = userInfoResponse.userInfo;
        
        // 2. Try to get real Zalo Access Token
        accessToken = await getAccessToken({});
      } catch (sdkError: any) {
        console.warn("Zalo SDK error:", sdkError);
        // If -1401, it's a session error
      }

      // Nếu không có token (chạy trên trình duyệt máy tính hoặc lỗi SDK), giả lập một token để test API
      if (!accessToken || accessToken === "") {
        // Only use mock token in development
        if (process.env.NODE_ENV === 'development') {
          accessToken = "mock_zalo_token_dev_stable_user"; 
          userInfo = {
            name: "Baumann Khách Vãng Lai",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYq4ZK0cnM89x0rkGvTdvHT9_sjBkRvRbWdg5HS3SIiQo2GM8YTvtu86MKroIpzwVNIXy9uaRsI0ciZxTk5uUExoMMB4bUOSAmkyMt7R2dmKZCb6vISzYgn9E4AxBjLhUKvKOZe-mwrkvKGzW0sMDtrbhuCwMGKX6PI9gU1WM5Dyd49S5yxYdHUBYUVvz_Kb_0BATL-sdYZYm1ExK4e1QC0nv_CvMkk_fwPxduyVWrLttpmyjry7PBdhROqRbPvoX9GCc1PfxUje4",
          };
        } else {
          console.error("Không thể lấy Zalo Access Token");
          return;
        }
      }

      // 3. Login to our backend
      const response = await userLoginWithZalo({
        zalo_token: accessToken,
        userInfo: userInfo
      });

      if (response && !response.error) {
        // The token is now handled inside loginSuccess reducer (setting cookies, etc.)
        dispatch(loginSuccess(response));
        
        // Also sync to localStorage for persistence across reloads if needed by other parts of the app
        const token = response.li_at || response.credentials?.access_token;
        if (token) {
          localStorage.setItem("li_at", token);
        }
        
        console.log("Automatic Zalo login successful");
      }
    } catch (error) {
      console.error("Automatic Zalo login failed:", error);
    }
  };

  return { handleZaloLogin };
}
