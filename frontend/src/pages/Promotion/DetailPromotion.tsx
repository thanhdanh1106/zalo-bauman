import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaHeart,
  FaPercent,
  FaShare,
} from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageLoading from "@shared/components/PageLoading";
import { useToasterContext } from "@shared/components/ToasterContext";
import { promotionProps } from "@shared/types/promotion";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { findOnePromotionByName } from "@shared/utils/Promotions";

const DetailPromotion: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showMessage } = useToasterContext();
  const [promotion, setPromotion] = useState<promotionProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPromotion = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await findOnePromotionByName(slug);

        if (response && !response.error) {
          setPromotion(response.data);
        } else {
          showMessage("error", "Không tìm thấy khuyến mãi");
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
        showMessage("error", "Có lỗi xảy ra khi tải khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [slug, showMessage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isPromotionActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: promotion?.title,
          text: promotion?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showMessage("success", "Link đã được sao chép!");
      } catch (error) {
        showMessage("error", "Không thể sao chép link");
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showMessage(
      "success",
      isLiked ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích"
    );
  };

  if (loading) {
    return <PageLoading height={500} />;
  }

  if (!promotion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-[#eee] rounded-full mb-4">
            <MdLocalOffer className="text-2xl text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary font-serif mb-2">
            Không tìm thấy khuyến mãi
          </h2>
          <p className="text-gray-500 mb-6">
            Khuyến mãi bạn đang tìm kiếm không tồn tại hoặc đã hết hạn
          </p>
          <Link
            to="/promotion"
            className="inline-flex items-center px-6 py-3 bg-primary text-[#181a1b] rounded-lg hover:bg-[#d4b995] transition-all duration-300 font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại trang khuyến mãi
          </Link>
        </div>
      </div>
    );
  }

  const isActive = isPromotionActive(promotion.start_date, promotion.end_date);
  const daysRemaining = getDaysRemaining(promotion.end_date);
  const thumbnailUrl = promotion?.thumbnail
    ? getThumbnailUrl(promotion.thumbnail)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-primary hover:text-[#d4b995] mb-8 transition-colors group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>

        <div className="bg-background border border-[#eee] rounded-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            {/* Background Image */}
            <div className="h-48 sm:h-64 md:h-96 bg-gradient-to-r from-[#cbb27c] to-[#d4b995] relative overflow-hidden">
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt={promotion.title}
                  className="w-full h-full object-cover opacity-30"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Content Overlay - Mobile optimized */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-center text-white w-full max-w-4xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  <FaPercent />
                  Khuyến Mãi Đặc Biệt
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                  {promotion.title}
                </h1>
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-sm sm:text-lg flex-wrap gap-2">
                  <span className="bg-red-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
                    <FaPercent className="text-xs" />
                    {promotion.discount}% OFF
                  </span>
                  <span
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-base ${
                      isActive ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {isActive ? "Đang diễn ra" : "Đã kết thúc"}
                  </span>
                  {isActive && daysRemaining > 0 && (
                    <span className="bg-orange-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
                      <FaClock className="text-xs" />
                      Còn {daysRemaining} ngày
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {/* Action Bar - Mobile optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#eee] gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  <span>Từ {formatDate(promotion.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-primary" />
                  <span>Đến {formatDate(promotion.end_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="text-primary" />
                  <span>{promotion.views} lượt xem</span>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-3">
                <button
                  onClick={handleLike}
                  className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 ${
                    isLiked
                      ? "bg-red-500/20 text-red-400 scale-110"
                      : "bg-surface border border-[#eee] text-gray-500 hover:bg-[#3a3d3e] hover:text-white"
                  }`}
                >
                  <FaHeart className="text-sm" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 sm:p-3 rounded-full bg-surface border border-[#eee] text-gray-500 hover:bg-[#3a3d3e] hover:text-white transition-all duration-300"
                >
                  <FaShare className="text-sm" />
                </button>
              </div>
            </div>

            {/* Promotion Code - Mobile optimized */}
            {promotion.promotion_code && (
              <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-[#cbb27c]/10 to-[#d4b995]/10 border border-[#cbb27c]/30 rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-primary font-serif mb-2">
                        Mã khuyến mãi
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Sử dụng mã này khi thanh toán để nhận ưu đãi
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary text-[#181a1b] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl tracking-wider">
                        {promotion.promotion_code}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            promotion.promotion_code
                          );
                          showMessage("success", "Đã sao chép mã khuyến mãi!");
                        }}
                        className="mt-2 text-xs text-primary hover:text-[#d4b995] transition-colors"
                      >
                        Nhấn để sao chép
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary font-serif mb-4">
                Mô tả khuyến mãi
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                {promotion.description}
              </p>
            </div>

            {/* Content */}
            {promotion.body && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary font-serif mb-6">
                  Chi tiết chương trình
                </h2>
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-gray-500 leading-relaxed [&>h2]:text-primary font-serif [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-4 [&>h3]:text-primary [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mt-4 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:space-y-2 [&>li]:text-gray-500 [&>p]:mb-4"
                    dangerouslySetInnerHTML={{ __html: promotion.body }}
                  />
                </div>
              </div>
            )}

            {/* Status Card */}
            <div className="bg-gradient-to-r from-[#1a1d20] to-[#2a2d2e] border border-[#eee] rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary mb-1">
                    {promotion.discount}%
                  </div>
                  <div className="text-sm text-gray-500">Mức giảm giá</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary mb-1">
                    {isActive ? (daysRemaining > 0 ? daysRemaining : "0") : "0"}
                  </div>
                  <div className="text-sm text-gray-500">Ngày còn lại</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary mb-1">
                    {promotion.views}
                  </div>
                  <div className="text-sm text-gray-500">Lượt xem</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isActive ? (
                <>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-[#d4b995] text-[#181a1b] font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <MdLocalOffer className="mr-2" />
                    Mua ngay để nhận ưu đãi
                  </Link>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center px-8 py-4 border border-[#cbb27c] text-primary hover:bg-primary hover:text-[#181a1b] font-semibold rounded-lg transition-all duration-300"
                  >
                    <FaShare className="mr-2" />
                    Chia sẻ với bạn bè
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center px-8 py-4 bg-gray-600 text-gray-300 font-bold rounded-lg cursor-not-allowed">
                    <FaClock className="mr-2" />
                    Khuyến mãi đã kết thúc
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Theo dõi chúng tôi để không bỏ lỡ các chương trình khuyến
                    mãi tiếp theo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Promotions */}
        <div className="mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary font-serif mb-4">
              Khuyến mãi <span className="text-primary">khác</span>
            </h2>
            <Link
              to="/promotion"
              className="inline-flex items-center text-primary hover:text-[#d4b995] transition-colors"
            >
              Xem tất cả khuyến mãi
              <FaArrowLeft className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPromotion;


