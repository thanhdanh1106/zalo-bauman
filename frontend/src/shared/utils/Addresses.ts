import { instance } from "./axiosInstance";

export async function getAddresses(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/addresses", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function createAddress(data: object) {
    return await instance
        .post("/addresses", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateAddress(id: number, data: object) {
    return await instance
        .patch("/addresses/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteAddress(id: number) {
    return await instance
        .delete("/addresses/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}
