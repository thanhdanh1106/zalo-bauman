import { filterParams } from "@shared/utils/Hooks";
import { findManyProducts } from "@shared/utils/Products";
import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaBeer,
  FaCrown,
  FaFire,
  FaGift,
  FaHistory,
  FaSearch,
  FaStore,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { productProps } from "../types/product";
import "./SearchModal.css";
import SearchProductCard from "./SearchProductCard";

const popularSearches = [
  { text: "Heineken", icon: FaCrown, color: "text-green-400" },
  { text: "Tiger", icon: FaFire, color: "text-orange-400" },
  { text: "Corona", icon: FaGift, color: "text-yellow-400" },
  { text: "Budweiser", icon: FaBeer, color: "text-red-400" },
  { text: "Bia lon", icon: FaBeer, color: "text-blue-400" },
  { text: "Bia nhập khẩu", icon: FaCrown, color: "text-purple-400" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<productProps[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [trendingProducts, setTrendingProducts] = useState<productProps[]>([]);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
      localStorage.removeItem("recentSearches");
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Fetch featured products
  const handleFindFeaturedProducts = async () => {
    try {
      const query = filterParams({ featured: true, per_page: 6 });
      const response = await findManyProducts(query);
      if (response && !response.error) {
        const { data } = response;
        setTrendingProducts(data);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      try {
        // Save to recent searches
        const updatedRecent = [
          searchQuery,
          ...recentSearches.filter((s) => s !== searchQuery),
        ].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
      } catch (error) {
        console.error("Error saving recent search:", error);
      }

      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleProductClick = (product: productProps) => {
    navigate(`/products/${product.slug}`);
    onClose();
  };

  const clearQuery = () => {
    setQuery("");
    setFilteredProducts([]);
    searchInputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    try {
      setRecentSearches([]);
      localStorage.removeItem("recentSearches");
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  useEffect(() => {
    handleFindFeaturedProducts();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 search-backdrop search-modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[768px] mx-4 mt-10 bg-background rounded-2xl border border-[#eee] shadow-2xl backdrop-blur-md overflow-hidden search-modal-content">
        {/* Header */}
        <div className="flex items-center gap-4 p-3 border-b border-[#eee] search-header">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" size={18} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tìm kiếm bia, thương hiệu, loại bia..."
              className="w-full !px-12 pr-12 py-4 bg-surface border border-[#eee] border border-[#eee] rounded-xl focus:ring-2 focus:ring-[#cbb27c] focus:border-[#cbb27c] outline-none transition-all text-primary font-serif placeholder-[#9ca3af] text-sm search-input search-input-focus"
            />
            {query && (
              <button
                onClick={clearQuery}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-primary font-serif transition-colors"
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-primary font-serif hover:bg-surface border border-[#eee] rounded-lg transition-all"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto search-modal-scroll">
          {/* Loading State */}
          {isLoading && (
            <div className="p-12 text-center search-empty">
              <div className="inline-block w-8 h-8 border-2 border-[#eee] border-t-[#cbb27c] rounded-full animate-spin search-loading"></div>
              <p className="text-gray-500 mt-4">Đang tìm kiếm...</p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query && filteredProducts.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-primary font-serif flex items-center gap-2">
                  Kết quả tìm kiếm
                  <span className="search-result-count">
                    ({filteredProducts.length})
                  </span>
                </h3>
                <button
                  onClick={() => handleSearch()}
                  className="flex items-center gap-2 text-primary hover:text-[#d4b995] transition-colors"
                >
                  <span>Xem tất cả</span>
                  <FaArrowRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="search-result-item">
                    <SearchProductCard
                      product={product}
                      onProductClick={handleProductClick}
                      className="search-product-card"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && filteredProducts.length === 0 && (
            <div className="search-empty">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-[#eee] rounded-full mb-4">
                <FaStore className="text-2xl text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-primary font-serif mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-500 mb-4">
                Hãy thử tìm kiếm với từ khóa khác hoặc xem các gợi ý bên dưới
              </p>
              <button
                onClick={() => handleSearch()}
                className="px-6 py-2 bg-primary text-[#181a1b] rounded-lg hover:bg-[#d4b995] transition-colors font-medium"
              >
                Tìm kiếm "{query}" trong tất cả sản phẩm
              </button>
            </div>
          )}

          {/* Default Content - When no query */}
          {!query && (
            <div className="p-6 space-y-8">
              {/* Popular Searches */}
              <div>
                <h3 className="text-sm font-semibold text-primary font-serif mb-4 flex items-center gap-2">
                  <FaFire className="text-primary" />
                  Tìm kiếm phổ biến
                </h3>
                <div className="search-categories">
                  {popularSearches.map((search, index) => {
                    const IconComponent = search.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search.text)}
                        className="flex items-center gap-3 p-3 bg-surface border border-[#eee] hover:bg-[#3a3d3e] border border-[#eee] hover:border-[#cbb27c] rounded-lg transition-all group popular-search-tag search-badge"
                      >
                        <IconComponent
                          className={`${search.color} group-hover:text-primary transition-colors`}
                          size={16}
                        />
                        <span className="text-primary font-serif text-xs group-hover:text-primary transition-colors font-medium">
                          {search.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trending Products */}
              <div className="search-trending">
                <h3 className="text-sm font-semibold text-primary font-serif mb-4 flex items-center gap-2">
                  <FaCrown className="text-primary" />
                  Sản phẩm nổi bật
                </h3>
                <div className="space-y-3">
                  {trendingProducts.map((product) => (
                    <div key={product.id} className="search-result-item">
                      <SearchProductCard
                        product={product}
                        onProductClick={handleProductClick}
                        className="search-product-card"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-primary font-serif flex items-center gap-2">
                      <FaHistory className="text-primary" />
                      Tìm kiếm gần đây
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-sm text-gray-500 hover:text-primary font-serif transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="flex items-center gap-2 px-3 py-2 bg-surface border border-[#eee] hover:bg-[#3a3d3e] border border-[#eee] hover:border-[#cbb27c] rounded-lg transition-all text-sm"
                      >
                        <FaHistory className="text-gray-500" size={12} />
                        <span className="text-primary font-serif">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;


