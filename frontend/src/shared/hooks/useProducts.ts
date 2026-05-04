import { metaProps } from '@shared/types/meta';
import { postProps } from '@shared/types/post';
import { filterParams } from '@shared/utils/Hooks';
import { findManyProducts } from '@shared/utils/Products';
import { useEffect, useState } from 'react';

interface UseProductsParams {
  status?: 'published' | 'draft' | 'pending';
  categories?: number[];
  featured?: boolean;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
}

interface UseProductsReturn {
  products: postProps[];
  loading: boolean;
  error: string | null;
  meta: metaProps;
  refetch: () => void;
}

export const useProducts = (params: UseProductsParams = {}): UseProductsReturn => {
  const [products, setProducts] = useState<postProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<metaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: 0,
  });

  const {
    status = 'published',
    categories,
    featured,
    limit = 10,
    order = 'desc',
    orderBy = 'created_at'
  } = params;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filter parameters similar to Admin logic
      const filter = {
        status,
        per_page: limit,
        order,
        orderBy,
        ...(categories && categories.length > 0 && { categories }),
        ...(featured && { featured: 1 }),
      };

      // Use the same filterParams function as Admin
      const query = filterParams(filter);
      const response = await findManyProducts(query);

      if (response && !response.error) {
        const { data, meta: responseMeta } = response;
        setProducts(data || []);
        setMeta(responseMeta || {
          total: 0,
          current_page: 0,
          from: 0,
          last_page: 0,
          per_page: 0,
        });
      } else {
        setError(response?.message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('An error occurred while fetching products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, categories, featured, limit, order, orderBy]);

  return {
    products,
    loading,
    error,
    meta,
    refetch: fetchProducts,
  };
};

// Helper hooks for specific product types
export const useFeaturedProducts = (limit = 6) => {
  return useProducts({
    status: 'published',
    featured: true,
    limit,
    orderBy: 'created_at',
    order: 'desc'
  });
};

export const useBestSellingProducts = (limit = 6) => {
  return useProducts({
    status: 'published',
    limit,
    orderBy: 'view', // Assuming view count indicates best selling
    order: 'desc'
  });
};

export const useNewProducts = (limit = 6) => {
  return useProducts({
    status: 'published',
    limit,
    orderBy: 'created_at',
    order: 'desc'
  });
};

export const useProductsByCategory = (categoryIds: number[], limit = 6) => {
  return useProducts({
    status: 'published',
    categories: categoryIds,
    limit,
    orderBy: 'created_at',
    order: 'desc'
  });
};