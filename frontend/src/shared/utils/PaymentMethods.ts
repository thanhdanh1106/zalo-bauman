import { instance } from "./axiosInstance";

export async function findManyPaymentMethods(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/payment-methods", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOnePaymentMethod(id: number) {
    return await instance
        .get(`/payment-methods/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOnePaymentMethodByName(name: string) {
    return await instance
        .get(`/payment-methods/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createPaymentMethod(data: object) {
    return await instance
        .post("/payment-methods", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updatePaymentMethod(id: number, data: object) {
    return await instance
        .patch("/payment-methods/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deletePaymentMethod(id: number) {
    return await instance
        .delete("/payment-methods/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deletePaymentMethods(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/payment-methods", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}