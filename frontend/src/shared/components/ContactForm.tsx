import { useToasterContext } from '@shared/components/ToasterContext';
import { createContactForm } from '@shared/utils/ContactForm';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSpinner, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

// Validation schema using Yup
const contactSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự'),
  last_name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
  title: yup
    .string()
    .required('Tiêu đề là bắt buộc')
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  body: yup
    .string()
    .required('Nội dung là bắt buộc')
    .min(10, 'Nội dung phải có ít nhất 10 ký tự'),
});

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  body: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

interface ToasterContextType {
  showMessage: (type: 'success' | 'error', message: string) => void;
  startProgress: () => void;
  completeProgress: (done: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showMessage, startProgress, completeProgress } =
    useToasterContext() as ToasterContextType;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true);
      startProgress();

      const response = await createContactForm(data);

      if (response && !response.error) {
        setIsSuccess(true);
        showMessage(
          'success',
          'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.'
        );
        reset(); // Clear form after successful submission
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showMessage(
          'error',
          response.message || 'Có lỗi xảy ra khi gửi liên hệ'
        );
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showMessage(
        'error',
        'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
      completeProgress(true);
    }
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary font-serif mb-2">
          Liên Hệ Với Chúng Tôi
        </h2>
        <p className="text-primary/70">
          Gửi tin nhắn cho chúng tôi và chúng tôi sẽ phản hồi sớm nhất có thể
        </p>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center">
          <FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" />
          <p className="text-green-400 font-medium">
            Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-primary font-serif mb-2">
              <FaUser className="inline mr-2 text-primary" />
              Họ *
            </label>
            <input
              {...register('first_name')}
              type="text"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-primary font-serif placeholder-[#cbb27c]/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.first_name
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-[#cbb27c]/30 focus:border-[#cbb27c] focus:ring-[#cbb27c]/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Nhập họ của bạn"
            />
            {errors.first_name && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-primary font-serif mb-2">
              <FaUser className="inline mr-2 text-primary" />
              Tên *
            </label>
            <input
              {...register('last_name')}
              type="text"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-primary font-serif placeholder-[#cbb27c]/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.last_name
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-[#cbb27c]/30 focus:border-[#cbb27c] focus:ring-[#cbb27c]/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Nhập tên của bạn"
            />
            {errors.last_name && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-primary font-serif mb-2">
              <FaEnvelope className="inline mr-2 text-primary" />
              Email *
            </label>
            <input
              {...register('email')}
              type="email"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-primary font-serif placeholder-[#cbb27c]/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-[#cbb27c]/30 focus:border-[#cbb27c] focus:ring-[#cbb27c]/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-primary font-serif mb-2">
              <FaPhone className="inline mr-2 text-primary" />
              Số điện thoại *
            </label>
            <input
              {...register('phone')}
              type="tel"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-primary font-serif placeholder-[#cbb27c]/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-[#cbb27c]/30 focus:border-[#cbb27c] focus:ring-[#cbb27c]/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="0123456789"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-primary font-serif mb-2">
            <FaEdit className="inline mr-2 text-primary" />
            Tiêu đề *
          </label>
          <input
            {...register('title')}
            type="text"
            disabled={isLoading}
            className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-primary font-serif placeholder-[#cbb27c]/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.title
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-[#cbb27c]/30 focus:border-[#cbb27c] focus:ring-[#cbb27c]/20'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Tiêu đề tin nhắn của bạn"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-primary font-serif mb-2">
            <FaEdit className="inline mr-2 text-primary" />
            Nội dung tin nhắn *
          </label>
          <textarea
            {...register('body')}
            rows={5}
            disabled={isLoading}
            className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-primary font-serif placeholder-[#cbb27c]/50 focus:outline-none focus:ring-2 transition-all duration-300 resize-vertical ${
              errors.body
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-[#cbb27c]/30 focus:border-[#cbb27c] focus:ring-[#cbb27c]/20'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Nhập nội dung tin nhắn của bạn..."
          />
          {errors.body && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
              {errors.body.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-3 py-3 rounded-lg font-semibold text-sm uppercase transition-all duration-300 ${
              isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-[#181a1b] hover:bg-primary/90 hover:shadow-lg hover:shadow-[#cbb27c]/20 transform hover:scale-[1.02]'
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="mr-3 animate-spin" />
                Đang gửi tin nhắn...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-3" />
                Gửi Tin Nhắn
              </>
            )}
          </button>
        </div>

        {/* Info Text */}
        <div className="text-center text-sm text-primary/60 mt-4">
          <p>
            Bằng cách gửi tin nhắn, bạn đồng ý với{' '}
            <span className="text-primary hover:underline cursor-pointer">
              Điều khoản dịch vụ
            </span>{' '}
            và{' '}
            <span className="text-primary hover:underline cursor-pointer">
              Chính sách bảo mật
            </span>{' '}
            của chúng tôi.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;


