import { instance } from "./axiosInstance";

export async function findManyProductAttributes(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/product-attributes", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOneProductAttribute(id: number) {
    return await instance
        .get(`/product-attributes/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneProductAttributeByName(name: string) {
    return await instance
        .get(`/product-attributes/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createProductAttribute(data: object) {
    return await instance
        .post("/product-attributes", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateProductAttribute(id: number, data: object) {
    return await instance
        .patch("/product-attributes/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteProductAttribute(id: number) {
    return await instance
        .delete("/product-attributes/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteProductAttributes(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/product-attributes", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}