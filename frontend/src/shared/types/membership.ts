/* Memberships */
export interface CreatemembershipProps {
    title: string | null,
    description: string | null,
    body: string | null,
    billing_cyle: string | null,
    features: object[] | null,
}

export interface membershipProps {
  id: number;
  title: string;
  is_featured: boolean;
  is_dealer_package: boolean;
  is_member_package: number;
  description: string;
  features: Feature[];
  button_label: string;
  is_free_membership: any;
  max_posts: number;
  extend_boost_price: number;
  free_boosts_per_month: number;
  post_expired_in: number;
  boost_discount_percentage: number;
  has_highlight_frame: boolean;
  can_choose_title_color: any;
  has_vip_seller_label: boolean;
  priority_listing: boolean;
  has_shop_logo_upload: number;
  has_trusted_dealer_label: boolean;
  has_premium_dealer_label: any;
  dealer_label_color: number;
  has_profile: boolean;
  has_category_banner: number;
  has_trusted_dealer_badge: boolean;
  price: number;
  price_save: number;
  stripe_product_id: string;
  stripe_price_id: string;
  stripe_price_id_dev: string;
  stripe_price_id_prod: string;
  billing_cycle: string;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  title: string;
}


export interface ChangeSubscriptionProps {
  error: boolean
  amount_to_pay: number
  currency: string
  line_items: LineItem[]
}

export interface LineItem {
  description: string
  amount: number
  period: Period
}

export interface Period {
  start: number
  end: number
}
