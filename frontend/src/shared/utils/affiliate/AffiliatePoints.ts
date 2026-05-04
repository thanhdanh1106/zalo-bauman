import { instance } from "../axiosInstance";

// Affiliate Points
export async function findManyAffiliatePoints(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/affiliate-points", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneAffiliatePoint(id: number) {
    return await instance
        .get(`/affiliate/affiliate-points/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createAffiliatePoint(data: object) {
    return await instance
        .post("/affiliate/affiliate-points", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateAffiliatePoint(id: number, data: object) {
    return await instance
        .patch("/affiliate/affiliate-points/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteAffiliatePoint(id: number) {
    return await instance
        .delete("/affiliate/affiliate-points/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteAffiliatePoints(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/affiliate/affiliate-points", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}