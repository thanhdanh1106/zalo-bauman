import { instance } from "./axiosInstance";

export async function findManyPostCategories(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/post-categories", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOnePostCategory(id: number) {
    return await instance
        .get(`/post-categories/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createPostCategory(data: object) {
    return await instance
        .post("/post-categories", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updatePostCategory(id: number, data: object) {
    return await instance
        .patch("/post-categories/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deletePostCategory(id: number) {
    return await instance
        .delete("/post-categories/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deletePostCategories(ids: number[]) {    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/post-categories", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}