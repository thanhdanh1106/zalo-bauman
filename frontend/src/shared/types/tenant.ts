export interface TenantProps {
    id: number
    user_id?: number
    name: string
    status?: string;
    storage_limit?: number;
    storage_used?: number;
    package_expired_at?: string;
    created_at?: string;
    updated_at?: string;
}