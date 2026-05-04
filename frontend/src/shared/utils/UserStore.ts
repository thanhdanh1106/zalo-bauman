import { instance } from "./axiosInstance";

export async function findOneUserStore() {
    return await instance
        .get("/account/store")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createUserStore(data: object) {
    return await instance
        .post("/account/store", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}