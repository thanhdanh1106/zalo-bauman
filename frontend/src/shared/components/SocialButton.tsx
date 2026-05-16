import { loginSuccess } from "@shared/store/slices/authSlice";
import { userLoginWithZalo } from "@shared/utils/Auth";
import { useState } from "react";
import { SiZalo } from "react-icons/si";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCookie } from "@shared/utils/Hooks";
import api from "zmp-sdk";
import { useToasterContext } from "./ToasterContext";
import { login as devLogin } from "@shared/services/authService";

const { getAccessToken, getUserInfo, authorize } = api;

const SocialButton = () => {
  const navigate = useNavigate();
  const { showMessage } = useToasterContext();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // --- DEV LOGIN STATE ---
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [devEmail, setDevEmail] = useState("");
  const [devPassword, setDevPassword] = useState("");
  const [devLoading, setDevLoading] = useState(false);
  const isDevMode = import.meta.env.VITE_DEV_LOGIN === "true";

  const handleZaloLogin = () => {
    try {
      setIsLoading(true);
      authorize({
        scopes: ["scope.userInfo"],
        success: () => {
          getUserInfo({
            success: (res) => {
              const userInfo = res.userInfo;
              getAccessToken({
                success: (accessToken) => {
                  performBackendLogin(accessToken, userInfo);
                },
                fail: (err) => {
                  if (window.location.hostname === "localhost" || window.location.hostname.includes("127.0.0.1")) {
                    performBackendLogin("mock_token_" + Date.now(), userInfo);
                  } else {
                    showMessage("error", `Loi lay Token (${err.code}): ${err.message}`);
                    setIsLoading(false);
                  }
                }
              });
            },
            fail: (err) => {
              showMessage("error", `Loi lay thong tin (${err.code}): ${err.message}`);
              setIsLoading(false);
            }
          });
        },
        fail: (err) => {
          getAccessToken({
            success: (accessToken) => performBackendLogin(accessToken, { name: "Nguoi dung Zalo", avatar: "" }),
            fail: () => {
              showMessage("error", `Loi xac thuc (-1401): Vui long kiem tra App ID trong app-config.json`);
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
      const referralId = searchParams.get("ref") || localStorage.getItem("affiliate_ref");
      const response = await userLoginWithZalo({
        zalo_token: accessToken,
        userInfo: userInfo,
        referred_by: referralId
      });
      if (response && !response.error) {
        dispatch(loginSuccess(response));
        const token = response.li_at || response.credentials?.access_token;
        if (token) localStorage.setItem("li_at", token);
        localStorage.removeItem("affiliate_ref");
        showMessage("success", "Dang nhap Zalo thanh cong");
        navigate("/");
      } else {
        showMessage("error", response?.message || "Dang nhap Zalo that bai");
      }
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      showMessage("error", backendMessage || "Loi ket noi may chu (500)");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DEV LOGIN HANDLER ---
  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDevLoading(true);
    try {
      const res = await devLogin(devEmail, devPassword);
      const { li_at, user } = res;
      dispatch(loginSuccess({
        user,
        li_at,
        credentials: { access_token: li_at, expires_in: 30 }
      } as any));
      localStorage.setItem("li_at", li_at);
      showMessage("success", `Dang nhap dev thanh cong: ${user.name}`);
      navigate("/");
    } catch (err: any) {
      showMessage("error", err.response?.data?.message || "Sai email/mat khau");
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={isLoading}
        onClick={handleZaloLogin}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#0068ff] bg-[#0068ff] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0052cc] focus:outline-none focus:ring-2 focus:ring-[#0068ff] focus:ring-offset-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
      >
        <SiZalo className="text-2xl" />
        <span>Dang nhap bang Zalo</span>
      </button>

      {/* DEV LOGIN - Chi hien khi VITE_DEV_LOGIN=true */}
      {isDevMode && (
        <div className="pt-2 border-t border-dashed border-gray-200">
          <button
            type="button"
            onClick={() => setShowDevLogin(!showDevLogin)}
            className="w-full text-[11px] text-gray-400 hover:text-gray-600 py-1 transition-colors"
          >
            {showDevLogin ? "[ an ]" : "[ DEV ] Dang nhap tai khoan"}
          </button>
          {showDevLogin && (
            <form onSubmit={handleDevLogin} className="mt-2 space-y-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">Che do dev - an truoc khi deploy</p>
              <input
                type="email"
                placeholder="Email admin"
                value={devEmail}
                onChange={e => setDevEmail(e.target.value)}
                required
                className="w-full text-sm border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                type="password"
                placeholder="Mat khau"
                value={devPassword}
                onChange={e => setDevPassword(e.target.value)}
                required
                className="w-full text-sm border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                type="submit"
                disabled={devLoading}
                className="w-full bg-gray-800 text-white text-sm py-1.5 rounded hover:bg-gray-700 disabled:opacity-60 transition-colors"
              >
                {devLoading ? "Dang dang nhap..." : "Dang nhap"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialButton;
