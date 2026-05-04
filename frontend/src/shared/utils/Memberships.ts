import { instance } from "./axiosInstance";

export async function findManyMemberships(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/memberships", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneMembership(id: number) {
    return await instance
        .get(`/memberships/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOnePreviewChangeMembership(id: number) {
    return await instance
        .get(`/memberships/${id}/preview-change-subscription`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneMembershipByName(name: string) {
    return await instance
        .get(`/memberships/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createMembership(data: object) {
    return await instance
        .post("/memberships", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateMembership(id: number, data: object) {
    return await instance
        .patch("/memberships/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteMembership(id: number) {
    return await instance
        .delete("/memberships/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteMemberships(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/memberships", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}