import SocialButton from '@shared/components/SocialButton';
import { useToasterContext } from '@shared/components/ToasterContext';
import { sessionProps } from '@shared/types/auth';
import { changeUserPassword } from '@shared/utils/Auth';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaKey, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import message from '@shared/utils/message.json';

interface NewPasswordData {
  password_confirmation: string;
  password: string;
}

const NewPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showMessage } = useToasterContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { token } = useParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NewPasswordData>({
    defaultValues: {
      password_confirmation: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: NewPasswordData) => {
    try {
      setIsLoading(true);
      const response: { data: sessionProps } = await changeUserPassword({
        ...data,
        token: token,
      });
      if (response && response.data) {
        showMessage('success', message.auth.reset_successful);
        navigate('/');
      } else {
        showMessage('error', message.auth.reset_failed);
      }
    } catch (error) {
      showMessage('error', message.auth.reset_failed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-[#eee] rounded-full mb-4">
              <FaKey className="text-2xl text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary font-serif mb-2">
              Tạo mật khẩu mới
            </h1>
            <p className="text-gray-500">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-background rounded-2xl shadow-xl p-8 border border-[#eee]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-primary font-serif mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Vui lòng nhập mật khẩu mới!',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự.',
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-surface border border-[#eee] text-primary font-serif placeholder-[#6b7280] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-colors ${
                          errors.password ? 'border-red-500' : 'border-[#eee]'
                        }`}
                        placeholder="Nhập mật khẩu mới"
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-primary transition-colors" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-primary font-serif mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <Controller
                    name="password_confirmation"
                    control={control}
                    rules={{
                      required: 'Vui lòng xác nhận mật khẩu!',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự.',
                      },
                      validate: (value) =>
                        value === passwordValue || 'Mật khẩu xác nhận không khớp!',
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-surface border border-[#eee] text-primary font-serif placeholder-[#6b7280] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-colors ${
                          errors.password_confirmation ? 'border-red-500' : 'border-[#eee]'
                        }`}
                        placeholder="Nhập lại mật khẩu mới"
                        autoComplete="new-password"
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-primary transition-colors" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-[#b8a06a] disabled:bg-[#6b7280] text-[#181a1b] font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Đặt lại mật khẩu'
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

export default NewPassword;


