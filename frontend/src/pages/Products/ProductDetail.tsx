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
import { Pagination as SwipperPagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { setNavigationBarTitle, openShareSheet } from "zmp-sdk/apis";
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

  const referralLink = `${window.location.origin}/products/${product?.slug || product?.id}?ref=${user?.id || ""}`;

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
        showMessage("error", response?.message || "Không thể gửi đánh giá");
      }
    } catch (err) {
      console.error(err);
      showMessage("error", "Đã có lỗi xảy ra");
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
          <div className="flex items-center gap-2 mb-4">
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

          {/* Affiliate Marketing Banner matching user screenshot */}
          <div
            onClick={() => setShowAffiliateModal(true)}
            className="bg-gradient-to-r from-[#e5fce3] to-[#80f977] rounded-2xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all shadow-sm mb-4 border border-[#80f977]/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-xl">campaign</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm block leading-tight">
                  Tiếp thị liên kết
                </span>
                <span className="text-green-800 text-[11px] font-medium text-[7px] block mt-0.5">
                  Nhận điểm thưởng để đổi phần quà voucher hấp dẫn
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-800 text-lg">chevron_right</span>
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

        {/* Variants Selection Section matching exact UI mockup */}
        {hasVariants && (
          <section className="p-margin-main bg-white mb-2 shadow-sm border-t border-gray-50">
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="font-sans font-bold text-sm text-gray-800 shrink-0">
                {product.variant_label || 'Khối lượng'}
              </span>
              <div className="relative flex-1 max-w-[240px]">
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) => {
                    const selected = product.variants.find((v: any) => v.id === Number(e.target.value));
                    setSelectedVariant(selected || null);
                  }}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm text-gray-800 font-sans outline-none focus:border-primary/50 cursor-pointer shadow-sm"
                >
                  <option value="">Chọn một tùy chọn</option>
                  {product.variants.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.display_label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </div>
              </div>
            </div>
            {selectedVariant && selectedVariant.image && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-lg animate-fade-in">
                <img src={selectedVariant.image} alt={selectedVariant.display_label} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                <div className="text-xs">
                  <span className="font-bold text-gray-700 block">{selectedVariant.display_label}</span>
                  <span className="text-primary font-bold">{selectedVariant.effective_price.toLocaleString()} đ</span>
                </div>
              </div>
            )}
          </section>
        )}



        {/* Details Section */}
        <section className="p-margin-main bg-white mb-2 shadow-sm">
          <h2 className="font-serif font-bold text-xl text-red-800 uppercase   text-on-surface mb-4 flex items-center gap-2">

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
                    <img
                      src={comment.customer?.avatar || "https://placehold.co/100x100?text=U"}
                      alt={comment.customer?.name || "Khách hàng"}
                      className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0"
                    />
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
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 p-4 pb-safe flex gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] max-w-[768px] mx-auto" style={{ left: '50%', transform: 'translateX(-50%)' }}>
        <button
          onClick={() => {
            if (hasVariants && !selectedVariant) {
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
            addToCart(productToCart, 1, selectedVariant?.display_label || undefined);
          }}
          className="flex-1 h-[52px] rounded-xl border border-primary text-primary bg-white font-serif font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>add_shopping_cart</span>
          Thêm vào giỏ
        </button>
        <button
          onClick={() => {
            if (hasVariants && !selectedVariant) {
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
            addToCart(productToCart, 1, selectedVariant?.display_label || undefined);
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
