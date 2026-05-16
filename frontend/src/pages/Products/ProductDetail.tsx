import PageLoading from "@shared/components/PageLoading";
import { useToasterContext } from "@shared/components/ToasterContext";
import { useCart } from "@shared/hooks/useCart";
import { useWishlist } from "@shared/hooks/useWishlist";
import { productProps } from "@shared/types/product";
import { formatCurrency, getThumbnailUrl } from "@shared/utils/Hooks";
import { findManyProducts, findOneProductByName, createProductReview } from "@shared/utils/Products";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination as SwipperPagination, A11y, Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { openShareSheet, openWebview, setNavigationBarTitle } from "zmp-sdk/apis";
import { Modal, Box, Button } from "zmp-ui";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showMessage } = useToasterContext();

  const [product, setProduct] = useState<productProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<productProps[]>([]);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const response = await findOneProductByName(slug);

      if (!response.error) {
        setProduct(response.data);
        // Do NOT default selectedVariant to enforce explicit dropdown choice like user screenshot
        setSelectedVariant(null);
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

  const ZALO_APP_ID = import.meta.env.VITE_APP_ID || import.meta.env.APP_ID || '';
  const isInZalo = typeof (window as any).ZaloJavaScriptInterface !== 'undefined' || navigator.userAgent.toLowerCase().includes('zalo');
  const referralLink = product
    ? (ZALO_APP_ID && isInZalo
      ? `https://zalo.me/s/${ZALO_APP_ID}/?ref=${user?.id || ''}&product=${product.slug || product.id}`
      : `${window.location.origin}/products/${product.slug || product.id}?ref=${user?.id || ''}`)
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    showMessage("success", "Đã sao chép link tiếp thị liên kết!");
    setShowAffiliateModal(false);
  };

  const handleZaloShare = async () => {
    try {
      await openShareSheet({
        type: "link",
        data: {
          link: referralLink,
          title: product?.title || "Sản phẩm tuyệt vời",
          description: `Mua sắm sản phẩm chính hãng với nhiều ưu đãi hấp dẫn.`,
          thumbnail: product?.thumbnail ? getThumbnailUrl(product.thumbnail) : ""
        }
      });
      setShowAffiliateModal(false);
    } catch (err) {
      console.error(err);
      showMessage("error", "Không thể mở bảng chia sẻ Zalo");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;

    if (!user) {
      showMessage("error", "Vui lòng đăng nhập để viết đánh giá");
      setShowReviewModal(false);
      return;
    }

    if (!reviewContent.trim()) {
      showMessage("error", "Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await createProductReview(product.id, {
        title: reviewTitle.trim() || undefined,
        content: reviewContent.trim(),
        rating: reviewRating,
      });

      if (response && !response.error) {
        showMessage("success", "Đã gửi đánh giá thành công!");
        setShowReviewModal(false);
        setReviewTitle("");
        setReviewContent("");
        setReviewRating(5);
        fetchProduct();
      } else {
        const msg = response?.message || "Không thể gửi đánh giá. Vui lòng thử lại.";
        showMessage("error", msg === "Unauthenticated." ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." : msg);
      }
    } catch (err) {
      console.error(err);
      showMessage("error", "Đã có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get("ref");
    if (refParam) {
      localStorage.setItem("affiliate_ref", refParam);
    }
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

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  return (
    <div className="bg-background min-h-screen pb-[180px] antialiased">
      <main>
        {/* Image Gallery */}
        <section className="relative w-full aspect-square bg-white border-b border-gray-100 group">
          <Swiper
            modules={[SwipperPagination, A11y, Navigation]}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            className="h-full w-full product-detail-swiper"
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

          {/* Custom Navigation Buttons */}
          {gallery.length > 1 && (
            <>
              <button className="swiper-button-prev-custom absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="swiper-button-next-custom absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </>
          )}

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

          <div className="flex flex-wrap items-baseline gap-2 mb-3">
            <span className={`font-serif font-bold text-primary ${hasVariants && !selectedVariant ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
              {hasVariants
                ? selectedVariant
                  ? `${selectedVariant.effective_price.toLocaleString()} đ`
                  : `${Math.min(...product.variants.map((v: any) => v.effective_price)).toLocaleString()} đ – ${Math.max(...product.variants.map((v: any) => v.effective_price)).toLocaleString()} đ`
                : `${product.price?.toLocaleString()} đ`
              }
            </span>
            {((selectedVariant ? selectedVariant.old_price : product.price_old) || 0) > (selectedVariant ? selectedVariant.effective_price : product.price) && (
              <span className="font-sans text-xs sm:text-sm text-gray-400 line-through shrink-0">
                {(selectedVariant ? selectedVariant.old_price : product.price_old)?.toLocaleString()} đ
              </span>
            )}
          </div>

          {/* Promotional tags exactly matching user screenshot */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="border border-orange-500 text-orange-500 font-bold px-2 py-0.5 rounded text-xs font-sans bg-orange-50/50">
              Tích điểm đổi quà
            </span>
            <span className="border border-orange-500 text-orange-500 font-bold px-2 py-0.5 rounded text-xs font-sans bg-orange-50/50">
              Freeship đơn từ 200k
            </span>
          </div>

          {/* Rating Stars and Sold count matching user screenshot */}
          <div className="flex items-center gap-2 ">
            <div className="flex text-yellow-400 text-sm">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx}>★</span>
              ))}
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-green-600 font-medium text-xs font-sans">
              Lượt bán: {product.soldCount || 0}
            </span>
          </div>
          {/* Variants Selection Section - Precise Mockup Match */}
          {hasVariants && (
            <div id="variant-selection" className="py-2 mt-2 border-t border-gray-100">
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans font-bold text-base text-gray-800 shrink-0">
                  {product.variant_label || 'Khối lượng'}
                </span>
                <div className="relative flex-1 max-w-[220px]">
                  <select
                    value={selectedVariant?.id || ""}
                    onChange={(e) => {
                      const selected = product.variants.find((v: any) => v.id === Number(e.target.value));
                      setSelectedVariant(selected || null);
                    }}
                    className="w-full appearance-none bg-white border-2 border-primary/30 rounded-2xl py-3 pl-5 pr-10 text-sm text-gray-700 font-sans font-bold outline-none focus:border-primary cursor-pointer transition-all shadow-sm"
                  >
                    <option value="">Chọn một tùy chọn</option>
                    {product.variants.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.display_label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary flex items-center">
                    <span className="material-symbols-outlined text-2xl font-bold">expand_more</span>
                  </div>
                </div>
              </div>

              {selectedVariant && selectedVariant.image && (
                <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-2xl animate-fade-in border border-gray-100">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-white shadow-sm shrink-0">
                    <img src={selectedVariant.image} alt={selectedVariant.display_label} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm flex-1">
                    <span className="font-bold text-gray-800 block mb-1 leading-tight">{selectedVariant.display_label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold text-base">{selectedVariant.effective_price.toLocaleString()} đ</span>
                      {selectedVariant.old_price > selectedVariant.effective_price && (
                        <span className="text-xs text-gray-400 line-through">
                          {selectedVariant.old_price.toLocaleString()} đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Affiliate Marketing Banner matching user screenshot */}
          <div
            onClick={() => setShowAffiliateModal(true)}
            className="bg-gradient-to-r from-[#e6ffed] to-[#afffb2] rounded-2xl p-4 mt-4 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all shadow-sm mb-6 border border-[#afffb2]/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-500 shrink-0 shadow-sm border border-green-50">
                <span className="material-symbols-outlined text-2xl icon-fill">campaign</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-[15px] block leading-tight">
                  Tiếp thị liên kết
                </span>
                <span className="text-green-800 text-[9px] font-medium block mt-1 opacity-80">
                  Nhận điểm thưởng để đổi phần quà hấp dẫn
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-800 text-xl">chevron_right</span>
          </div>

          {/* Details Bar */}
          <div className="py-4 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-400" style={{ fontSize: '22px' }}>verified</span>
              <span className="text-[11px] font-sans font-bold text-gray-600 uppercase tracking-widest">Chính hãng 100%</span>
            </div>
          </div>
        </section>



        {/* Details Section */}
        <section className="p-margin-main bg-white mb-2 shadow-sm">
          <h2 className="font-serif font-bold text-xl text-[#8B0000] uppercase mb-4 flex items-center gap-2">
            Thông tin chi tiết
          </h2>
          <div className="rich-text-content">
            <div
              onClick={(e) => {
                const target = e.target as HTMLElement;
                const anchor = target.closest('a');
                if (anchor) {
                  const href = anchor.getAttribute('href');
                  if (href) {
                    e.preventDefault();
                    if (href.startsWith('/') && !href.startsWith('//')) {
                      navigate(href);
                    } else {
                      try {
                        openWebview({
                          url: href,
                          config: { style: 'normal', leftButton: 'back' }
                        });
                      } catch {
                        window.open(href, '_blank');
                      }
                    }
                  }
                }
              }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

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

        {/* Customer Reviews Section */}
        <section className="p-margin-main bg-white mb-2 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-on-surface">Đánh giá sản phẩm</h2>
              <span className="text-xs font-sans font-normal text-gray-500 block mt-0.5">
                {product.comments?.length || 0} đánh giá
              </span>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  showMessage("error", "Vui lòng đăng nhập để viết đánh giá");
                  return;
                }
                setShowReviewModal(true);
              }}
              className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg font-sans font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">edit_square</span>
              Viết đánh giá
            </button>
          </div>

          {product.comments && product.comments.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {product.comments.map((comment) => (
                <div key={comment.id} className="py-4 first:pt-0 last:pb-0 animate-fade-in">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Avatar with fallback to initials */}
                    {comment.customer?.avatar ? (
                      <img
                        src={getThumbnailUrl(comment.customer.avatar)}
                        alt={comment.customer?.name || "Khách hàng"}
                        className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0 bg-gray-50"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-9 h-9 rounded-full shrink-0 bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/10"
                      style={{ display: comment.customer?.avatar ? 'none' : 'flex' }}
                    >
                      {(comment.customer?.name || 'K').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block font-sans">
                        {comment.customer?.name || "Khách hàng"}
                      </span>
                      <div className="flex text-yellow-400 text-[10px] mt-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={idx < comment.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-[10px] text-gray-400 font-sans">
                      {comment.created_at}
                    </span>
                  </div>
                  {comment.title && (
                    <h4 className="font-bold text-xs text-gray-800 mb-1 font-sans">{comment.title}</h4>
                  )}
                  <div
                    className="text-xs text-gray-600 font-sans leading-relaxed rich-text-content"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-400 text-xs font-sans">
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm!
            </div>
          )}
        </section>

        {/* Affiliate Modal / Actions */}
        <Modal
          visible={showAffiliateModal}
          title="Tiếp thị liên kết"
          onClose={() => setShowAffiliateModal(false)}
          verticalActions
        >
          <Box className="p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">campaign</span>
            </div>
            <h3 className="font-bold text-sm text-gray-900 mb-1 font-sans">Chia sẻ & Nhận phần thưởng</h3>
            <p className="text-xs text-gray-600 mb-4 font-sans">
              Khi khách hàng mua sắm thành công qua đường dẫn tiếp thị của bạn, bạn sẽ nhận được điểm thưởng để đổi phần quà voucher hấp dẫn.
            </p>

            <div className="w-full bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-center gap-2 mb-4 text-left">
              <span className="text-[11px] text-gray-600 font-mono truncate flex-1 select-all">
                {referralLink}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mb-3">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 bg-white border border-gray-300 rounded-xl font-bold text-xs text-gray-700 active:scale-95 transition-transform shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Sao chép link
              </button>
              <button
                onClick={handleZaloShare}
                className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs active:scale-95 transition-transform shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Gửi qua Zalo
              </button>
            </div>

            <Button
              className="w-full mt-2"
              variant="secondary"
              onClick={() => setShowAffiliateModal(false)}
            >
              Đóng
            </Button>
          </Box>
        </Modal>

        {/* Write Review Modal */}
        <Modal
          visible={showReviewModal}
          title="Viết đánh giá sản phẩm"
          onClose={() => setShowReviewModal(false)}
          verticalActions
        >
          <Box className="p-2">
            <form onSubmit={handleSubmitReview} className="space-y-2">
              <div className="text-center">
                <span className="text-xs text-gray-500 block mb-1 font-sans">Đánh giá của bạn</span>
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReviewRating(idx + 1)}
                      className="p-1 focus:outline-none transition-transform active:scale-125"
                    >
                      <span className={`text-2xl ${idx < reviewRating ? "text-yellow-400" : "text-gray-200"}`}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-sans">Tiêu đề (Không bắt buộc)</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Ví dụ: Sản phẩm chất lượng tuyệt vời"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-sans outline-none focus:border-primary/40 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-sans">Nội dung đánh giá *</label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  required
                  rows={4}
                  placeholder="Chia sẻ cảm nhận chi tiết của bạn về sản phẩm này..."
                  className="w-full p-3 border border-gray-200 rounded-lg text-xs font-sans outline-none focus:border-primary/40 bg-gray-50/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs font-sans active:scale-95 transition-transform"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs font-sans active:scale-95 transition-transform shadow-sm disabled:opacity-50"
                >
                  {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </form>
          </Box>
        </Modal>
      </main>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 p-3 pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] max-w-[768px] mx-auto" style={{ left: '50%', transform: 'translateX(-50%)' }}>
        {/* Selection Summary (Mini version) */}
        {hasVariants && (
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider leading-none mb-1">
                {product.variant_label || 'Khối lượng'}
              </span>
              <span className={`text-xs font-bold font-sans ${selectedVariant ? 'text-primary' : 'text-orange-500'}`}>
                {selectedVariant ? selectedVariant.display_label : 'Chưa chọn phân loại'}
              </span>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-600 active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="w-8 text-center font-bold text-sm font-sans">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>
        )}

        {!hasVariants && (
          <div className="flex items-center justify-end mb-3 px-1">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-600 active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="w-8 text-center font-bold text-sm font-sans">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 items-center">
          <div className="flex-1 flex flex-col justify-center leading-tight">
            <span className="text-[11px] text-gray-400 font-sans uppercase tracking-wider font-bold mb-0.5">Tổng cộng</span>
            <span className="text-xl font-serif font-bold text-primary">
              {((selectedVariant ? selectedVariant.effective_price : (product.price || 0)) * quantity).toLocaleString()} đ
            </span>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (hasVariants && !selectedVariant) {
                  const element = document.getElementById('variant-selection');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  showMessage("error", "Vui lòng chọn một tùy chọn phân loại");
                  return;
                }
                const productToCart = selectedVariant ? {
                  ...product,
                  title: `${product.title} (${selectedVariant.display_label})`,
                  price: selectedVariant.effective_price,
                  sku: selectedVariant.sku || product.sku,
                  thumbnail: selectedVariant.image ? { original_url: selectedVariant.image } : product.thumbnail
                } : product;
                addToCart(productToCart, quantity, selectedVariant?.display_label || undefined);
              }}
              className="w-[54px] h-[54px] rounded-2xl border-2 border-primary text-primary bg-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[24px]">add_shopping_cart</span>
            </button>
            <button
              onClick={() => {
                if (hasVariants && !selectedVariant) {
                  const element = document.getElementById('variant-selection');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  showMessage("error", "Vui lòng chọn một tùy chọn phân loại");
                  return;
                }
                const productToCart = selectedVariant ? {
                  ...product,
                  title: `${product.title} (${selectedVariant.display_label})`,
                  price: selectedVariant.effective_price,
                  sku: selectedVariant.sku || product.sku,
                  thumbnail: selectedVariant.image ? { original_url: selectedVariant.image } : product.thumbnail
                } : product;
                addToCart(productToCart, quantity, selectedVariant?.display_label || undefined);
                navigate("/cart");
              }}
              className="px-6 h-[54px] rounded-2xl bg-primary text-white font-serif font-bold text-lg flex items-center justify-center active:scale-95 transition-transform shadow-lg"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
