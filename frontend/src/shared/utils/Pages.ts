import { instance } from "./axiosInstance";

export async function findManyPages(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/pages", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOnePage(id: number) {
    return await instance
        .get(`/pages/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOnePageByName(name: string) {
    return await instance
        .get(`/pages/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createPage(data: object) {
    return await instance
        .post("/pages", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updatePage(id: number, data: object) {
    return await instance
        .patch("/pages/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deletePage(id: number) {
    return await instance
        .delete("/pages/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deletePages(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/pages", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}