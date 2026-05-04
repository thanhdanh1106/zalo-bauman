import { instance } from "./axiosInstance";

export async function findManyVendors(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/vendors", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneVendor(id: number) {
    return await instance
        .get(`/vendors/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneVendorByName(name: string) {
    return await instance
        .get(`/vendors/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createVendor(data: object) {
    return await instance
        .post("/vendors", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateVendor(id: number, data: object) {
    return await instance
        .patch("/vendors/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteVendor(id: number) {
    return await instance
        .delete("/vendors/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteVendors(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/vendors", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}