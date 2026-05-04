import { ProductItem } from '@/Templates/Product/types';
import { postProps } from '@shared/types/post';
import { getThumbnailUrl } from '@shared/utils/Hooks';

/**
 * Transform API product data (postProps) to ProductItem interface
 * This ensures compatibility between backend API and frontend template components
 */
export const transformProductData = (apiProduct: postProps): ProductItem => {
  // Extract price from product description or use default
  const extractPrice = (description?: string): number => {
    if (!description) return 0;
    
    // Try to extract price from description using regex
    // Look for patterns like "Price: 100000" or "Giá: 100,000đ"
    const priceMatch = description.match(/(?:price|giá|gia)[\s:]*([0-9,]+)/i);
    if (priceMatch) {
      return parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }
    
    // Default random price for demo (remove this in production)
    return Math.floor(Math.random() * 200000) + 50000;
  };

  // Extract rating from view count or use default
  const extractRating = (viewCount?: number): number => {
    if (!viewCount) return 4.0;
    
    // Convert view count to rating (max 5.0)
    const rating = Math.min(3.5 + (viewCount / 1000), 5.0);
    return Math.round(rating * 10) / 10; // Round to 1 decimal place
  };

  // Extract alcohol content from description
  const extractAlcohol = (description?: string): string | undefined => {
    if (!description) return undefined;
    
    const alcoholMatch = description.match(/([0-9.]+)%/);
    return alcoholMatch ? `${alcoholMatch[1]}%` : undefined;
  };

  // Extract origin from categories or description
  const extractOrigin = (categories: any[], description?: string): string => {
    // Check categories for origin hints
    const categoryTitles = categories.map(cat => cat.title?.toLowerCase() || '').join(' ');
    
    if (categoryTitles.includes('việt nam') || categoryTitles.includes('vietnam')) {
      return 'Việt Nam';
    }
    if (categoryTitles.includes('nhập khẩu') || categoryTitles.includes('imported')) {
      return 'Nhập Khẩu';
    }
    if (categoryTitles.includes('bỉ') || categoryTitles.includes('belgium')) {
      return 'Bỉ';
    }
    if (categoryTitles.includes('canada')) {
      return 'Canada';
    }
    if (categoryTitles.includes('đức') || categoryTitles.includes('germany')) {
      return 'Đức';
    }
    
    // Default origin
    return 'Không xác định';
  };

  // Get primary category
  const primaryCategory = apiProduct.categories?.[0]?.title || 'Bia';

  // Calculate prices with some having discounts
  const basePrice = extractPrice(apiProduct.description);
  const hasDiscount = Math.random() > 0.7; // 30% chance of discount
  const originalPrice = hasDiscount ? Math.floor(basePrice * 1.2) : undefined;

  return {
    id: apiProduct.id,
    name: apiProduct.title || apiProduct.name,
    price: basePrice,
    originalPrice,
    image: getThumbnailUrl(apiProduct.thumbnail),
    category: primaryCategory,
    rating: extractRating(apiProduct.view),
    description: apiProduct.description || '',
    alcohol: extractAlcohol(apiProduct.description),
    origin: extractOrigin(apiProduct.categories, apiProduct.description),
    soldCount: apiProduct.view, // Use view count as sold count
    isNew: isNewProduct(apiProduct.created_at),
    isFeatured: apiProduct.categories.some(cat => cat.title?.toLowerCase().includes('nổi bật')),
    isBestSelling: (apiProduct.view || 0) > 100, // Products with >100 views are best selling
  };
};

/**
 * Check if product is new (created within last 30 days)
 */
const isNewProduct = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return createdDate > thirtyDaysAgo;
};

/**
 * Transform array of API products to ProductItem array
 */
export const transformProductsData = (apiProducts: postProps[]): ProductItem[] => {
  return apiProducts.map(transformProductData);
};

/**
 * Filter products by type
 */
export const filterProductsByType = (products: ProductItem[], type: 'new' | 'featured' | 'bestSelling'): ProductItem[] => {
  switch (type) {
    case 'new':
      return products.filter(p => p.isNew);
    case 'featured':
      return products.filter(p => p.isFeatured);
    case 'bestSelling':
      return products.filter(p => p.isBestSelling);
    default:
      return products;
  }
};