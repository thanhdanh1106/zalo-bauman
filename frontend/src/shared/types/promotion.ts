import { mediaProps } from "./media"

/* Promotions */
export interface promotionProps {
  id: number
  thumbnail: mediaProps | null
  title: string
  slug: string
  description: string
  promotion_code: string
  discount: number
  start_date: string
  end_date: string
  is_featured: boolean
  is_visible: boolean
  body: any
  user_id: number
  status: string
  views: number
  created_at: string
  updated_at: string
}
