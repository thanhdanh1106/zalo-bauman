import { instance } from "./axiosInstance";

export async function findManySubscriptions(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/subscriptions", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneSubscription(id: number) {
    return await instance
        .get(`/subscriptions/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneSubscriptionByName(name: string) {
    return await instance
        .get(`/subscriptions/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createSubscription(data: object) {
    return await instance
        .post("/subscriptions", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateSubscription(id: number, data: object) {
    return await instance
        .patch("/subscriptions/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function extendSubscription(id: number) {
    return await instance
        .post("/subscriptions/" + id + '/extends', {})
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function cancelSubscription(id: number) {
    return await instance
         .post("/subscriptions/" + id + '/cancel', {})
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteSubscription(id: number) {
    return await instance
        .delete("/subscriptions/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteSubscriptions(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/subscriptions", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}