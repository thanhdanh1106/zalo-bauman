import React from "react";
import { FaFilter, FaList, FaSearch, FaTh } from "react-icons/fa";

interface ProductToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onMobileFilterToggle?: () => void;
  totalCount: number;
  isLoading?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  isMobile?: boolean;
}

const ProductToolbar: React.FC<ProductToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onMobileFilterToggle,
  totalCount,
  isLoading = false,
  currentPage = 1,
  itemsPerPage = 12,
  isMobile = false,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="bg-background border-b border-[#eee] py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Results info and mobile filter */}
        <div className="flex items-center gap-4">
          {/* Mobile Filter Toggle */}
          {isMobile && (
            <button
              onClick={onMobileFilterToggle}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-[#eee] hover:bg-[#3a3d3e] text-primary font-serif rounded-lg transition-colors"
            >
              <FaFilter size={14} />
              <span className="font-medium">Bộ lọc</span>
            </button>
          )}
        </div>

        {/* Right side - View mode controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface border border-[#eee] rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-[#181a1b]"
                  : "text-gray-500 hover:text-primary font-serif hover:bg-[#3a3d3e]"
              }`}
              title="Chế độ lưới"
            >
              <FaTh size={14} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
                viewMode === "list"
                  ? "bg-primary text-[#181a1b]"
                  : "text-gray-500 hover:text-primary font-serif hover:bg-[#3a3d3e]"
              }`}
              title="Chế độ danh sách"
            >
              <FaList size={14} />
            </button>
          </div>

          {/* Items per page (only show on desktop) */}
          {!isMobile && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Hiển thị:</span>
              <select
                className="bg-surface border border-[#eee] border border-[#4a4d4e] text-primary font-serif rounded px-2 py-1 text-sm focus:border-[#cbb27c] focus:outline-none"
                value={itemsPerPage}
                onChange={() => {}}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
                <option value={48}>48</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-[#eee] border border-[#4a4d4e] rounded-lg text-primary font-serif placeholder-[#6b7280] focus:border-[#cbb27c] focus:outline-none transition-colors"
            />
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]"
              size={16}
            />
          </div>
        </div>
      )}
      {/* Results Count */}
      <div className="text-sm text-gray-500 mt-3">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#cbb27c] border-t-transparent rounded-full animate-spin" />
            <span>Đang tải...</span>
          </div>
        ) : totalCount > 0 ? (
          <span>
            Hiển thị{" "}
            <span className="text-primary font-medium">
              {startItem}-{endItem}
            </span>{" "}
            của <span className="text-primary font-medium">{totalCount}</span>{" "}
            sản phẩm
          </span>
        ) : (
          <span>Không tìm thấy sản phẩm nào</span>
        )}
      </div>
    </div>
  );
};

export default ProductToolbar;


