import { instance } from "./axiosInstance";

export async function getUserAnalytics( params = {}) {
    const config = {
        params: params,
    };
    return await instance
        .get("/account", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function getUserFreeBoost() {
    return await instance
        .get("/account/free-boost")
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function getUserPaidBoost() {
    return await instance
        .get("/account/paid-boost")
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function getPaymentMontlyAnalytics(params = {}) {
    const config = {
        params: params,
    };

    return await instance
        .get("/account/payment", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function getPaymentMethodAnalytics(params = {}) {
    const config = {
        params: params,
    };

    return await instance
        .get("/account/payment-method", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOnePost(id: number) {
    return await instance
        .get(`/posts/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOnePostByName(name: string) {
    return await instance
        .get(`/posts/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createPost(data: object) {
    return await instance
        .post("/posts", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updatePost(id: number, data: object) {
    return await instance
        .patch("/posts/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deletePost(id: number) {
    return await instance
        .delete("/posts/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deletePosts(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/posts", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}