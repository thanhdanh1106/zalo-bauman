import { instance } from "./axiosInstance";

export async function findManyUsers(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/users", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneUser(id: number) {
    return await instance
        .get(`/users/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneUserByName(name: string) {
    return await instance
        .get(`/users/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createUser(data: object) {
    return await instance
        .post("/users", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateUser(id: number, data: object) {
    return await instance
        .patch("/users/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteUser(id: number) {
    return await instance
        .delete("/users/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteUsers(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/users", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export const sendUserStatusToServer = async () => {
    return await instance
        .post("/users/status", {})
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
};


export const getUsersOnline = async () => {
    return await instance
        .get("/users/online")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export const getRecentUsers = async (params = {}) => {
    const config = {
        params: params
    };
    return await instance
        .get("/users/recent", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

