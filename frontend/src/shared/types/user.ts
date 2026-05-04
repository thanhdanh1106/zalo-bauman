import { affiliateProgramProps } from "./affiliate_program";
import { mediaProps } from "./media";
import { membershipProps } from "./membership";

export interface userProps {
  id: number
  email?: string | null
  username?: string | null
  point: number
  status: string | null;
  created_at: string
  updated_at: string
  last_seen: string | null
  stripe_id: string
  pm_type: string
  pm_last_four: string
  viewed_listings: any
  trial_ends_at: any
  role: UserRoles;
  information: Information | null
}


export type UserRoles = 'administrator' | 'manager' | 'dealer' | 'private' | 'user' | null;

export interface Information {
  id: number
  user: number
  avatar: mediaProps | null
  first_slug: string
  last_slug: string
  description: string
  gender: string
  phone: string
  country: string
  district: string
  state: string
  city: string
  ward: string
  address: string
  website: string | null
  tiktok: string | null
  instagram: string | null
  facebook: string | null
  postal_code: string | null
  dob: string
  created_at: string
  updated_at: string
}

export interface userAffiliateInfoProps {
  is_affiliate: boolean
  affiliate_info: AffiliateInfo
  statistics: Statistics
  recent_commissions: any[]
}

export interface AffiliateInfo {
  id: number
  referral_code: string
  status: string
  joined_at: string
  approved_at: string
  program: affiliateProgramProps
}

export interface Statistics {
  referrals: Referrals
  commissions: Commissions
  orders: Orders
  points: Points
}

export interface Referrals {
  total: number
  active: number
}

export interface Commissions {
  total_earned: number
  total_paid: number
  pending: number
  currency: string
}

export interface Orders {
  total: number
  recent_month: number
}

export interface Points {
  balance: number
}
