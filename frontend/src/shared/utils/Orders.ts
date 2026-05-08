import { instance } from "./axiosInstance";

export async function findManyOrders(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/orders", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneOrder(id: number) {
    return await instance
        .get(`/orders/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function cancelOrder(id: number) {
    return await instance
        .post(`/orders/${id}/cancel`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneOrderByCode(code: string) {
    return await instance
        .get(`/orders/number/${code}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createTransaction(id: number, data: object) {
    return await instance
        .post("/orders/" + id + "/transaction", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
}

export async function createOrder(data: object) {
    return await instance
        .post("/orders", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateOrder(id: number, data: object) {
    return await instance
        .patch("/orders/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteOrder(id: number) {
    return await instance
        .delete("/orders/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteOrders(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/orders", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}