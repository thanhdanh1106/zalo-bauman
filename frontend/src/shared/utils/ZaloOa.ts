import { instance } from "./axiosInstance";

// Interfaces
interface ApiResponse<T = any> {
    data: T;
    error?: boolean;
    message?: string;
}

interface OAInfo {
    oa_id: string;
    name: string;
    description: string;
    avatar: string;
    cover: string;
    is_verified: boolean;
    [key: string]: any;
}

interface QuotaInfo {
    dailyQuota: number;
    remainingQuota: number;
    [key: string]: any;
}

interface ZNSPermission {
    permission: string;
    status: string;
    [key: string]: any;
}

export async function getAuthZalo(params: Record<string, any> = {}): Promise<ApiResponse | null> {
    const config = {
        params: params
    };
    const response = await instance
        .get("/zalo-oa/oauth", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
    return response;
}

export async function getOAInfo(params: Record<string, any> = {}): Promise<ApiResponse<OAInfo> | null> {
    const response = await instance
        .get("/zalo-oa/info")
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
    return response;
}

export async function getOaQuotaInfo(params: Record<string, any> = {}): Promise<ApiResponse<QuotaInfo> | null> {
    const response = await instance
        .get("/zalo-oa/quota")
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
    return response;
}

export async function findManyZNSPermission(params: Record<string, any> = {}): Promise<ApiResponse<ZNSPermission[]> | null> {

    const response = await instance
        .get("/zalo-oa/permission")
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
    return response;
}