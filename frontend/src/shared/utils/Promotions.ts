import { instance } from "./axiosInstance";

export async function findManyPromotions(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/promotions", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOnePromotion(id: number) {
    return await instance
        .get(`/promotions/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOnePromotionByName(name: string) {
    return await instance
        .get(`/promotions/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function applyPromotionCode(name: string) {
    return await instance
        .post(`/promotions/apply/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createPromotion(data: object) {
    return await instance
        .post("/promotions", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updatePromotion(id: number, data: object) {
    return await instance
        .patch("/promotions/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deletePromotion(id: number) {
    return await instance
        .delete("/promotions/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function findMyVouchers() {
    return await instance
        .get("/vouchers")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: [],
                message: err.response?.data?.message || ""
            };
        });
}

export async function deletePromotions(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/promotions", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}