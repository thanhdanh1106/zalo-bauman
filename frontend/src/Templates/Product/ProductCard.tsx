import ProductCard from './ProductCard';
import ProductList from './ProductList';
import React from 'react';
import { useCart } from '@shared/hooks/useCart';
import { ProductCardProps } from './types';

const ProductCardPage: React.FC<ProductCardProps> = ({
  product,
  layout = 'horizontal',
  showAddToCart = true,
  onAddToCart,
  className = '',
}) => {
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useCart();
  const productId = parseInt(product.id.toString());

  if (layout === 'vertical') {
    return <ProductCard product={product} />;
  }

  // Horizontal layout
  return <ProductList product={product} />;
};

export default ProductCardPage;


