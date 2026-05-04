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
  thumbnail: mediaProps
  gallery: mediaProps[]
  user: userProps
  categories: postCategoryProps[]
  brand: postCategoryProps | null
}
