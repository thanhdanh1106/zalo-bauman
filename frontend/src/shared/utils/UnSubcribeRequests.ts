import { instance } from "./axiosInstance";

export async function findManyUnSubcribeRequests(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/unsubscribe-requests", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOneUnSubcribeRequest(id: number) {
    return await instance
        .get(`/unsubscribe-requests/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createUnSubcribeRequest(data: object) {
    return await instance
        .post("/unsubscribe-requests", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateUnSubcribeRequest(id: number, data: object) {
    return await instance
        .patch("/unsubscribe-requests/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteUnSubcribeRequest(stripe_id: string) {
    return await instance
        .delete("/unsubscribe-requests/" + stripe_id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteUnSubcribeRequests(ids: number[]) {    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/unsubscribe-requests", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}