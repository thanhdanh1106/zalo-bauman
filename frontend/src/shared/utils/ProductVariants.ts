import { instance } from "./axiosInstance";

export async function findManyProductVariants(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/product-variants", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOneProductVariant(id: number) {
    return await instance
        .get(`/product-variants/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneProductVariantByName(name: string) {
    return await instance
        .get(`/product-brands/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createProductVariant(data: object) {
    return await instance
        .post("/product-variants", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateProductVariant(id: number, data: object) {
    return await instance
        .patch("/product-variants/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteProductVariant(id: number) {
    return await instance
        .delete("/product-variants/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteProductVariants(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/product-variants", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}