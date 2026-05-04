import { instance } from "./axiosInstance";

export async function findManyTenants(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/tenants", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneTenant(id: number) {
    return await instance
        .get(`/tenants/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneTenantByName(name: string) {
    return await instance
        .get(`/tenants/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createTenant(data: object) {
    return await instance
        .post("/tenants", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateTenant(id: number, data: object) {
    return await instance
        .patch("/tenants/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteTenant(id: number) {
    return await instance
        .delete("/tenants/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteTenants(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/tenants", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}