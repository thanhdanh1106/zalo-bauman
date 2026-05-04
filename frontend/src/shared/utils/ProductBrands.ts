import { instance } from "./axiosInstance";

export async function findManyProductBrands(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/product-brands", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOneProductBrand(id: number) {
    return await instance
        .get(`/product-brands/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneProductBrandByName(name: string) {
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

export async function createProductBrand(data: object) {
    return await instance
        .post("/product-brands", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateProductBrand(id: number, data: object) {
    return await instance
        .patch("/product-brands/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteProductBrand(id: number) {
    return await instance
        .delete("/product-brands/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteProductBrands(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/product-brands", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}