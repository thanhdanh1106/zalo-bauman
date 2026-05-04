import { instance } from "../axiosInstance";

// Affiliate Users
export async function findManyAffiliateUsers(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/affiliate-users", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneAffiliateUser(id: number) {
    return await instance
        .get(`/affiliate/affiliate-users/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createAffiliateUser(data: object) {
    return await instance
        .post("/affiliate/affiliate-users", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateAffiliateUser(id: number, data: object) {
    return await instance
        .patch("/affiliate/affiliate-users/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteAffiliateUser(id: number) {
    return await instance
        .delete("/affiliate/affiliate-users/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}