import { useToasterContext } from "@shared/components/ToasterContext";
import { postCategoryProps } from "@shared/types/post";
import { productProps } from "@shared/types/product";
import { filterParams } from "@shared/utils/Hooks";
import { findManyProductCategories } from "@shared/utils/ProductCategories";
import { findManyProducts } from "@shared/utils/Products";
import { findManyBanners } from "@shared/utils/Banners";
import { bannerProps } from "@shared/types/banner";
import { scrollToTop } from "@shared/utils/scrollUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page, Swiper as ZMPSwiper } from "zmp-ui";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HomePage = () => {
  const navigate = useNavigate();
  const [productCategories, setProductCategories] = useState<postCategoryProps[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [newProducts, setNewProducts] = useState<productProps[]>([]);
  const [bestSellers, setBestSellers] = useState<productProps[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [banners, setBanners] = useState<bannerProps[] | string[]>([]);
  const [bannersLoading, setBannersLoading] = useState(false);

  // Search Modal States
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<productProps[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!showSearchModal) return;
      setIsSearching(true);
      try {
        const res = await findManyProducts(filterParams({ search: searchQuery || undefined, per_page: 50 }));
        if (res && !res.error) {
          setSearchResults(res.data || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showSearchModal]);

  const handleOpenSearchModal = () => {
    setShowSearchModal(true);
  };

  const handleFetchData = async () => {
    try {
      setCategoriesLoading(true);
      setProductsLoading(true);
      setBannersLoading(true);

      const [catRes, newProdRes, bestSellerRes, bannerRes] = await Promise.all([
        findManyProductCategories(filterParams({ per_page: 12 })),
        findManyProducts(filterParams({ per_page: 6, sort: 'created_at', order: 'desc' })),
        findManyProducts(filterParams({ per_page: 6, sort: 'sold_count', order: 'desc' })),
        findManyBanners()
      ]);

      if (catRes && !catRes.error) setProductCategories(catRes.data);
      if (newProdRes && !newProdRes.error) {
        setNewProducts(newProdRes.data || []);
      }
      if (bestSellerRes && !bestSellerRes.error) {
        setBestSellers(bestSellerRes.data || []);
      }
      if (bannerRes && !bannerRes.error) {
        setBanners(bannerRes.data || []);
      }

    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setCategoriesLoading(false);
      setProductsLoading(false);
      setBannersLoading(false);
    }
  };

  useEffect(() => {
    scrollToTop();
    handleFetchData();
  }, []);

  return (
    <Page className="bg-background text-on-background min-h-screen pb-[80px]">
      <main className="px-margin-main pt-stack-md flex flex-col gap-stack-lg">
        {/* Search Bar */}
        <div className="relative w-full" onClick={handleOpenSearchModal}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </div>
          <input
            readOnly
            className="w-full bg-surface-container-low text-on-surface font-sans text-sm rounded-full py-3 pl-12 pr-4 border border-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm placeholder:text-on-surface-variant/70 cursor-pointer"
            placeholder="Tìm kiếm sản phẩm..."
            type="text"
          />
        </div>

        {/* Hero Banner */}
        <section className="relative w-full h-[200px] rounded-xl overflow-hidden shadow-md">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000 }}

            loop={banners.length > 1}
            className="h-full"
          >
            {banners.length > 0 ? (
              banners.map((banner: any, index) => {
                const imageUrl = banner.image;
                const title = banner.title || "Nhân Sâm Baumann";
                const subtitle = banner.subtitle || "Khởi nguồn sức khỏe";
                const link = banner.link || null;

                return (
                  <SwiperSlide key={index}>
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => {
                        if (!link) return;
                        if (link.startsWith("http://") || link.startsWith("https://")) {
                          window.location.href = link;
                        } else {
                          navigate(link);
                        }
                      }}
                    >
                      <img alt={title} className="w-full h-full object-cover" src={imageUrl} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 z-10 text-white">
                        <h2 className="font-serif text-lg font-bold mb-1 drop-shadow-md">{title}</h2>
                        <p className="font-sans text-xs opacity-90">{subtitle}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <SwiperSlide>
                <div className="relative w-full h-full bg-neutral">
                  <img
                    alt="Banner"
                    className="w-full h-full object-cover opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwj8d4493O73jBbEJQuMCnRYYTJozqGT5MWlyEq_NPfVOKWBTGNTOnheYpQyy9NAiYzGqMgJcnFYcft5qcOkDkECK8pe6cTPg0iu9M_0R_7KAL6dOBgyAZmtYLd_RWGAqXoTCRe3SbutiyYN8S8-cSk8GwFDhWzaAdkJgKHcnNIeUFpM9Hx90FcoZmUuINEBYvPMkJC4NQymR51snLsZNbwOU-ZJd4yJm6g6CoWGKggVRjRRhjoskZCvuuEQwzwMdBOPeajAEN2qQ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <h2 className="font-serif text-lg font-bold mb-1 drop-shadow-md">Nhân Sâm Baumann</h2>
                    <p className="font-sans text-xs opacity-90">Khởi nguồn sức khỏe</p>
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </section>

        {/* Categories */}
        <section>
          <div className="flex justify-between items-center mb-stack-md">
            <h3 className="font-serif text-lg font-bold text-on-background">Danh Mục</h3>
            <button onClick={() => navigate("/products")} className="font-sans text-xs font-semibold text-primary">Xem tất cả</button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-stack-md pb-2">
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-surface-container-high"></div>
                  <div className="w-10 h-2 bg-surface-container-high rounded"></div>
                </div>
              ))
            ) : productCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?category_ids=${cat.id}`)}
                className="flex flex-col items-center gap-2 min-w-[72px]"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm overflow-hidden border border-secondary/20">
                  <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                </div>
                <span className="font-sans text-[10px] font-semibold text-on-surface text-center line-clamp-1">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section>
          <div className="flex justify-between items-center mb-stack-md">
            <h3 className="font-serif text-lg font-bold text-on-background">Sản Phẩm Bán Chạy</h3>
            <button onClick={() => navigate("/products")} className="font-sans text-xs font-semibold text-primary">Xem tất cả</button>
          </div>
          <Swiper
            slidesPerView={2.3}
            spaceBetween={12}
            className="pb-2"
          >
            {productsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-surface-container-low rounded-xl h-48 animate-pulse"></div>
                </SwiperSlide>
              ))
            ) : bestSellers.map((prod) => (
              <SwiperSlide key={prod.id}>
                <div
                  onClick={() => navigate(`/products/${prod.slug}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-surface-variant flex flex-col px-0.5 pt-0.5 h-full"
                >
                  <div className="relative w-full aspect-square bg-surface-container rounded-lg overflow-hidden">
                    <img alt={prod.name} className="w-full h-full object-cover" src={prod.image} />
                    <div className="absolute top-2 left-2 text-white flex items-center justify-center drop-shadow-md">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </div>
                  </div>
                  <div className="p-stack-sm flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="font-sans text-[11px] font-semibold text-on-surface line-clamp-2 mb-1 leading-tight">{prod.name}</h4>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                      <span className="font-serif text-sm font-bold text-primary">{prod.price.toLocaleString()}đ</span>
                      <span className="text-[9px] font-sans text-on-surface-variant font-medium">
                        {prod.soldCount ? `Đã bán ${prod.soldCount}` : `${prod.views || 0} xem`}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* New Products Section */}
        <section className="mb-24">
          <div className="flex justify-between items-center mb-stack-md">
            <h3 className="font-serif text-lg font-bold text-on-background">Sản Phẩm Mới</h3>
            <button onClick={() => navigate("/products")} className="font-sans text-xs font-semibold text-primary">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-2 gap-gutter-grid">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-container-low rounded-xl h-60 animate-pulse"></div>
              ))
            ) : newProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/products/${prod.slug}`)}
                className="bg-white rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-surface-variant flex flex-col p-1"
              >
                <div className="relative w-full aspect-square bg-surface-container rounded-lg overflow-hidden">
                  <img alt={prod.name} className="w-full h-full object-cover" src={prod.image} />
                  <div className="absolute top-2 left-2 text-white flex items-center justify-center drop-shadow-md">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-primary text-white font-sans text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Mới</div>
                </div>
                <div className="p-stack-sm flex flex-col flex-grow justify-between">
                  <div>
                    <h4 className="font-sans text-[11px] font-semibold text-on-surface line-clamp-2 mb-1 leading-tight">{prod.name}</h4>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <span className="font-serif text-sm font-bold text-primary">{prod.price.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Stunning Live Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col max-w-[768px] mx-auto animate-fade-in">
          {/* Header Search Input */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10 shadow-sm">
            <div className="relative flex-1">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-gray-50 text-gray-800 text-sm rounded-xl py-2.5 pl-4 pr-10 outline-none border border-transparent focus:border-primary/30 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowSearchModal(false)}
              className="px-2 py-1.5 font-sans font-bold text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-xl">cancel</span>
            </button>
          </div>

          {/* Search Results Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa]">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary mb-2">refresh</span>
                <span className="text-xs font-semibold">Đang tìm kiếm...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                  {searchQuery ? `Kết quả tìm kiếm (${searchResults.length})` : "Sản phẩm gợi ý"}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setShowSearchModal(false);
                        navigate(`/products/${prod.slug}`);
                      }}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100/80 flex flex-col p-1.5 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2 flex flex-col grow justify-between">
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1 leading-snug">
                          {prod.name}
                        </h4>
                        <span className="font-serif text-sm font-bold text-primary">
                          {prod.price.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
                  <span className="material-symbols-outlined text-3xl">search_off</span>
                </div>
                <h4 className="text-sm font-bold text-gray-700 mb-1">Không tìm thấy sản phẩm</h4>
                <p className="text-xs text-gray-400">Thử tìm kiếm với từ khóa khác xem sao nhé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
};

export default HomePage;
