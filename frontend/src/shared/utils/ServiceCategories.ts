import { instance } from "./axiosInstance";

export async function findManyServiceCategories(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/service-categories", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOneServiceCategory(id: number) {
    return await instance
        .get(`/service-categories/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createServiceCategory(data: object) {
    return await instance
        .post("/service-categories", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateServiceCategory(id: number, data: object) {
    return await instance
        .patch("/service-categories/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteServiceCategory(id: number) {
    return await instance
        .delete("/service-categories/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteServiceCategories(ids: number[]) {    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/service-categories", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}