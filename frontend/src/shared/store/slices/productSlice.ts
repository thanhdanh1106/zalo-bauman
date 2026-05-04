import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  alcoholContent: number;
  volume: number; // ml
  origin: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags?: string[];
  createdAt: string;
}

export interface ProductFilter {
  category: string[];
  brand: string[];
  priceRange: {
    min: number;
    max: number;
  };
  alcoholRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  currentProduct: Product | null;
  filter: ProductFilter;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialFilter: ProductFilter = {
  category: [],
  brand: [],
  priceRange: { min: 0, max: 1000000 },
  alcoholRange: { min: 0, max: 50 },
  inStock: false,
  sortBy: 'name',
  sortOrder: 'asc',
};

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  currentProduct: null,
  filter: initialFilter,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
};

const applyFilters = (products: Product[], filter: ProductFilter): Product[] => {
  let filtered = [...products];

  // Filter by category
  if (filter.category.length > 0) {
    filtered = filtered.filter(product => filter.category.includes(product.category));
  }

  // Filter by brand
  if (filter.brand.length > 0) {
    filtered = filtered.filter(product => filter.brand.includes(product.brand));
  }

  // Filter by price range
  filtered = filtered.filter(
    product => product.price >= filter.priceRange.min && product.price <= filter.priceRange.max
  );

  // Filter by alcohol content
  filtered = filtered.filter(
    product => product.alcoholContent >= filter.alcoholRange.min && product.alcoholContent <= filter.alcoholRange.max
  );

  // Filter by stock
  if (filter.inStock) {
    filtered = filtered.filter(product => product.inStock && product.stockQuantity > 0);
  }

  // Sort products
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (filter.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'newest':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }
    return filter.sortOrder === 'desc' ? -comparison : comparison;
  });

  return filtered;
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
      state.filteredProducts = applyFilters(action.payload, state.filter);
    },
    setCurrentProduct(state, action: PayloadAction<Product | null>) {
      state.currentProduct = action.payload;
    },
    updateFilter(state, action: PayloadAction<Partial<ProductFilter>>) {
      state.filter = { ...state.filter, ...action.payload };
      state.filteredProducts = applyFilters(state.products, state.filter);
      state.pagination.currentPage = 1; // Reset to first page when filter changes
    },
    resetFilter(state) {
      state.filter = initialFilter;
      state.filteredProducts = applyFilters(state.products, initialFilter);
      state.pagination.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage(state, action: PayloadAction<number>) {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  updateFilter,
  resetFilter,
  setCurrentPage,
  setItemsPerPage,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;