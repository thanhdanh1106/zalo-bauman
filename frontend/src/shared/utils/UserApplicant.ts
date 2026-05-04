import { instance } from "./axiosInstance";

export async function findOneUserApplicant() {
    return await instance
        .get("/account/applicant/")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createUserApplicant(data: object) {
    return await instance
        .post("/account/applicant", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
