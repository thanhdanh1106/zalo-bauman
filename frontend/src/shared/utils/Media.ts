import { instance } from "./axiosInstance";

export async function findManyMedia(params = {}) {
    const config = {
        params: params,
    };
    const response = await instance
        .get("/media", config)
        .then((res) => res.data)
        .catch((error) => {
            console.log("error", error);
            return [];
        });

    return response;
}

export async function findOneMedia(id: number) {    const response = await instance
        .get(`/media/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
    return response;
}

export async function uploadMedia(data: FormData, onProgress?: (progressEvent: any) => void) {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
    };
    
    return await instance
        .post("/media/upload", data, config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response?.data
            };
        });
}

export async function updateMedia(id: number, data: object) {
    return await instance
        .post(`/media/${id}`, data)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteMedia(id: number) {
    return await instance.delete(`/media/${id}`)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}


export async function deleteMultipleMedia(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance.delete("/media/", config)
    .then((res) => {
        return res?.data;
    }).catch(function () {
        return null;
    });
}


