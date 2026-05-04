import { instance } from "./axiosInstance";

export async function findManyApplicants(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/applicants", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneApplicant(id: number) {
    return await instance
        .get(`/applicants/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneApplicantByName(name: string) {
    return await instance
        .get(`/applicants/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createApplicant(data: object) {
    return await instance
        .post("/applicants", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateApplicant(id: number, data: object) {
    return await instance
        .patch("/applicants/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteApplicant(id: number) {
    return await instance
        .delete("/applicants/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteApplicants(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/applicants", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}