import { instance } from "./axiosInstance";

export async function findManyTranslations(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/translations", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneTranslation(id: number) {
    return await instance
        .get(`/translations/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneTranslationByName(name: string) {
    return await instance
        .get(`/translations/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createTranslation(data: object) {
    return await instance
        .post("/translations", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateTranslation(id: number, data: object) {
    return await instance
        .patch("/translations/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteTranslation(id: number) {
    return await instance
        .delete("/translations/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteTranslations(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/translations", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}