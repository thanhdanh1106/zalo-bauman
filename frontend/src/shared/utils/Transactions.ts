import { instance } from "./axiosInstance";

export async function findManyTransactions(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/transactions", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneTransaction(id: number) {
    return await instance
        .get(`/transactions/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createTransaction(data: object) {
    return await instance
        .post("/transactions", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateTransaction(id: number, data: object) {
    return await instance
        .patch("/transactions/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteTransaction(id: number) {
    return await instance
        .delete("/transactions/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteTransactions(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/transactions", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}