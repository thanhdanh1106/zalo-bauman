import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mx-4 mb-4">
      <div className="flex items-center gap-2 bg-surface border border-[#eee] border border-[#eee] rounded-lg p-3">
        <FaSearch className="text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Tìm kiếm bia, thương hiệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent text-primary font-serif placeholder-[#9ca3af] outline-none text-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-primary text-[#181a1b] px-4 py-1 rounded-lg text-sm font-medium hover:bg-[#d4c285] transition-colors"
        >
          Tìm
        </button>
      </div>
    </div>
  );
};

export default SearchBar;


