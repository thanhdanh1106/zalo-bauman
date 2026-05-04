import { instance } from "./axiosInstance";

export async function findManyProductCategories(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/categories", config)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error in findManyProductCategories:", err);
            return [];
        });
}

export async function findOneProductCategory(id: number) {
    return await instance
        .get(`/product-categories/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneProductCategoryByName(name: string) {
    return await instance
        .get(`/product-categories/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}


export async function createProductCategory(data: object) {
    return await instance
        .post("/product-categories", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateProductCategory(id: number, data: object) {
    return await instance
        .patch("/product-categories/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteProductCategory(id: number) {
    return await instance
        .delete("/product-categories/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteProductCategories(ids: number[]) {    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/product-categories", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}