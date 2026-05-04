import { instance } from "../axiosInstance";

// Affiliate Commissions
export async function findManyAffiliateCommissions(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/affiliate-commissions", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneAffiliateCommission(id: number) {
    return await instance
        .get(`/affiliate/affiliate-commissions/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createAffiliateCommission(data: object) {
    return await instance
        .post("/affiliate/affiliate-commissions", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateAffiliateCommission(id: number, data: object) {
    return await instance
        .patch("/affiliate/affiliate-commissions/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function markCommissionAsPaid(id: number) {
    return await instance
        .post(`/affiliate/affiliate-commissions/${id}/mark-paid`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}


export async function deleteAffiliateCommission(id: number) {
    return await instance
        .delete("/affiliate/affiliate-commissions/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteAffiliateCommissions(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/affiliate/affiliate-commissions", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}