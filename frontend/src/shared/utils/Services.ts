import { instance } from "./axiosInstance";


export async function findManyServices(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/services", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneService(id: number) {
    return await instance
        .get(`/services/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneServiceByName(name: string) {
    return await instance
        .get(`/services/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createService(data: object) {
    return await instance
        .post("/services", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateService(id: number, data: object) {
    return await instance
        .patch("/services/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteService(id: number) {
    return await instance
        .delete("/services/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteServices(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/services", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}