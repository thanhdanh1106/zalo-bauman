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

  const handleFetchData = async () => {
    try {
      setCategoriesLoading(true);
      setProductsLoading(true);
      setBannersLoading(true);

      const [catRes, prodRes, bannerRes] = await Promise.all([
        findManyProductCategories(filterParams({ per_page: 12 })),
        findManyProducts(filterParams({ per_page: 12 })),
        findManyBanners()
      ]);

      if (catRes && !catRes.error) setProductCategories(catRes.data);
      if (prodRes && !prodRes.error) {
        setNewProducts(prodRes.data.slice(0, 6)); // First 6 for new
        setBestSellers(prodRes.data.slice(0, 4)); // First 4 for best seller mock
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
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </div>
          <input 
            className="w-full bg-surface-container-low text-on-surface font-sans text-sm rounded-full py-3 pl-12 pr-4 border border-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm placeholder:text-on-surface-variant/70" 
            placeholder="Tìm kiếm sản phẩm..." 
            type="text"
          />
        </div>

        {/* Hero Banner */}
        <section className="relative w-full h-[200px] rounded-xl overflow-hidden shadow-md">
          <Swiper 
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000 }} 
            pagination={{ clickable: true }}
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
                      onClick={() => link && window.open(link, '_blank')}
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
    </Page>
  );
};

export default HomePage;
