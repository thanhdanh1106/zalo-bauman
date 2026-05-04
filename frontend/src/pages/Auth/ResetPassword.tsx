import SocialButton from '@shared/components/SocialButton';
import { useToasterContext } from '@shared/components/ToasterContext';
import { loginStart } from '@shared/store/slices/authSlice';
import { sentPasswordReset } from '@shared/utils/Auth';
import message from '@shared/utils/message.json';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaBeer, FaEnvelope, FaArrowLeft, FaSpinner } from 'react-icons/fa';

interface ResetPasswordData {
  email: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showMessage } = useToasterContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      setIsLoading(true);
      dispatch(loginStart());
      const response: { error: boolean; message: string } =
        await sentPasswordReset({
          email: data.email,
        });
      if (response && !response.error) {
        showMessage('success', message.auth.reset_email_sent);
        setSecondsLeft(30);
      } else {
        showMessage('success', message.auth.reset_email_failed);
      }
    } catch (error) {
      showMessage('error', message.auth.reset_email_failed);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (secondsLeft === 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  return (
    <>
      <section className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-[#eee] rounded-full mb-4">
              <FaEnvelope className="text-2xl text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary font-serif mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-500">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-background rounded-2xl shadow-xl p-8 border border-[#eee]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-primary font-serif mb-2">
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Vui lòng nhập địa chỉ email!',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Địa chỉ email không hợp lệ'
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-surface border border-[#eee] text-primary font-serif placeholder-[#6b7280] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-colors ${
                          errors.email ? 'border-red-500' : 'border-[#eee]'
                        }`}
                        placeholder="Nhập địa chỉ email của bạn"
                      />
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || secondsLeft !== 0}
                  className="w-full bg-primary hover:bg-[#b8a06a] disabled:bg-[#6b7280] text-[#181a1b] font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Đang gửi...
                    </>
                  ) : secondsLeft !== 0 ? (
                    `Gửi lại sau ${secondsLeft}s`
                  ) : (
                    'Gửi liên kết đặt lại'
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#eee]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-gray-500">
                    Hoặc đăng nhập bằng
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <SocialButton />

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-[#b8a06a] transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Quay lại đăng nhập
              </Link>
            </div>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-[#b8a06a] transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;


