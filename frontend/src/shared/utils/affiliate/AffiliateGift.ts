import { instance } from "../axiosInstance";

export async function findManyAffiliateGifts(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate-gifts", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneAffiliateGift(id: number) {
    return await instance
        .get(`/affiliate-gifts/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneAffiliateGiftByName(name: string) {
    return await instance
        .get(`/affiliate-gifts/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createAffiliateGift(data: object) {
    return await instance
        .post("/affiliate-gifts", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateAffiliateGift(id: number, data: object) {
    return await instance
        .patch("/affiliate-gifts/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteAffiliateGift(id: number) {
    return await instance
        .delete("/affiliate-gifts/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteAffiliateGifts(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/affiliate-gifts", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}