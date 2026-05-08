import { productProps } from "./product"

export interface orderItemProps {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: string
  product?: productProps
  selected_option?: string
}

export interface orderProps {
  id: number
  order_number: string
  user_id: number
  customer_slug: string
  customer_email: string
  customer_phone: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: string
  tax_amount: string
  shipping_fee: string
  total_amount: string
  shipping_address: any
  billing_address: any
  notes: string
  order_date: string
  shipped_date: any
  delivered_date: any
  created_at: string
  updated_at: string
  total_items: number
  order_items: orderItemProps[]
}
