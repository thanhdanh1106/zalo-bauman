import { instance } from "./axiosInstance";

export async function findManyContactForms(params = {}) {
    const config = {
        params: params,
 
    };
    return await instance
        .get("/contact-form", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneContactForm(id: number) {
    return await instance
        .get(`/contact-form/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createContactForm(data: object) {
    return await instance
        .post("/contact-form", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateContactForm(id: number, data: object) {
    return await instance
        .patch("/contact-form/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteContactForm(id: number) {
    return await instance
        .delete("/contact-form/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteContactForms(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/contact-form", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}