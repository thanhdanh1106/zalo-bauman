import { instance } from "./axiosInstance";

// Interfaces
interface ApiResponse<T = any> {
    data: T;
    error?: boolean;
    message?: string;
}

interface ZnsTemplate {
    id: number;
    template_id: string;
    template_name: string;
    status: string;
    price: number;
    apply_template_quota: number;
    remain_quota: number;
    daily_quota: number;
    template_tag: string;
    template_quality_score: string;
    template_quota: number;
    created_time: number;
    created_at: string;
    updated_at: string;
    listParams?: TemplateParam[];
}

interface TemplateParam {
    name: string;
    require: boolean;
    type: string;
    max_length?: number;
    accept_null?: boolean;
}

interface CreateTemplateData {
    template_id: string;
    template_name: string;
    [key: string]: any;
}

interface UpdateTemplateData {
    template_name?: string;
    [key: string]: any;
}

export async function findManyZnsTemplates(params: Record<string, any> = {}): Promise<ApiResponse<ZnsTemplate[]> | null> {
    const config = {
        params: params
    };
    const response = await instance
        .get("/zalo-oa/zns/templates", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
    return response;
}

export async function findOneZnsTemplate(id: number | string): Promise<ApiResponse<ZnsTemplate> | null> {
    const response = await instance
        .get("/zns-templates/" + id)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function syncZnsTemplates(token: string): Promise<ApiResponse | null> {

    const response = await instance
        .post("/zns-templates/sync", {})
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function createZnsTemplate(data: CreateTemplateData): Promise<ApiResponse<ZnsTemplate> | null> {
    const response = await instance
        .post("/zns-templates", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function updateZnsTemplate(id: number | string, data: UpdateTemplateData): Promise<ApiResponse<ZnsTemplate> | null> {
    const response = await instance
        .patch("/zns-templates/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function deleteZnsTemplate(id: number | string): Promise<ApiResponse | null> {

    const response = await instance
        .delete("/zns-templates/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
    return response;
}

export async function deleteZnsTemplates(data: { ids: number[] }): Promise<ApiResponse | null> {
    const config = {
        data: data
    };
    const response = await instance
        .delete("/zns-templates", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
    return response;
}

export async function findOneZnsTemplatePreview(token, id) {
    if (!token) {
        return null;
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await instance
        .get(`/zalo-oa/zns/templates/${id}`, config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function findOneTemplateDefaultData(token, id) {
    if (!token) {
        return null;
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await instance
        .get(`/zalo-oa/zns/templates/${id}/sample-data`, config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function findOneZnsTemplateRating(token, id) {
    if (!token) {
        return null;
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await instance
        .get(`/zalo-oa/zns/templates/${id}/rating`, config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function findOneZnsTemplateQuality(id) {
    const response = await instance
        .get(`/zalo-oa/zns/templates/${id}/quality`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function sendZnsTemplate(id, data) {
    const response = await instance
        .post(`/zalo-oa/zns/templates/${id}`, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}