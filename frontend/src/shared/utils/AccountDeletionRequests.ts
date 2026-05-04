import { instance } from "./axiosInstance";

export async function findManyAccountDeletionRequests(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/account-deletion-requests", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOneAccountDeletionRequest(id: number) {
    return await instance
        .get(`/account-deletion-requests/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createAccountDeletionRequest(data: object) {
    return await instance
        .post("/account-deletion-requests", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateAccountDeletionRequest(id: number, data: object) {
    return await instance
        .patch("/account-deletion-requests/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteAccountDeletionRequest(id: number) {
    return await instance
        .delete("/account-deletion-requests/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteAccountDeletionRequests(ids: number[]) {    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/account-deletion-requests", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}