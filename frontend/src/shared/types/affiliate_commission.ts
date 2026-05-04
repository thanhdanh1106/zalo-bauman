import { orderProps } from "./order";
import { userProps } from "./user";

export interface AffiliateCommissionProps {
    id: number;
    affiliate_user: userProps;
    order: orderProps;
    commission_amount: number;
    commission_rate: number;
    order_amount: number;
    status: 'pending' | 'approved' | 'paid' | 'cancelled';
    payment_method?: string;
    earned_at: string;
    paid_at?: string;
    expires_at?: string;
    payment_reference?: string;
    created_at: string;
}