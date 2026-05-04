import { openChatScreen } from "@shared/utils/Hooks";
import { useState } from "react";
import { followOA } from "zmp-sdk/apis";

const OaWidget = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowOA = async () => {
    try {
      setIsLoading(true);
      await followOA({
        id: import.meta.env.VITE_OA_ID, // Thay thế bằng OA ID thực tế
      });

      // Nếu không có lỗi, coi như thành công
      setIsFollowing(true);
      console.log("Đã follow OA thành công");
    } catch (error) {
      console.error("Lỗi khi follow OA:", error);
      // Có thể hiển thị toast hoặc thông báo lỗi cho user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1d1e] via-[#2a2d2e] to-[#1e2021] rounded-xl p-4 shadow-xl border border-[#cbb27c]/30 mb-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#cbb27c]/8 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-[#cbb27c]/15 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

      {/* Header */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#181a1b]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-primary font-serif text-sm">
              Bia Ngon AlphaX
            </h4>
            <p className="text-primary/80 text-xs">
              Nhận khuyến mãi & tư vấn sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex space-x-3">
        <button
          onClick={handleFollowOA}
          disabled={isLoading || isFollowing}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            isFollowing
              ? "bg-green-600/90 text-white cursor-default"
              : "bg-primary text-[#181a1b] hover:bg-[#d4b995] hover:scale-[1.02] active:scale-[0.98]"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </>
          ) : isFollowing ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Đã quan tâm</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Quan tâm</span>
            </>
          )}
        </button>

        <button
          onClick={() => openChatScreen("Xin chào, tôi cần tư vấn về sản phẩm")}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600/90 text-white rounded-lg text-sm font-medium hover:bg-blue-700/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <span>Tư vấn</span>
        </button>
      </div>

      {/* Success Message */}
      {isFollowing && (
        <div className="relative z-10 mt-3 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-green-400">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs">
              Cảm ơn bạn! Bạn sẽ nhận được thông báo khuyến mãi mới nhất.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OaWidget;


