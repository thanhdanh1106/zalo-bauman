import PageLoading from "@shared/components/PageLoading";
import { useCart } from "@shared/hooks/useCart";
import { metaProps } from "@shared/types/meta";
import { productProps } from "@shared/types/product";
import { filterProps } from "@shared/types/query";
import { debounce, filterParams } from "@shared/utils/Hooks";
import { findManyProductCategories } from "@shared/utils/ProductCategories";
import { findManyProducts } from "@shared/utils/Products";
import { scrollToTop } from "@shared/utils/scrollUtils";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductList from "./Components/ProductList";
import ProductSidebar, {
  FilterOptions,
  FilterValues,
} from "./Components/ProductSidebar";
import { setNavigationBarTitle } from "zmp-sdk/apis";

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<productProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const { addToCart } = useCart();

  const [meta, setMeta] = useState<metaProps | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRanges: [],
    origins: [],
    features: [],
  });

  // Filter state from URL params
  const filterValues: FilterValues = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return {
      search: params.search || "",
      category_ids: params.category_ids
        ? params.category_ids
          .split(",")
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id))
        : undefined,
      sort_by: params.sort_by || "popular",
      sort_direction: (params.sort_direction as "asc" | "desc") || "desc",
    };
  }, [searchParams]);

  const debouncedFetchProducts = useMemo(
    () =>
      debounce((filters: FilterValues, page: number, limit: number) => {
        fetchProducts(filters, page, limit);
      }, 300),
    []
  );

  const fetchProducts = async (
    filters: FilterValues,
    page: number = 1,
    limit: number = 10
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const preparedFilters: any = { ...filters };
      if (preparedFilters.category_ids && Array.isArray(preparedFilters.category_ids)) {
        preparedFilters.category_ids = preparedFilters.category_ids.join(",");
      }

      let sort = "id";
      let order = "desc";
      if (filters.sort_by === "popular") {
        sort = "views";
        order = "desc";
      } else if (filters.sort_by === "newest") {
        sort = "created_at";
        order = "desc";
      } else if (filters.sort_by === "price-asc") {
        sort = "price";
        order = "asc";
      } else if (filters.sort_by === "price-desc") {
        sort = "price";
        order = "desc";
      }

      const apiParams = filterParams({
        ...preparedFilters,
        sort,
        order,
        page,
        limit,
        status: "published",
      });
      delete apiParams.sort_by;
      delete apiParams.sort_direction;

      const response = await findManyProducts(apiParams);

      if (response.error) {
        setError(response.message || "Có lỗi xảy ra khi tải sản phẩm");
        setProducts([]);
      } else {
        const productList = Array.isArray(response.data) ? response.data : [];
        setProducts(productList);
        setMeta(response.meta || null);
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const categoriesResponse = await findManyProductCategories({ status: "published" });
      if (!categoriesResponse.error && categoriesResponse.data) {
        setFilterOptions((prev) => ({
          ...prev,
          categories: Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [],
        }));
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    const params = new URLSearchParams(searchParams);
    // Reset page to 1 on filter change
    params.set("page", "1");

    // Clear existing filter keys to rebuild from newFilters
    const filterKeys = ["search", "category_ids", "sort_by", "sort_direction"];
    filterKeys.forEach(key => params.delete(key));

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) {
        if (key === "category_ids" && Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        } else if (key !== "category_ids") {
          params.set(key, String(value));
        }
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    scrollToTop();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ ...filterValues, search: searchInput });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (searchParams.get("search") || "")) {
        handleFilterChange({ ...filterValues, search: searchInput });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, filterValues, searchParams]);

  useEffect(() => {
    scrollToTop();
    fetchFilterOptions();
    setNavigationBarTitle({ title: "Sản phẩm" });
  }, []);

  useEffect(() => {
    const currentPage = Number(searchParams.get("page")) || 1;
    const itemsPerPage = Number(searchParams.get("per_page")) || 10;

    if (filterValues.search) {
      debouncedFetchProducts(filterValues, currentPage, itemsPerPage);
    } else {
      fetchProducts(filterValues, currentPage, itemsPerPage);
    }
  }, [filterValues, searchParams]);

  return (
    <div className="bg-background min-h-screen pb-safe-area-bottom pb-[100px]">
      <main className="mx-auto px-margin-main pt-stack-md">
        {/* Search & Filter */}
        <form onSubmit={handleSearch} className="flex items-center gap-stack-sm mb-stack-md">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border border-surface-variant rounded-full text-sm font-sans text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-11"
              placeholder="Tìm kiếm sản phẩm..."
              type="text"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="w-11 h-11 bg-surface-container-highest rounded-full text-on-surface-variant flex items-center justify-center border border-surface-variant"
          >
            <span className="material-symbols-outlined">tune</span>
          </button>
        </form>

        {/* Category Chips */}
        <div className="flex overflow-x-auto no-scrollbar gap-stack-sm pb-stack-sm mb-stack-md snap-x">
          <button
            onClick={() => handleFilterChange({ ...filterValues, category_ids: undefined })}
            className={`snap-start shrink-0 px-5 py-2 rounded-full font-sans font-semibold text-xs transition-all shadow-sm ${!filterValues.category_ids?.length
              ? "bg-primary text-white"
              : "bg-surface-container-highest text-on-surface-variant border border-surface-variant"
              }`}
          >
            Tất cả
          </button>
          {filterOptions.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange({ ...filterValues, category_ids: [parseInt(cat.id.toString())] })}
              className={`snap-start shrink-0 px-5 py-2 rounded-full font-sans font-semibold text-xs transition-all shadow-sm ${filterValues.category_ids?.includes(parseInt(cat.id.toString()))
                ? "bg-primary text-white"
                : "bg-surface-container-highest text-on-surface-variant border border-surface-variant"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-stack-lg border-b border-surface-variant mb-stack-lg overflow-x-auto no-scrollbar">
          {[
            { id: 'popular', label: 'Phổ biến' },
            { id: 'newest', label: 'Mới nhất' },
            { id: 'price-asc', label: 'Giá thấp' },
            { id: 'price-desc', label: 'Giá cao' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange({ ...filterValues, sort_by: tab.id })}
              className={`pb-3 shrink-0 font-sans font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${filterValues.sort_by === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product List Area */}
        <div className="pb-stack-lg">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-gutter-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface rounded-xl p-3 h-64 animate-pulse border border-[#eee]">
                  <div className="aspect-square bg-surface-container-low rounded-lg mb-3"></div>
                  <div className="h-4 bg-surface-container-low rounded-full w-3/4 mb-2"></div>
                  <div className="h-3 bg-surface-container-low rounded-full w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductList
              products={products}
              viewMode="grid"
              onAddToCart={(p) => addToCart(p, 1)}
            />
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && !isLoading && (
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                disabled={meta.current_page === 1}
                onClick={() => handlePageChange(meta.current_page - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-surface-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-highest transition-all"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <div className="text-sm font-bold text-on-surface font-sans">
                Trang {meta.current_page} / {meta.last_page}
              </div>

              <button
                disabled={meta.current_page === meta.last_page}
                onClick={() => handlePageChange(meta.current_page + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-surface-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-highest transition-all"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}

          {products.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">inventory_2</span>
              <p className="text-gray-500 font-sans">Không tìm thấy sản phẩm phù hợp</p>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar - Remains for advanced filtering if needed */}
      <ProductSidebar
        filters={filterOptions}
        values={filterValues}
        onFilterChange={handleFilterChange}
        totalCount={meta?.total}
        isLoading={isLoading}
        isMobile={true}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Products;
