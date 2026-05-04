import { instance } from "../axiosInstance";

// Affiliate Programs
export async function findManyAffiliatePrograms(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/programs", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneAffiliateProgram(id: number) {
    return await instance
        .get(`/affiliate/programs/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createAffiliateProgram(data: object) {
    return await instance
        .post("/affiliate/programs", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateAffiliateProgram(id: number, data: object) {
    return await instance
        .patch("/affiliate/programs/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteAffiliateProgram(id: number) {
    return await instance
        .delete("/affiliate/programs/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteAffiliatePrograms(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/affiliate/programs", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}