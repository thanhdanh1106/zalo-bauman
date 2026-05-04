import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import SearchModal from './SearchModal';

/**
 * Demo component để test SearchModal
 * Sử dụng để development và testing
 */
const SearchModalDemo: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary font-serif mb-8">
          SearchModal Demo
        </h1>
        
        <div className="space-y-4">
          {/* Desktop Search Button */}
          <div>
            <h3 className="text-lg text-primary mb-2">Desktop Search Button</h3>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-3 text-primary font-serif hover:text-primary hover:bg-surface border border-[#eee]/50 rounded-lg transition-all duration-300 group border border-[#eee] hover:border-[#cbb27c]"
              title="Tìm kiếm sản phẩm"
            >
              <FaSearch size={20} />
            </button>
          </div>

          {/* Mobile Search Button */}
          <div>
            <h3 className="text-lg text-primary mb-2">Mobile Search Button</h3>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="w-64 flex items-center gap-3 p-4 bg-surface border border-[#eee] border border-[#eee] rounded-lg hover:border-[#cbb27c] transition-all text-primary font-serif hover:text-primary"
            >
              <FaSearch size={16} />
              <span>Tìm kiếm bia...</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 max-w-md mx-auto text-left">
            <h3 className="text-lg text-primary mb-3">Test Instructions:</h3>
            <ul className="text-gray-500 space-y-2 text-sm">
              <li>• Click search button để mở modal</li>
              <li>• Test popular searches</li>
              <li>• Thử tìm kiếm: "Heineken", "Tiger", "Corona"</li>
              <li>• Test add to cart functionality</li>
              <li>• Test responsive design</li>
              <li>• Test keyboard navigation (Enter/Escape)</li>
              <li>• Test recent searches storage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </div>
  );
};

export default SearchModalDemo;

