import { formatCurrency } from '@shared/utils/Hooks';
import React, { useEffect, useRef, useState } from 'react';
import {
  FaArrowRight,
  FaBeer,
  FaChevronDown,
  FaHistory,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Mock data for search suggestions
const mockProducts = [
  {
    id: '1',
    name: 'Heineken Lon 330ml',
    brand: 'Heineken',
    category: 'Bia nhập khẩu',
    price: 25000,
    image: '/api/placeholder/60/60',
    volume: 330,
    alcoholContent: 5.0,
  },
  {
    id: '2',
    name: 'Tiger Crystal Lon 330ml',
    brand: 'Tiger',
    category: 'Bia trong nước',
    price: 22000,
    image: '/api/placeholder/60/60',
    volume: 330,
    alcoholContent: 4.8,
  },
  {
    id: '3',
    name: 'Budweiser Lon 330ml',
    brand: 'Budweiser',
    category: 'Bia nhập khẩu',
    price: 28000,
    image: '/api/placeholder/60/60',
    volume: 330,
    alcoholContent: 5.0,
  },
  {
    id: '4',
    name: 'Saigon Special Lon 330ml',
    brand: 'Saigon',
    category: 'Bia trong nước',
    price: 18000,
    image: '/api/placeholder/60/60',
    volume: 330,
    alcoholContent: 4.9,
  },
  {
    id: '5',
    name: 'Corona Extra Chai 355ml',
    brand: 'Corona',
    category: 'Bia nhập khẩu',
    price: 35000,
    image: '/api/placeholder/60/60',
    volume: 355,
    alcoholContent: 4.6,
  },
];

const popularSearches = [
  'Heineken',
  'Tiger',
  'Budweiser',
  'Corona',
  'Saigon',
  'Bia lon',
  'Bia chai',
  'Bia nhập khẩu',
];

const categories = [
  { id: 'all', name: 'Tất cả danh mục', value: '' },
  { id: 'imported', name: 'Bia nhập khẩu', value: 'Bia nhập khẩu' },
  { id: 'domestic', name: 'Bia trong nước', value: 'Bia trong nước' },
  { id: 'craft', name: 'Bia thủ công', value: 'Bia thủ công' },
  { id: 'premium', name: 'Bia cao cấp', value: 'Bia cao cấp' },
  { id: 'can', name: 'Bia lon', value: 'Bia lon' },
  { id: 'bottle', name: 'Bia chai', value: 'Bia chai' },
];

interface SearchFormProps {
  className?: string;
  placeholder?: string;
  showPopularSearches?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  className = '',
  placeholder = 'Tìm kiếm bia, thương hiệu...',
  showPopularSearches = true,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<typeof mockProducts>(
    []
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
      localStorage.removeItem('recentSearches');
    }
  }, []);

  // Filter products based on query and category
  useEffect(() => {
    if (query.trim()) {
      let filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );

      // Apply category filter if not "all"
      if (selectedCategory.value) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory.value
        );
      }

      setFilteredProducts(filtered.slice(0, 5)); // Limit to 5 results
    } else {
      setFilteredProducts([]);
    }
  }, [query, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      try {
        // Save to recent searches
        const updatedRecent = [
          searchQuery,
          ...recentSearches.filter((s) => s !== searchQuery),
        ].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
      } catch (error) {
        console.error('Error saving recent search:', error);
      }

      // Navigate to products page with search query

      // Navigate to products page
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);

      // Close dropdown and clear input
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setFilteredProducts([]);
      inputRef.current?.blur();
    }
  };

  const handleCategorySelect = (category: (typeof categories)[0]) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  const handleProductClick = (product: (typeof mockProducts)[0]) => {
    navigate(`/products/${product.id}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const clearQuery = () => {
    setQuery('');
    setFilteredProducts([]);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    try {
      setRecentSearches([]);
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input with Category Dropdown */}
      <div className="relative flex">
        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={toggleCategoryDropdown}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors min-w-[140px] justify-between"
          >
            <span className="text-sm font-medium text-gray-700 truncate">
              {selectedCategory.name}
            </span>
            <FaChevronDown
              className={`text-gray-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {/* Category Dropdown Menu */}
          {categoryDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[200px]">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedCategory.id === category.id
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen &&
        (query.trim() || recentSearches.length > 0 || showPopularSearches) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            {/* Search Results */}
            {filteredProducts.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                  Sản phẩm ({filteredProducts.length})
                </div>
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[44px] h-[44px] object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.brand} • {product.volume}ml •{' '}
                        {product.alcoholContent}%
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-amber-600">
                      {formatCurrency(product.price)}
                    </div>
                  </button>
                ))}

                {/* View All Results */}
                <button
                  onClick={() => handleSearch()}
                  className="w-full flex items-center justify-center space-x-2 p-3 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors font-medium"
                >
                  <span>Xem tất cả kết quả cho "{query}"</span>
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            )}

            {/* No Results */}
            {query && filteredProducts.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-3">
                  Không tìm thấy sản phẩm nào
                </p>
                <button
                  onClick={() => handleSearch()}
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Tìm kiếm "{query}" trong tất cả sản phẩm
                </button>
              </div>
            )}

            {/* Recent Searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tìm kiếm gần đây
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <FaHistory className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {!query.trim() && showPopularSearches && (
              <div className="p-2 border-t border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                  Tìm kiếm phổ biến
                </div>
                <div className="px-3 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchForm;


