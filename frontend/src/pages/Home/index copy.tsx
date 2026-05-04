import OaWidget from "@shared/components/OaWidget";
import { useToasterContext } from "@shared/components/ToasterContext";
import UserProfile from "@shared/components/UserProfile";
import { RootState } from "@shared/store";
import { ProductList } from "@/Templates/Product";
import CategoryList from "@/Templates/Product/CategoryList";
import { postCategoryProps } from "@shared/types/post";
import { productProps } from "@shared/types/product";
import { filterParams } from "@shared/utils/Hooks";
import { findManyProductCategories } from "@shared/utils/ProductCategories";
import { findManyProducts } from "@shared/utils/Products";
import { scrollToTop } from "@shared/utils/scrollUtils";
import { useEffect, useState } from "react";
import { FaBeer, FaGift, FaHeart, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Icon, Page, Swiper, Text } from "zmp-ui"; 
import axios from "axios";

// Mock data cho app bán bia
const heroSlides = [
  {
    id: 1,
    title: "Bia Thủ Công Cao Cấp",
    subtitle: "Thưởng thức hương vị đặc biệt từ những nhà sản xuất uy tín",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800",
    cta: "Khám phá ngay",
  },
  {
    id: 2,
    title: "Bia Nhập Khẩu Chính Hãng",
    subtitle: "Từ các thương hiệu nổi tiếng thế giới với chất lượng đảm bảo",
    image: "https://images.unsplash.com/photo-1574123156242-0117ca02b5ad?w=800",
    cta: "Xem sản phẩm",
  },
  {
    id: 3,
    title: "Khuyến Mãi Đặc Biệt",
    subtitle: "Giảm giá lên đến 30% cho đơn hàng đầu tiên, giao hàng miễn phí",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
    cta: "Mua ngay",
  },
];

console.log("import.meta.env.VITE_APP_NAME:", import.meta.env.VITE_APP_NAME);

const HomePage = () => {
  const navigate = useNavigate();
  const { startProgress, completeProgress } = useToasterContext();
  const [productCategories, setProductCategories] = useState<
    postCategoryProps[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [newProducts, setNewProducts] = useState<productProps[]>([]);
  const [newProductsLoading, setNewProductsLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  // Category icon helper
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      "Bia Craft": <FaBeer className="text-primary text-xl" />,
      "Bia Nhập Khẩu": <FaStar className="text-primary text-xl" />,
      "Bia Việt Nam": <FaHeart className="text-primary text-xl" />,
      "Bia Thủ Công": <FaGift className="text-primary text-xl" />,
      "Bia Cao Cấp": <FaStar className="text-primary text-xl" />,
      "Bia Tươi": <FaBeer className="text-primary text-xl" />,
    };
    return (
      iconMap[categoryName] || <FaBeer className="text-primary text-xl" />
    );
  };

  const handleFindProductCategories = async () => {
    try {
      setCategoriesLoading(true);
      const query = filterParams({ order: "desc", per_page: 12 });
      const response = await findManyProductCategories(query);
      if (response && !response.error) {
        const { data } = response;
        setProductCategories(data);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }; 

  // Fetch new products
  const handleFindNewProducts = async () => {
    try {
      setNewProductsLoading(true);
      const query = filterParams({ order: "desc", per_page: 6 });
      const response = await findManyProducts(query);
      if (response && !response.error) {
        const { data } = response;
        setNewProducts(data);
      }
    } catch (error) {
      console.error("Error fetching new products:", error);
    } finally {
      setNewProductsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    scrollToTop();

    handleFindProductCategories();
    handleFindNewProducts();
  }, []);

  return (
    <Page className="bg-background min-h-screen">
      {/* Hero Section với Swiper */}
      <h1></h1>
      <div className="relative">
        <Swiper className="rounded-0" autoplay duration={5000} loop>
          {heroSlides.map((slide) => (
            <Swiper.Slide key={slide.id}>
              <div
                className="relative h-60 rounded-0 bg-cover bg-center flex items-end"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative max-w-[3010px] z-10 p-6 text-white">
                  <h3 className="text-white mb-2 font-bold">{slide.title}</h3>
                  <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <button
                    className="bg-primary text-[#181a1b] hover:bg-[#d4b995] font-semibold px-3 py-2 text-xs rounded-lg"
                    onClick={() => navigate("/products")}
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </Swiper.Slide>
          ))}
        </Swiper>
      </div>

      <div className="px-3 mt-5">
        <OaWidget />
      </div>

      {user ? <UserProfile /> : ""}

      {/* Categories */}
      <CategoryList
        title={
          <>
            Danh Mục <span className="text-primary">Bia</span>
          </>
        }
        subtitle="Khám phá đa dạng các loại bia từ khắp nơi trên thế giới"
        categories={productCategories}
        columns={2}
        isLoading={categoriesLoading}
        className="bg-background"
        showViewAll={false}
      />

      {/* Featured Products */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center px-5">
            <h2 className="text-2xl uppercase font-bold text-primary font-serif mb-4">
              Sản Phẩm <span className="text-primary">Mới Nhất</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Cập nhật những sản phẩm bia mới nhất từ các thương hiệu uy tín
            </p>
          </div>

          <ProductList products={newProducts} isLoading={newProductsLoading} />

          <div className="text-center mt-3">
            <Link
              to="/products?sort=newest"
              className="inline-flex items-center gap-2 bg-primary hover:bg-[#d4b995] text-[#181a1b] px-3 py-2 rounded-lg text-xs uppercase font-semibold transition-all duration-300"
            >
              Xem Sản Phẩm Mới
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="p-6 bg-background mb-20">
        <h3 className="mb-4 text-primary font-serif text-2xl uppercase text-center font-bold">
          Cam kết <span className="text-primary">chất lượng</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-surface border border-[#eee] border border-[#eee] rounded-xl">
            <div className="w-[50px] h-[50px] bg-primary/20 rounded-full flex items-center justify-center">
              <Icon icon="zi-check" className="text-primary" />
            </div>
            <div className="flex-1">
              <Text size="small" className="font-semibold text-primary font-serif mb-1">
                Chính hãng 100%
              </Text>
              <Text size="xSmall" className="text-gray-500">
                Cam kết sản phẩm chính hãng từ các nhà sản xuất uy tín
              </Text>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-surface border border-[#eee] border border-[#eee] rounded-xl">
            <div className="w-[50px] h-[50px] bg-primary/20 rounded-full flex items-center justify-center">
              <Icon icon="zi-clock-1" className="text-primary" />
            </div>
            <div className="flex-1">
              <Text size="small" className="font-semibold text-primary font-serif mb-1">
                Giao hàng nhanh
              </Text>
              <Text size="xSmall" className="text-gray-500">
                Giao hàng tận nơi trong 2-4 giờ tại TP.HCM và Hà Nội
              </Text>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-surface border border-[#eee] border border-[#eee] rounded-xl">
            <div className="w-[50px] h-[50px] bg-primary/20 rounded-full flex items-center justify-center">
              <Icon icon="zi-check" className="text-primary" />
            </div>
            <div className="flex-1">
              <Text size="small" className="font-semibold text-primary font-serif mb-1">
                Bảo hành chất lượng
              </Text>
              <Text size="xSmall" className="text-gray-500">
                Đổi trả miễn phí nếu không hài lòng với sản phẩm
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;


