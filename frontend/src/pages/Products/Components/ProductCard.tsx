import { productProps } from "@shared/types/product";
import React from "react";
import ProductCardGrid from "./ProductCardGrid";
import ProductCardList from "./ProductCardList";

interface ProductCardProps {
  product: productProps;
  viewMode?: "grid" | "list";
  onAddToCart?: (product: productProps) => void;
  onToggleWishlist?: (productId: number) => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  if (viewMode === "list") {
    return (
      <ProductCardList
        product={product}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={isWishlisted}
      />
    );
  }

  return (
    <ProductCardGrid
      product={product}
      onAddToCart={onAddToCart}
      onToggleWishlist={onToggleWishlist}
      isWishlisted={isWishlisted}
    />
  );
};

export default ProductCard;


