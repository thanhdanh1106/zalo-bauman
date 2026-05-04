import PageLoading from "@shared/components/PageLoading";
import Pagination from "@shared/components/Pagination";
import { useToasterContext } from "@shared/components/ToasterContext";
import { metaProps } from "@shared/types/meta";
import { postCategoryProps, postProps } from "@shared/types/post";
import { filterProps } from "@shared/types/query";
import { filterParams, getThumbnailUrl } from "@shared/utils/Hooks";
import { findManyPostCategories } from "@shared/utils/PostCategories";
import { findManyPosts } from "@shared/utils/Posts";
import { scrollToTop } from "@shared/utils/scrollUtils";
import React, { Fragment, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBars,
  FaBookmark,
  FaClock,
  FaEye,
  FaFilter,
  FaSearch,
  FaShare,
  FaTags,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { setNavigationBarTitle } from "zmp-sdk/apis";

// Main App Component (Blog Page)
const index: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { showMessage, startProgress, completeProgress } = useToasterContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInit, setPageInit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<postProps[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<postProps[]>([]);
  const [postCategories, setPostCategories] = useState<
    postCategoryProps[] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filter, setFilter] = useState<filterProps>({
    search: searchParams.get("search") || "",
    order: searchParams.get("order") || "desc",
    start_date: searchParams.get("start_date") || null,
    end_date: searchParams.get("end_date") || null,
    paged: Number(searchParams.get("paged")) || 1,
    per_page: Number(searchParams.get("per_page")) || 12,
    category_id: searchParams.get("category_id") || null,
  });

  const [meta, setMeta] = useState<metaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: 0,
  });

  const handleFindManyData = async (filter: Record<string, any>) => {
    try {
      startProgress();
      setIsLoading(true);
      const query = filterParams(filter);
      setSearchParams(query);
      const response = await findManyPosts({
        ...query,
        is_featured: 0,
      });

      if (response && !response.error) {
        const { data, meta } = response;
        setData(data);
        setMeta(meta);
      }
      setPageInit(true);
    } finally {
      setIsLoading(false);
      completeProgress();
    }
  };

  const handleFindFeaturedPosts = async () => {
    try {
      const response = await findManyPosts({
        is_featured: 1,
        per_page: 3,
      });

      if (response && !response.error) {
        const { data } = response;
        setFeaturedPosts(data);
      }
    } catch (error) {
      console.error("Error fetching featured posts:", error);
    }
  };

  const handleFindManyCategoryData = async (filter: Record<string, any>) => {
    try {
      startProgress();
      setSearchParams(filter);
      const response = await findManyPostCategories(filter);

      if (response && !response.error) {
        const { data } = response;
        setPostCategories(data);
      }
      setPageInit(true);
    } finally {
      completeProgress();
    }
  };

  useEffect(() => {
    setNavigationBarTitle({ title: "Cẩm nang" });
    handleFindManyData(filter);
    handleFindManyCategoryData({});
    handleFindFeaturedPosts();

    // Initialize search and category from URL params
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category_id"));
  }, []);

  useEffect(() => {
    if (pageInit) {
      handleFindManyData(filter);
    }
  }, [filter]);

  const handleSearch = (query: string) => {
    setFilter({ ...filter, search: query, paged: 1 });
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setFilter({
      ...filter,
      category_id: categoryId,
      paged: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, paged: page });
    scrollToTop();
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setFilter({ ...filter, per_page: newItemsPerPage });
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-[80px]">
      <main>
        {/* Search Section */}
        <section className="px-margin-main py-stack-md">
          <div className="bg-surface-container-low border border-surface-variant rounded-full flex items-center px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="material-symbols-outlined text-outline mr-3" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
            <input 
              className="bg-transparent border-none outline-none flex-1 font-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-0 p-0 text-[14px]" 
              placeholder="Tìm kiếm bài viết, công thức..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            />
          </div>
        </section>

        {/* Category Chips */}
        <section className="px-margin-main pb-stack-md flex gap-stack-sm overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleCategoryFilter(null)}
            className={`font-label-md px-5 py-2 rounded-full whitespace-nowrap shadow-sm transition-all text-xs border ${
                selectedCategory === null 
                ? "bg-primary-container text-on-primary border-primary-container" 
                : "bg-surface-container text-on-surface border-surface-variant hover:bg-surface-container-high"
            }`}
          >
            Tất cả
          </button>
          {postCategories?.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => handleCategoryFilter(cat.id.toString())}
              className={`font-label-md px-5 py-2 rounded-full whitespace-nowrap shadow-sm transition-all text-xs border ${
                  selectedCategory === cat.id.toString() 
                  ? "bg-primary-container text-on-primary border-primary-container" 
                  : "bg-surface-container text-on-surface border-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </section>

        {/* Featured Article */}
        {featuredPosts.length > 0 && selectedCategory === null && searchQuery === "" && (
          <section className="px-margin-main pb-stack-lg">
            <h2 className="font-headline-md text-on-background mb-stack-sm text-lg font-bold font-serif text-primary">Bài viết nổi bật</h2>
            <article 
              onClick={() => navigate(`/blog/${featuredPosts[0].slug}`)}
              className="bg-surface rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform cursor-pointer border border-[#EEEEEE]"
            >
              <div className="relative h-[200px] w-full">
                <img 
                  alt={featuredPosts[0].title} 
                  className="w-full h-full object-cover" 
                  src={getThumbnailUrl(featuredPosts[0].thumbnail)} 
                />
                <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container font-label-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  Đề xuất
                </div>
              </div>
              <div className="p-4">
                <span className="text-secondary font-label-md block mb-1 text-[11px] uppercase tracking-wider font-semibold">
                  {featuredPosts[0].postCategory?.name || "Sức khỏe & Đời sống"}
                </span>
                <h3 className="font-headline-sm font-serif font-bold text-on-surface mb-2 leading-snug line-clamp-2">
                  {featuredPosts[0].title}
                </h3>
                <p className="font-body-md text-on-surface-variant text-[13px] line-clamp-2 mb-3">
                  {featuredPosts[0].description}
                </p>
                <div className="flex items-center text-gray-500 font-label-md text-[11px] gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span> 
                    {new Date(featuredPosts[0].created_at).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 
                    5 phút đọc
                  </span>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Recent Articles List */}
        <section className="px-margin-main pb-safe-area-bottom">
          <div className="flex justify-between items-center mb-stack-sm">
            <h2 className="font-headline-md text-on-background text-lg font-bold font-serif text-primary">Mới cập nhật</h2>
          </div>
          
          {isLoading ? (
            <PageLoading height={"30vh"} />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {data.length > 0 ? data.map((post) => (
                  <article 
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="bg-surface rounded-xl p-3 flex gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.04)] active:bg-surface-container-low transition-colors cursor-pointer border border-surface-variant/50"
                  >
                    <img 
                      alt={post.title} 
                      className="w-[100px] h-[100px] rounded-lg object-cover flex-shrink-0" 
                      src={getThumbnailUrl(post.thumbnail)} 
                    />
                    <div className="flex flex-col justify-center flex-1 py-1">
                      <span className="text-secondary font-label-md text-[10px] uppercase tracking-wider mb-1.5 block font-semibold">
                        {post.postCategory?.name || "Tin tức"}
                      </span>
                      <h3 className="font-serif text-[14px] font-bold text-on-surface leading-snug line-clamp-2 mb-auto">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-gray-400 font-label-md text-[10px] gap-2 mt-2">
                        <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                        <span className="w-[3px] h-[3px] rounded-full bg-outline-variant"></span>
                        <span>3 phút đọc</span>
                      </div>
                    </div>
                  </article>
                )) : (
                  <div className="text-center py-10 bg-white rounded-xl border border-[#EEEEEE]">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">article</span>
                    <p className="text-gray-500 font-body-md text-sm">Không tìm thấy bài viết nào.</p>
                  </div>
                )}
              </div>
              
              {meta?.total > 12 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    meta={meta}
                    onChange={(value) => setFilter({ ...filter, ...value })}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default index;


