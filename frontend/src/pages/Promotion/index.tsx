import PageLoading from "@shared/components/PageLoading";
import { useToasterContext } from "@shared/components/ToasterContext";
import { metaProps } from "@shared/types/meta";
import { promotionProps } from "@shared/types/promotion";
import { filterProps } from "@shared/types/query";
import { filterParams } from "@shared/utils/Hooks";
import { findManyPromotions } from "@shared/utils/Promotions";
import { scrollToTop } from "@shared/utils/scrollUtils";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaFilter,
  FaFireAlt,
  FaPercentage,
  FaSearch,
  FaTags,
  FaTimes,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import SimplePromotionCard from "./Components/SimplePromotionCard";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validFrom: string;
  validTo: string; 
  image: string;
  category: string;
  featured: boolean;
  slug: string;
}

const Promotion: React.FC = () => {
  const { showMessage, startProgress, completeProgress } = useToasterContext();
  const [data, setData] = useState<promotionProps[]>([]);
  const [deleteItem, setDeleteItem] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInit, setPageInit] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [meta, setMeta] = useState<metaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: 0,
  });

  const [filter, setFilter] = useState<filterProps>({
    paged: 1,
    per_page: 12,
  });

  // Filter options
  const sortOptions = [
    { value: "", label: "Mặc định" },
    { value: "newest", label: "Mới nhất" },
    { value: "discount_desc", label: "Giảm giá cao nhất" },
    { value: "ending_soon", label: "Sắp hết hạn" },
  ];

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang diễn ra" },
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "expired", label: "Đã kết thúc" },
  ];

  const handleFindManyData = async (filter: Record<string, any>) => {
    try {
      startProgress();
      const query = filterParams(filter);
      setSearchParams(query);

      // Scroll to top when loading new data
      scrollToTop();

      const response = await findManyPromotions(query);
      if (response && !response.error) {
        const { data, meta } = response;
        setData(data);
        setMeta(meta);
      }
      setPageInit(true);
    } finally {
      completeProgress();
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilter = { ...filter, [key]: value, paged: 1 };
    setFilter(newFilter);
  };

  const clearAllFilters = () => {
    const newFilter = {
      search: "",
      order: "",
      status: "",
      paged: 1,
      per_page: 12,
    };
    setFilter(newFilter);
  };

  const hasActiveFilters = () => {
    return filter.search || filter.order || filter.status;
  };

  useEffect(() => {
    handleFindManyData(filter);
  }, []);

  useEffect(() => {
    if (pageInit) {
      handleFindManyData(filter);
    }
  }, [filter]);

  if (!pageInit) {
    return <PageLoading height={500} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative py-6 md:py-8 bg-gradient-to-br from-[#181a1b] via-[#2a2d2e] to-[#181a1b] overflow-hidden">
        <div className="container mx-auto px-3 md:px-4">
          <div className="text-center">
            {/* Mobile-friendly header */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-3">
              <FaPercentage className="text-xs" />
              <span>Ưu đãi độc quyền</span>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary font-serif mb-2">
              Khuyến Mãi <span className="text-primary">Hấp Dẫn</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Khám phá những chương trình khuyến mãi độc quyền và ưu đãi đặc
              biệt dành cho các sản phẩm cao cấp
            </p>

            {/* Stats - Mobile friendly */}
            <div className="flex justify-center gap-4 md:gap-8 mt-6">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-primary">
                  {meta.total}
                </div>
                <div className="text-xs md:text-sm text-gray-500">Ưu đãi</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-primary">
                  {
                    data.filter((p) => {
                      const now = new Date();
                      const end = new Date(p.end_date);
                      return end > now;
                    }).length
                  }
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  Đang diễn ra
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-primary">
                  {Math.max(
                    ...data.map((p) => parseInt(String(p.discount || "0"))),
                    0
                  )}
                  %
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  Giảm tối đa
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section - Mobile First */}
      <section className="py-4 md:py-6 bg-background sticky top-0 z-10 border-b border-[#eee]">
        <div className="container mx-auto px-3 md:px-4">
          {/* Mobile Search Bar */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Tìm kiếm khuyến mãi..."
              value={filter.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-[#eee] rounded-xl focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] text-primary font-serif placeholder-[#9ca3af] transition-all duration-300 text-sm"
            />
          </div>

          {/* Filter Toggle & Quick Actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  showFilters
                    ? "bg-primary text-[#181a1b]"
                    : "bg-surface border border-[#eee] text-gray-500 hover:bg-[#3a3d3e] hover:text-primary font-serif"
                }`}
              >
                <FaFilter className="text-xs" />
                <span className="hidden sm:inline">Bộ lọc</span>
                {hasActiveFilters() && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Quick Sort */}
              <select
                value={filter.order || ""}
                onChange={(e) => handleFilterChange("order", e.target.value)}
                className="bg-surface border border-[#eee] border border-[#eee] text-primary font-serif text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-all duration-300"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {meta.total} kết quả
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-background border border-[#eee] rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-primary font-serif">
                  Bộ lọc nâng cao
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-primary font-serif transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={filter.status || ""}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full bg-surface border border-[#eee] border border-[#eee] text-primary font-serif text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-all duration-300"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  {hasActiveFilters() && (
                    <button
                      onClick={clearAllFilters}
                      className="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-red-500/20"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-4 md:py-6">
        <div className="container mx-auto px-3 md:px-4">
          {data.length > 0 ? (
            <>
              {/* Featured promotions first - mobile optimized */}
              {data.some((p) => p.is_featured) && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaFireAlt className="text-primary" />
                    <h2 className="text-lg font-semibold text-primary font-serif">
                      Ưu đãi nổi bật
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {data
                      .filter((p) => p.is_featured)
                      .map((promotion) => (
                        <SimplePromotionCard
                          key={promotion.id}
                          promotion={promotion}
                          variant="featured"
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* All promotions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-primary font-serif">
                    Tất cả ưu đãi
                  </h2>
                  <span className="text-sm text-gray-500">
                    {meta.total} kết quả
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {data.map((promotion) => (
                    <SimplePromotionCard
                      key={promotion.id}
                      promotion={promotion}
                      variant="default"
                    />
                  ))}
                </div>
              </div>

              {/* Load More Button - Mobile optimized */}
              {meta.current_page < meta.last_page && (
                <div className="text-center mt-8">
                  <button
                    onClick={() =>
                      handleFilterChange("paged", filter.paged + 1)
                    }
                    className="px-6 py-3 bg-primary hover:bg-[#d4b995] text-[#181a1b] font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Xem thêm ưu đãi
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-[#eee] rounded-full mb-4">
                <FaTags className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary font-serif mb-2">
                Không tìm thấy khuyến mãi
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                {hasActiveFilters()
                  ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy khuyến mãi phù hợp"
                  : "Hiện tại chưa có chương trình khuyến mãi nào. Hãy quay lại sau để không bỏ lỡ những ưu đãi hấp dẫn!"}
              </p>
              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="bg-primary hover:bg-[#d4b995] text-[#181a1b] px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup - Mobile optimized */}
      <section className="py-8 bg-gradient-to-r from-[#cbb27c]/10 to-[#d4b995]/10 border-t border-[#eee] mt-8">
        <div className="container mx-auto px-3 md:px-4">
          <div className="text-center max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <FaCalendarAlt className="text-xs" />
              <span>Cập nhật mới nhất</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-primary font-serif mb-2">
              Đăng ký nhận thông báo
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Nhận thông báo về các chương trình khuyến mãi mới nhất và ưu đãi
              độc quyền
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 bg-background border border-[#eee] rounded-lg text-primary font-serif placeholder-[#9ca3af] focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] transition-all duration-300"
              />
              <button className="px-6 py-3 bg-primary hover:bg-[#d4b995] text-[#181a1b] font-semibold rounded-lg transition-all duration-300 whitespace-nowrap">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Promotion;


