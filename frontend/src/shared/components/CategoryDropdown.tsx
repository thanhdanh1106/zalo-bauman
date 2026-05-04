import { postCategoryProps } from "@shared/types/post";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

interface CategoryDropdownProps {
  categories: postCategoryProps[];
  selectedIds?: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedIds = [],
  onSelectionChange,
  placeholder = "Chọn danh mục...",
  multiple = true,
  searchable = true,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected categories for display
  const selectedCategories = categories.filter((category) =>
    selectedIds.includes(category.id)
  );

  // Handle category selection
  const handleCategorySelect = (categoryId: number) => {
    if (multiple) {
      if (selectedIds.includes(categoryId)) {
        // Remove from selection
        onSelectionChange(selectedIds.filter((id) => id !== categoryId));
      } else {
        // Add to selection
        onSelectionChange([...selectedIds, categoryId]);
      }
    } else {
      // Single selection
      onSelectionChange([categoryId]);
      setIsOpen(false);
    }
  };

  // Handle clear all selections
  const handleClearAll = () => {
    onSelectionChange([]);
  };

  // Handle remove single selection
  const handleRemoveSelection = (categoryId: number) => {
    onSelectionChange(selectedIds.filter((id) => id !== categoryId));
  };

  // Get display text
  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return placeholder;
    }

    if (selectedCategories.length === 1) {
      return selectedCategories[0].title || selectedCategories[0]?.title;
    }

    return `${selectedCategories.length} danh mục được chọn`;
  };

  // Render category item
  const renderCategoryItem = (category: postCategoryProps) => {
    const isSelected = selectedIds.includes(category.id);
    const displayName = category.title || category.name;

    return (
      <div
        key={category.id}
        onClick={() => handleCategorySelect(category.id)}
        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors hover:bg-surface border border-[#eee] ${
          isSelected ? "bg-primary/10 text-primary" : "text-gray-500"
        }`}
      >
        {multiple && (
          <div className="relative">
            <div
              className={`w-4 h-4 border-2 rounded transition-all ${
                isSelected
                  ? "bg-primary border-[#cbb27c]"
                  : "border-[#4a4d4e] hover:border-[#cbb27c]"
              }`}
            >
              {isSelected && (
                <FaCheck className="text-[#181a1b] w-3 h-3 absolute top-0.5 left-0.5" />
              )}
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="font-medium text-sm">{displayName}</div>
          {category.description && (
            <div className="text-xs text-[#6b7280] truncate">
              {category.description}
            </div>
          )}
        </div>

        {category.posts_count !== undefined && (
          <span className="text-xs text-[#6b7280] bg-surface border border-[#eee] px-2 py-1 rounded-full">
            {category.posts_count}
          </span>
        )}
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-background border border-[#eee] rounded-lg text-left transition-colors ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-[#cbb27c] focus:border-[#cbb27c] focus:outline-none"
        } ${isOpen ? "border-[#cbb27c]" : ""}`}
      >
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm ${
              selectedCategories.length > 0
                ? "text-primary font-serif"
                : "text-[#6b7280]"
            }`}
          >
            {getDisplayText()}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {selectedCategories.length > 0 && multiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="text-[#6b7280] hover:text-primary font-serif transition-colors"
            >
              <FaTimes size={12} />
            </button>
          )}

          {isOpen ? (
            <FaChevronUp className="text-[#6b7280]" size={12} />
          ) : (
            <FaChevronDown className="text-[#6b7280]" size={12} />
          )}
        </div>
      </button>

      {/* Selected Items Display (for multiple selection) */}
      {multiple && selectedCategories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCategories.map((category) => (
            <span
              key={category.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full border border-[#cbb27c]/30"
            >
              {category.title || category.name}
              <button
                onClick={() => handleRemoveSelection(category.id)}
                className="hover:text-primary/70 transition-colors"
              >
                <FaTimes size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-[#eee] rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-[#eee]">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm danh mục..."
                  className="w-full pl-9 pr-4 py-2 bg-surface border border-[#eee] border border-[#4a4d4e] rounded-lg text-primary font-serif placeholder-[#6b7280] focus:border-[#cbb27c] focus:outline-none transition-colors text-sm"
                />
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]"
                  size={12}
                />
              </div>
            </div>
          )}

          {/* Options Header */}
          {multiple && categories.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 bg-surface border border-[#eee]/50 border-b border-[#eee]">
              <span className="text-xs text-gray-500">
                {selectedCategories.length} / {categories.length} được chọn
              </span>
              {selectedCategories.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Xóa tất cả
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(renderCategoryItem)
            ) : (
              <div className="px-3 py-4 text-center text-[#6b7280] text-sm">
                {searchTerm
                  ? "Không tìm thấy danh mục phù hợp"
                  : "Không có danh mục nào"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;


