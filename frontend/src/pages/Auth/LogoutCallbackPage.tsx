// src/pages/LogoutCallbackPage.tsx
import PageLoading from '@shared/components/PageLoading';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaHome, FaSignOutAlt } from 'react-icons/fa';

const LogoutCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Đang đăng xuất...');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleLogoutCallback = () => {
      try {
        // Xóa tất cả dữ liệu authentication
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        setMessage('Đăng xuất thành công!');
        setSuccess(true);
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (err) {
        console.error('Logout callback error:', err);
        setError('Đăng xuất thất bại. Vui lòng thử lại.');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleLogoutCallback();
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
                <h2 className="text-xl font-bold text-primary font-serif mb-2">Lỗi Đăng Xuất</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button 
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-[#b8a06a] text-[#181a1b] font-semibold rounded-lg transition-colors"
                >
                  <FaHome className="mr-2" />
                  Về trang chủ
                </button>
              </>
            ) : success ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4">
                  <FaCheckCircle className="text-2xl text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-primary font-serif mb-2">{message}</h2>
                <p className="text-gray-500 mb-6">Đang chuyển hướng về trang chủ...</p>
                <div className="flex justify-center">
                  <div className="animate-pulse">
                    <FaSignOutAlt className="text-primary text-2xl" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-[#eee] rounded-full mb-4">
                  <FaSpinner className="text-2xl text-primary animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-primary font-serif mb-2">{message}</h2>
                <p className="text-gray-500 mb-6">Vui lòng đợi trong giây lát</p>
                <PageLoading height={60} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutCallbackPage;


