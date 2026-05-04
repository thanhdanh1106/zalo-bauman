import { instance } from "./axiosInstance";

export async function findOneUserAgency() {
    return await instance
        .get("/account/agency")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createUserAgency(data: object) {
    return await instance
        .post("/account/agency", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}