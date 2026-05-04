import SocialButton from '@shared/components/SocialButton';
import { useToasterContext } from '@shared/components/ToasterContext';
import { userRegister } from '@shared/utils/Auth';

import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaBeer, FaEye, FaEyeSlash, FaLock, FaUser, FaEnvelope } from 'react-icons/fa';

interface RegisterFormData {
  name: string;
  username: string;
  password: string;
  password_confirmation: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showMessage } = useToasterContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      username: '',
      password: '',
      password_confirmation: '',
    },
    mode: 'onSubmit',
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await userRegister(data);

      if (response && !response.error) {
        showMessage('success', 'Account registration successful');
        navigate('/login');
      } else {
        showMessage('error', 'Your account has been taken');
      }
    } catch (error) {
      showMessage('error', 'Account registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary font-serif mb-2">
              Tạo tài khoản mới
            </h2>
            <p className="text-gray-500">
              Tham gia cộng đồng yêu thích bia cao cấp
            </p>
          </div>

          {/* Form */}
          <div className="bg-background rounded-2xl shadow-xl p-8 border border-[#eee]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-primary font-serif mb-2">
                  <FaUser className="inline mr-2 text-primary" />
                  Họ và tên
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Vui lòng nhập họ và tên' }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg bg-surface border border-[#eee] text-primary font-serif placeholder-[#6b7280] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-all duration-200 ${
                          errors.name ? 'border-red-500' : 'border-[#eee]'
                        }`}
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>
              {/* Username or Phone Field */}
              <div>
                <label className="block text-sm font-medium text-primary font-serif mb-2">
                  <FaUser className="inline mr-2 text-primary" />
                  Tên đăng nhập hoặc số điện thoại
                </label>
                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: 'Vui lòng nhập tên đăng nhập hoặc số điện thoại',
                    validate: (value) => {
                      // Check if it's a valid phone number (Vietnamese format)
                      const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
                      // Check if it's a valid username (alphanumeric, underscore, dot)
                      const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
                      
                      if (phoneRegex.test(value) || usernameRegex.test(value)) {
                        return true;
                      }
                      return 'Tên đăng nhập hoặc số điện thoại không hợp lệ';
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg bg-surface border border-[#eee] text-primary font-serif placeholder-[#6b7280] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-all duration-200 ${
                        errors.username ? 'border-red-500' : 'border-[#eee]'
                      }`}
                      placeholder="Nhập tên đăng nhập hoặc số điện thoại"
                    />
                  )}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-primary font-serif mb-2">
                  <FaLock className="inline mr-2 text-primary" />
                  Mật khẩu
                </label>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg bg-surface border border-[#eee] text-primary font-serif placeholder-[#6b7280] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-all duration-200 ${
                          errors.password ? 'border-red-500' : 'border-[#eee]'
                        }`}
                        placeholder="Nhập mật khẩu"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" />
                        )}
                      </button>
                    </div>
                  )}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-primary font-serif mb-2">
                  <FaLock className="inline mr-2 text-primary" />
                  Xác nhận mật khẩu
                </label>
                <Controller
                  name="password_confirmation"
                  control={control}
                  rules={{
                    required: 'Vui lòng xác nhận mật khẩu',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                    validate: (value) =>
                      value === password ||
                      'Mật khẩu xác nhận không khớp',
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg bg-surface border border-[#eee] text-primary font-serif placeholder-[#6b7280] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-all duration-200 ${
                          errors.password_confirmation ? 'border-red-500' : 'border-[#eee]'
                        }`}
                        placeholder="Nhập lại mật khẩu"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" />
                        )}
                      </button>
                    </div>
                  )}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-400">{errors.password_confirmation.message}</p>
                )}
              </div>
              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-4 w-4 text-primary focus:ring-[#cbb27c] border-[#eee] bg-surface border border-[#eee] rounded"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-500">
                  Tôi đồng ý với{' '}
                  <Link
                    to="/terms-and-conditions"
                    className="text-primary hover:text-[#b8a06a] underline transition-colors"
                  >
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-primary hover:text-[#b8a06a] underline transition-colors"
                  >
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-[#b8a06a] disabled:bg-[#6b7280] text-[#181a1b] py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#cbb27c] focus:ring-offset-2 focus:ring-offset-[#1a1d20] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#181a1b] mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Tạo tài khoản'
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#eee]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-gray-500">Hoặc đăng ký với</span>
                </div>
              </div>
              <div className="mt-4">
                <SocialButton />
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-[#b8a06a] font-medium underline transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;


