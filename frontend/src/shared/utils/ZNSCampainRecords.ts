import { instance } from "./axiosInstance";

// Interfaces
interface ApiResponse<T = any> {
    data: T;
    error?: boolean;
    message?: string;
}

interface ZnsRecord {
    id: number;
    campaign_id: number;
    phone: string;
    status: string;
    sent_at?: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

interface CreateRecordData {
    phone: string;
    [key: string]: any;
}

interface UpdateRecordData {
    phone?: string;
    [key: string]: any;
}

interface ImportRecordsData {
    records: CreateRecordData[];
    [key: string]: any;
}

interface SendRecordData {
    record_ids?: number[];
    [key: string]: any;
}

export async function findManyZnsRecords(campaign_id: number | string, params: Record<string, any> = {}): Promise<ApiResponse<ZnsRecord[]> | null> {
    const config = {
        params: params
    };
    const response = await instance
        .get(`/zns-campaigns/${campaign_id}/records`, config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
    return response;
}

export async function findOneZnsRecord(campaign_id: number | string, id: number | string): Promise<ApiResponse<ZnsRecord> | null> {
    const response = await instance
        .get(`/zns-campaigns/${campaign_id}/records/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function sendZnsRecord(id: number | string, data: SendRecordData): Promise<ApiResponse | null> {
    const response = await instance
        .post(`/zns-campaigns/${id}/sent`, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function createMultipeZnsRecord(campaign_id: number | string, data: ImportRecordsData): Promise<ApiResponse<ZnsRecord[]> | null> {
    const response = await instance
        .post(`/zns-campaigns/${campaign_id}/records/import`, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function createZnsRecord(campaign_id: number | string, data: CreateRecordData): Promise<ApiResponse<ZnsRecord> | null> {
    const response = await instance
        .post(`/zns-campaigns/${campaign_id}/records`, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function UpdateZnsRecord(campaign_id: number | string, id: number | string, data: UpdateRecordData): Promise<ApiResponse<ZnsRecord> | null> {
    const response = await instance
        .patch(`/zns-campaigns/${campaign_id}/records/` + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
    return response;
}

export async function deleteZnsRecord(campaign_id: number | string, id: number | string): Promise<ApiResponse | null> {

    const response = await instance
        .delete(`/zns-campaigns/${campaign_id}/records/` + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
    return response;
}

export async function deleteZnsRecords(campaign_id: number | string, data: { ids: number[] }): Promise<ApiResponse | null> {
    const config = {
        data: data
    };
    const response = await instance
        .delete(`/zns-campaigns/${campaign_id}/records`)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
    return response;
}