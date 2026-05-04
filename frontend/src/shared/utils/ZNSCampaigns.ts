import { instance } from "./axiosInstance";

// Interfaces
interface ApiResponse<T = any> {
    data: T;
    error?: boolean;
    message?: string;
}

interface ZnsCampaign {
    id: number;
    name: string;
    description?: string;
    template_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

interface CampaignTemplate {
    id: string;
    name: string;
    listParams: any[];
    [key: string]: any;
}

interface CreateCampaignData {
    name: string;
    description?: string;
    template_id: string;
    [key: string]: any;
}

interface UpdateCampaignData {
    name?: string;
    description?: string;
    template_id?: string;
    [key: string]: any;
}

export async function findManyZnsCampaigns(params: Record<string, any> = {}): Promise<ApiResponse<ZnsCampaign[]> | null> {
    const config = {
        params: params
    };
    const response = await instance
        .get("/zns-campaigns", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
    return response;
}

export async function findOneZnsCampaign(id: number | string): Promise<ApiResponse<ZnsCampaign> | null> {

    const response = await instance
        .get(`/zns-campaigns/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function findOneTemplateCampaign(id: number | string): Promise<ApiResponse<CampaignTemplate> | null> {

    const response = await instance
        .get(`/zns-campaigns/${id}/template`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function sendZnsCampaign(id: number | string, data: Record<string, any>): Promise<ApiResponse | null> {

    const response = await instance
        .post(`/zns-campaigns/${id}`, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function duplicateZnsCampaign(id: number | string, data: Record<string, any>): Promise<ApiResponse<ZnsCampaign> | null> {
    const response = await instance
        .post("/zns-campaigns/" + id + "/duplicate", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function createZnsCampaign(data: CreateCampaignData): Promise<ApiResponse<ZnsCampaign> | null> {
    const response = await instance
        .post("/zns-campaigns", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function UpdateZnsCampaign(id: number | string, data: UpdateCampaignData): Promise<ApiResponse<ZnsCampaign> | null> {
    const response = await instance
        .patch("/zns-campaigns/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function deleteZnsCampaign(id: number | string): Promise<ApiResponse | null> {

    const response = await instance
        .delete("/zns-campaigns/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
    return response;
}

export async function deleteZnsCampaigns(data: { ids: number[] }): Promise<ApiResponse | null> {
    const config = {
        data: data
    };
    const response = await instance
        .delete("/zns-campaigns", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
    return response;
}