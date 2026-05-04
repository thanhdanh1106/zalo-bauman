import { instance } from "./axiosInstance";

export async function findOneUserCompany() {
    return await instance
        .get("/account/company")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createUserCompany(data: object) {
    return await instance
        .post("/account/company", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
