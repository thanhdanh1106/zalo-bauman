export interface affiliateProgramProps {
  id: number
  slug: string
  description: string
  commission_rate: string
  fixed_commission: any
  points_per_order: number
  points_conversion_rate: string
  status: string
  start_date: string
  end_date: string
  conditions: Conditions
  created_at: string
  updated_at: string
  affiliate_users_count: number
  affiliate_users: any[]
}

export interface Conditions {
  min_order_value: number
  min_monthly_sales: number
  payment_method: string
  requirements: string[]
}
