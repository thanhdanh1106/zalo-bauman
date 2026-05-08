import PageLoading from "@shared/components/PageLoading";
import { useCart } from "@shared/hooks/useCart";
import { useWishlist } from "@shared/hooks/useWishlist";
import { productProps } from "@shared/types/product";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";
import { findManyProducts, findOneProductByName } from "@shared/utils/Products";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination as SwipperPagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { setNavigationBarTitle } from "zmp-sdk/apis";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<productProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<productProps[]>([]);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedGram, setSelectedGram] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const response = await findOneProductByName(slug);
        
      if (!response.error) {
        setProduct(response.data);
        // Set default gram option if available
        if (response.data.is_sold_by_gram && response.data.gram_options && response.data.gram_options.length > 0) {
          setSelectedGram(response.data.gram_options[0].unit);
        }
      }
      else setError(response.message);
    } catch (err) {
      setError("Không thể tải dữ liệu sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const response = await findManyProducts({ per_page: 6 });
      if (!response.error) setRelatedProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchRelated();
  }, [slug]);

  useEffect(() => {
    if (product?.title) {
      setNavigationBarTitle({ title: product.title });
    }
  }, [product?.title]);

  if (isLoading) return <PageLoading height={500} />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background p-10 text-center">
        <h2 className="text-primary font-serif font-bold text-xl mb-4">Sản phẩm không tồn tại</h2>
        <button onClick={() => navigate("/products")} className="text-primary underline">Quay lại cửa hàng</button>
      </div>
    );
  }

  const gallery = [
    product.thumbnail,
    ...(product.gallery || [])
  ].filter(Boolean);

  return (
    <div className="bg-background min-h-screen pb-[100px] antialiased">
      <main>
        {/* Image Gallery */}
        <section className="relative w-full aspect-square bg-white border-b border-gray-100">
          <Swiper
            modules={[SwipperPagination, A11y]}
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {gallery.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img 
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                  src={getThumbnailUrl(img)} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.is_featured && (
              <div className="bg-secondary-container text-on-secondary-container font-sans font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] icon-fill">local_fire_department</span>
                Bán chạy
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="p-margin-main bg-white rounded-b-2xl shadow-sm mb-2 relative z-10">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="font-serif font-bold text-xl text-on-surface leading-tight">
              {product.title}
            </h1>
            <button 
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-full transition-all active:scale-90 ${isInWishlist(product.id) ? 'text-primary' : 'text-gray-400'}`}
            >
              <span className={`material-symbols-outlined ${isInWishlist(product.id) ? 'icon-fill' : ''}`}>favorite</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="font-serif font-bold text-2xl text-primary">
              {product.price.toLocaleString()}đ
            </span>
            {product.price_old && product.price_old > product.price && (
              <span className="font-sans text-sm text-gray-400 line-through">
                {product.price_old.toLocaleString()}đ
              </span>
            )}
          </div>

          {/* Details Bar */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>verified</span>
              <span className="text-[10px] font-sans font-semibold text-gray-500 uppercase tracking-widest">Chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>local_shipping</span>
              <span className="text-[10px] font-sans font-semibold text-gray-500 uppercase tracking-widest">Giao nhanh 2h</span>
            </div>
          </div>
        </section>

        {/* Gram Selection Section */}
        {product.is_sold_by_gram && product.gram_options && product.gram_options.length > 0 && (
          <section className="p-margin-main bg-white mb-2 shadow-sm">
            <h2 className="font-serif font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary icon-fill">scale</span>
              Chọn {product.sales_unit || 'trọng lượng'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.gram_options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGram(opt.unit)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all font-sans font-semibold text-sm ${
                    selectedGram === opt.unit
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-gray-100 bg-gray-50 text-gray-500'
                  }`}
                >
                  {opt.unit}
                </button>
              ))}
            </div>
            {product.min_gram && (
              <p className="mt-3 text-xs text-gray-400 font-sans italic">
                * Mua tối thiểu từ {product.min_gram} {product.sales_unit || 'gram'}
              </p>
            )}
          </section>
        )}

        {/* Details Section */}
        <section className="p-margin-main bg-white mb-2 shadow-sm">
          <h2 className="font-serif font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary icon-fill">info</span>
            Thông tin chi tiết
          </h2>
          <div className="rich-text-content">
             <div dangerouslySetInnerHTML={{ __html: product.description }} />
             
             {/* Physical dimensions */}
             {(product.weight || product.dimensions || product.volume) && (
               <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-1 gap-2">
                 {product.weight && (
                   <div className="flex justify-between">
                     <span className="font-semibold text-gray-500 text-sm">Khối lượng:</span>
                     <span className="text-gray-800 text-sm">{product.weight} kg</span>
                   </div>
                 )}
                 {product.dimensions && (
                   <div className="flex justify-between">
                     <span className="font-semibold text-gray-500 text-sm">Kích thước:</span>
                     <span className="text-gray-800 text-sm">{product.dimensions}</span>
                   </div>
                 )}
                 {product.volume && (
                   <div className="flex justify-between">
                     <span className="font-semibold text-gray-500 text-sm">Thể tích:</span>
                     <span className="text-gray-800 text-sm">{product.volume} L</span>
                   </div>
                 )}
               </div>
             )}

             {/* Dynamic attributes if any */}
             {product.sku && (
               <div className="pt-4 border-t border-gray-50 flex justify-between mt-2">
                 <span className="font-semibold text-gray-500">Mã sản phẩm (SKU):</span>
                 <span className="text-gray-800">{product.sku}</span>
               </div>
             )}
          </div>
        </section>

        {/* Related Products */}
        <section className="py-margin-main bg-white mb-2 shadow-sm">
          <div className="px-margin-main mb-4 flex justify-between items-center">
            <h2 className="font-serif font-bold text-lg text-on-surface">Sản phẩm cùng loại</h2>
            <Link to="/products" className="font-sans font-semibold text-xs text-primary">Xem tất cả</Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 px-margin-main pb-4 no-scrollbar">
            {relatedProducts.map((p) => (
              <Link 
                key={p.id} 
                to={`/products/${p.slug}`} 
                className="min-w-[160px] max-w-[160px] bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col active:scale-[0.98] transition-transform"
              >
                <div className="w-full aspect-square bg-gray-50">
                  <img alt={p.title} className="w-full h-full object-cover" src={getThumbnailUrl(p.thumbnail)} />
                </div>
                <div className="p-3 flex flex-col grow">
                  <h3 className="font-sans font-semibold text-xs text-on-surface line-clamp-2 mb-2 leading-tight">{p.title}</h3>
                  <div className="mt-auto">
                    <span className="font-serif font-bold text-sm text-primary">{p.price.toLocaleString()}đ</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 p-4 pb-safe flex gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] max-w-[768px] mx-auto" style={{ left: '50%', transform: 'translateX(-50%)' }}>
        <button 
          onClick={() => addToCart(product, 1, selectedGram || undefined)}
          className="flex-1 h-[52px] rounded-xl border border-primary text-primary bg-white font-serif font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>add_shopping_cart</span>
          Thêm vào giỏ
        </button>
        <button 
          onClick={() => {
            addToCart(product, 1, selectedGram || undefined);
            navigate("/cart");
          }}
          className="flex-1 h-[52px] rounded-xl bg-primary text-white font-serif font-bold text-base flex items-center justify-center active:scale-95 transition-transform shadow-md hover:opacity-90"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
