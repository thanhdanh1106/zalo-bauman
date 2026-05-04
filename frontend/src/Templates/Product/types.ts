import { productProps } from "@shared/types/product";

export interface ProductListProps {
  title?: string;
  subtitle?: string;
  products: productProps[];
  columns?: 1 | 2 | 3 | 4;
  showViewAll?: boolean;
  viewAllText?: string;
  onViewAll?: () => void;
  className?: string;
  isLoading?: boolean;
}

export interface ProductCardProps {
  product: productProps;
  layout?: 'horizontal' | 'vertical';
  showAddToCart?: boolean;
  onAddToCart?: (product: productProps) => void;
  className?: string;
}