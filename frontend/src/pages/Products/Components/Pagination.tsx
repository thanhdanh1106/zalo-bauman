import React from 'react';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  isLoading = false,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const itemsPerPageOptions = [12, 24, 36, 48];

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      {/* Items Info */}
      <div className="text-primary/70 text-sm">
        Hiển thị {startItem}-{endItem} của {totalItems} sản phẩm
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className={`p-2 rounded-lg border transition-colors ${
            currentPage === 1 || isLoading
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-[#cbb27c]/30 text-primary hover:bg-primary/10 hover:border-[#cbb27c]'
          }`}
        >
          <FaAngleDoubleLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`p-2 rounded-lg border transition-colors ${
            currentPage === 1 || isLoading
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-[#cbb27c]/30 text-primary hover:bg-primary/10 hover:border-[#cbb27c]'
          }`}
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-primary/50">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-[#181a1b] border-[#cbb27c]'
                      : isLoading
                      ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                      : 'border-[#cbb27c]/30 text-primary hover:bg-primary/10 hover:border-[#cbb27c]'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`p-2 rounded-lg border transition-colors ${
            currentPage === totalPages || isLoading
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-[#cbb27c]/30 text-primary hover:bg-primary/10 hover:border-[#cbb27c]'
          }`}
        >
          <FaChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className={`p-2 rounded-lg border transition-colors ${
            currentPage === totalPages || isLoading
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-[#cbb27c]/30 text-primary hover:bg-primary/10 hover:border-[#cbb27c]'
          }`}
        >
          <FaAngleDoubleRight className="w-4 h-4" />
        </button>
      </div>

      {/* Items Per Page Selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-primary/70 text-sm">Hiển thị:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            disabled={isLoading}
            className={`px-3 py-2 bg-background border border-[#cbb27c]/30 rounded-lg text-primary font-serif focus:border-[#cbb27c] focus:outline-none ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-primary/70 text-sm">/ trang</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;

