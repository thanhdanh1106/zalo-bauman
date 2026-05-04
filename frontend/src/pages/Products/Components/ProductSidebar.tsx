import CategoryDropdown from "@shared/components/CategoryDropdown";
import { postCategoryProps } from "@shared/types/post";
import React, { useState } from "react";
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";

export interface FilterOptions {
  categories: postCategoryProps[];
  brands: postCategoryProps[];
  priceRanges: Array<{ min: number; max: number; label: string }>;
  origins: postCategoryProps[];
  features: Array<{ key: string; label: string }>;
}

export interface FilterValues {
  search?: string;
  category_ids?: number[]; // Thay đổi từ category_id thành category_ids array
  brand_id?: number;
  price_min?: number;
  price_max?: number;
  origin?: string;
  is_featured?: boolean;
  is_best_selling?: boolean;
  in_stock?: boolean;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

interface ProductSidebarProps {
  filters: FilterOptions;
  values: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  totalCount?: number;
  isLoading?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  filters,
  values,
  onFilterChange,
  totalCount = 0,
  isLoading = false,
  isMobile = false,
  isOpen = true,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    categories: true,
    brands: true,
    price: true,
    origin: true,
    features: true,
    sort: true,
  });

  const [searchTerm, setSearchTerm] = useState(values.search || "");

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterUpdate = (newValues: Partial<FilterValues>) => {
    console.log("Filter update:", newValues);
    onFilterChange({ ...values, ...newValues });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterUpdate({ search: searchTerm });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    onFilterChange({
      search: undefined,
      category_ids: undefined,
      brand_id: undefined,
      price_min: undefined,
      price_max: undefined,
      origin: undefined,
      is_featured: undefined,
      is_best_selling: undefined,
      in_stock: undefined,
      sort_by: undefined,
      sort_direction: undefined,
    });
  };

  const selectedPriceRange = filters.priceRanges.find(
    (range) => range.min === values.price_min && range.max === values.price_max
  );

  const hasActiveFilters = Object.keys(values).some((key) => {
    const value = values[key as keyof FilterValues];
    if (key === "category_ids") {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== undefined && value !== "" && value !== false;
  });

  // Debug log for current filter values
  console.log("Current filter values:", values);
  console.log("Current category_ids:", values.category_ids);

  const FilterSection: React.FC<{
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
    count?: number;
  }> = ({ title, section, children, count }) => (
    <div className="border-b border-[#eee] last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface border border-[#eee]/50 transition-colors"
      >
        <span className="font-medium text-primary font-serif flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </span>
        {expandedSections[section] ? (
          <FaChevronUp className="text-gray-500" size={12} />
        ) : (
          <FaChevronDown className="text-gray-500" size={12} />
        )}
      </button>
      {expandedSections[section] && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  const CheckboxItem: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    count?: number;
  }> = ({ checked, onChange, label, count }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:text-primary transition-colors group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 border-2 rounded transition-all ${
            checked
              ? "bg-primary border-[#cbb27c]"
              : "border-[#4a4d4e] group-hover:border-[#cbb27c]"
          }`}
        >
          {checked && (
            <FaCheck className="text-[#181a1b] w-3 h-3 absolute top-0.5 left-0.5" />
          )}
        </div>
      </div>
      <span className="flex-1 text-sm text-gray-500 group-hover:text-primary transition-colors">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-[#6b7280]">({count})</span>
      )}
    </label>
  );

  const RadioItem: React.FC<{
    checked: boolean;
    onChange: () => void;
    label: string;
  }> = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:text-primary transition-colors group">
      <div className="relative">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 border-2 rounded-full transition-all ${
            checked
              ? "border-[#cbb27c]"
              : "border-[#4a4d4e] group-hover:border-[#cbb27c]"
          }`}
        >
          {checked && (
            <div className="w-2 h-2 bg-primary rounded-full absolute top-1 left-1" />
          )}
        </div>
      </div>
      <span className="text-sm text-gray-500 group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#eee]">
        <h3 className="text-sm font-semibold text-primary font-serif flex items-center gap-2">
          <FaSlidersH className="text-primary" />
          Bộ lọc sản phẩm
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-primary font-serif transition-colors"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="p-4 bg-surface border border-[#eee]/30">
        <div className="text-sm text-gray-500">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#cbb27c] border-t-transparent rounded-full animate-spin" />
              Đang tìm kiếm...
            </div>
          ) : (
            <>
              Tìm thấy{" "}
              <span className="text-primary font-medium">{totalCount}</span>{" "}
              sản phẩm
            </>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search */}
        <FilterSection title="Tìm kiếm" section="search">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-[#eee] border border-[#4a4d4e] rounded-lg text-primary font-serif placeholder-[#6b7280] focus:border-[#cbb27c] focus:outline-none transition-colors"
              />
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]"
                size={14}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-primary text-[#181a1b] rounded-lg font-medium hover:bg-[#d4b995] transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </FilterSection>

        {/* Categories - sử dụng CategoryDropdown */}
        <FilterSection
          title="Danh mục"
          section="categories"
          count={values.category_ids?.length || 0}
        >
          <CategoryDropdown
            categories={filters.categories}
            selectedIds={values.category_ids || []}
            onSelectionChange={(selectedIds) => {
              console.log("Selected category IDs:", selectedIds);
              handleFilterUpdate({
                category_ids: selectedIds.length > 0 ? selectedIds : undefined,
              });
            }}
            placeholder="Chọn danh mục"
            searchable={true}
            multiple={true}
          />
        </FilterSection>

        {/* Brands */}
        <FilterSection
          title="Thương hiệu"
          section="brands"
          count={filters.brands.length}
        >
          <div className="space-y-1">
            <RadioItem
              checked={!values.brand_id}
              onChange={() => handleFilterUpdate({ brand_id: undefined })}
              label="Tất cả thương hiệu"
            />
            {filters.brands.map((brand) => (
              <RadioItem
                key={brand.id}
                checked={values.brand_id === brand.id}
                onChange={() => handleFilterUpdate({ brand_id: brand.id })}
                label={brand.title || `Thương hiệu ${brand.id}`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Khoảng giá" section="price">
          <div className="space-y-1">
            <RadioItem
              checked={!values.price_min && !values.price_max}
              onChange={() =>
                handleFilterUpdate({
                  price_min: undefined,
                  price_max: undefined,
                })
              }
              label="Tất cả mức giá"
            />
            {filters.priceRanges.map((range, index) => (
              <RadioItem
                key={index}
                checked={
                  values.price_min === range.min &&
                  values.price_max === range.max
                }
                onChange={() =>
                  handleFilterUpdate({
                    price_min: range.min,
                    price_max: range.max === Infinity ? undefined : range.max,
                  })
                }
                label={range.label}
              />
            ))}
          </div>
        </FilterSection>

        {/* Origin */}
        {filters.origins.length > 0 && (
          <FilterSection
            title="Xuất xứ"
            section="origin"
            count={filters.origins.length}
          >
            <div className="space-y-1">
              <RadioItem
                checked={!values.origin}
                onChange={() => handleFilterUpdate({ origin: undefined })}
                label="Tất cả xuất xứ"
              />
              {filters.origins.map((origin) => (
                <RadioItem
                  key={origin.id}
                  checked={values.origin === origin.name}
                  onChange={() => handleFilterUpdate({ origin: origin.name })}
                  label={origin.name}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Features */}
        <FilterSection title="Tính năng" section="features">
          <div className="space-y-1">
            {filters.features.map((feature) => (
              <CheckboxItem
                key={feature.key}
                checked={!!values[feature.key as keyof FilterValues]}
                onChange={(checked) =>
                  handleFilterUpdate({ [feature.key]: checked || undefined })
                }
                label={feature.label}
              />
            ))}
          </div>
        </FilterSection>

        {/* Sort */}
        <FilterSection title="Sắp xếp" section="sort">
          <div className="space-y-1">
            <RadioItem
              checked={!values.sort_by}
              onChange={() =>
                handleFilterUpdate({
                  sort_by: undefined,
                  sort_direction: undefined,
                })
              }
              label="Mặc định"
            />
            <RadioItem
              checked={
                values.sort_by === "created_at" &&
                values.sort_direction === "desc"
              }
              onChange={() =>
                handleFilterUpdate({
                  sort_by: "created_at",
                  sort_direction: "desc",
                })
              }
              label="Mới nhất"
            />
            <RadioItem
              checked={
                values.sort_by === "price" && values.sort_direction === "asc"
              }
              onChange={() =>
                handleFilterUpdate({ sort_by: "price", sort_direction: "asc" })
              }
              label="Giá: Thấp đến cao"
            />
            <RadioItem
              checked={
                values.sort_by === "price" && values.sort_direction === "desc"
              }
              onChange={() =>
                handleFilterUpdate({ sort_by: "price", sort_direction: "desc" })
              }
              label="Giá: Cao đến thấp"
            />
            <RadioItem
              checked={
                values.sort_by === "rating" && values.sort_direction === "desc"
              }
              onChange={() =>
                handleFilterUpdate({
                  sort_by: "rating",
                  sort_direction: "desc",
                })
              }
              label="Đánh giá cao nhất"
            />
          </div>
        </FilterSection>
      </div>
    </div>
  );

   return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999]"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-background/75 backdrop-blur-md rounded-tl-xl rounded-br-xl overflow-hidden border-r border-[#eee] z-[999] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default ProductSidebar;


