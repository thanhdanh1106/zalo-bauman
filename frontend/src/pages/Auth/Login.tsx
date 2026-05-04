import SocialButtonWrapper from "@shared/components/SocialButton";
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Premium Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8f0012]/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}


        {/* Login Card */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Chào mừng bạn</h2>
            <p className="text-xs text-gray-400">Đăng nhập nhanh chóng để nhận ưu đãi</p>
          </div>

          {/* Social Login Wrapper (Zalo Focus) */}
          <SocialButtonWrapper />

          {/* Compliance & Footer */}
          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-[11px] text-gray-400 leading-relaxed px-4">
              Bằng việc tiếp tục, bạn đồng ý với các{" "}
              <Link to="/terms" className="text-primary font-bold hover:underline">Điều khoản</Link>{" "}
              &{" "}
              <Link to="/privacy" className="text-primary font-bold hover:underline">Chính sách bảo mật</Link>{" "}
              của chúng tôi.
            </p>
          </div>
        </div>

        {/* Brand Motto */}
        <div className="mt-12 text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em] opacity-60">Ginseng Heritage • Premium Wellness</p>
        </div>
      </div>
    </section>
  );
};

export default Login;


