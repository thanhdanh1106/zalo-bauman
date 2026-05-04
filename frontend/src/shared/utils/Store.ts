import { instance } from "./axiosInstance";

export async function findManyStore(params = {}) {

    const config = {
        params: params
    };
    return await instance
        .get("/stores", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneStoreByName(name: string) {
 
    return await instance
        .get(`/stores/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneStore(id: number) {


    
    return await instance
        .get(`/stores/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createStore(data: object) {


    return await instance
        .post("/stores", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateStore(id: number, data: object) {


    return await instance
        .patch("/stores/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteStore(id: number) {


    return await instance
        .delete("/stores/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteStores(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/stores", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}