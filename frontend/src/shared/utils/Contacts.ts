import { instance } from "./axiosInstance";

export async function findManyContacts(params = {}) {
 
    const config = {
        params: params
    };
    return await instance
        .get("/contacts", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneContact(id: number) {
 

    return await instance
        .get(`/contacts/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createContact(data: object) {


    return await instance
        .post("/contacts", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateContact(id: number, data: object) {


    return await instance
        .patch("/contacts/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteContact(id: number) {


    return await instance
        .delete("/contacts/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteContacts(ids: number[]) {

    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/contacts", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}