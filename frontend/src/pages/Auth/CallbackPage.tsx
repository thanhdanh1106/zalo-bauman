// src/pages/CallbackPage.tsx
import PageLoading from '@shared/components/PageLoading';

import { isAuthenticated } from '@shared/services/authService';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaHome } from 'react-icons/fa';

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Kiểm tra xem user đã đăng nhập chưa
        if (isAuthenticated()) {
          console.log('User is authenticated, redirecting to home');
          setTimeout(() => navigate('/'), 2000);
        } else {
          console.log('User not authenticated, redirecting to login');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('Xác thực thất bại. Vui lòng thử lại.');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-background rounded-2xl shadow-xl p-8 border border-[#eee] text-center">
            {error ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900 rounded-full mb-4">
                  <FaExclamationTriangle className="text-2xl text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-primary font-serif mb-2">Lỗi Đăng Nhập</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button 
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-[#b8a06a] text-[#181a1b] font-semibold rounded-lg transition-colors"
                >
                  <FaHome className="mr-2" />
                  Về trang chủ
                </button>
              </>
            ) : loading ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-[#eee] rounded-full mb-4">
                  <FaSpinner className="text-2xl text-primary animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-primary font-serif mb-2">Đang xác thực...</h2>
                <p className="text-gray-500 mb-6">Vui lòng đợi trong giây lát</p>
                <PageLoading height={60} />
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4">
                  <FaCheckCircle className="text-2xl text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-primary font-serif mb-2">Đăng nhập thành công!</h2>
                <p className="text-gray-500 mb-6">Đang chuyển hướng...</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CallbackPage;


