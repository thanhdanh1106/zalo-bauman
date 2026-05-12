import { mediaProps } from "./media"
import { postCategoryProps } from "./post"
import { userProps } from "./user"

export interface productProps {
  id: number
  slug: string
  title: string
  description: string
  price: number
  stock: number
  sku: string
  thumbnail_id: number
  user_id: number
  views: number
  status: string
  brand_id: number
  is_featured: boolean
  created_at: string
  rating?: number
  soldCount?: number;
  affiliate_commission_rate?: number;
  affiliate_reward_points?: number;
  comments?: Array<{
    id: number;
    title?: string;
    content: string;
    rating: number;
    created_at: string;
    customer?: {
      name: string;
      avatar?: string;
    };
  }>;
  thumbnail: mediaProps
  gallery: mediaProps[]
  user: userProps
  categories: postCategoryProps[]
  brand: postCategoryProps | null
  // New gram fields
  is_sold_by_gram: boolean
  sales_unit: string | null
  min_gram: number | null
  gram_step: number | null
  gram_options: Array<{ unit: string }> | null
  // Physical dimensions
  weight: number | null
  dimensions: string | null
  volume: number | null
  variants?: productVariantProps[]
}

export interface productVariantProps {
  id: number
  sku: string
  price: number
  old_price?: number
  sale_price?: number
  effective_price: number
  qty: number
  display_label: string
  image?: string
  weight_value?: number
  weight_unit?: string
}
