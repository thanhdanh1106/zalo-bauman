import { instance } from "./axiosInstance";

export async function findManyProducts(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/products", config)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error in findManyProducts:", err);
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function findOneProduct(id: number) {
    return await instance
        .get(`/products/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneProductByName(name: string) {
    return await instance
        .get(`/products/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createProduct(data: object) {
    return await instance
        .post("/products", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateProduct(id: number, data: object) {
    return await instance
        .patch("/products/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function deleteProduct(id: number) {
    return await instance
        .delete("/products/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteProducts(ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/products", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function createProductReview(productId: number, data: { title?: string; content: string; rating: number }) {
    return await instance
        .post(`/products/${productId}/comments`, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                message: err.response?.data?.message || "Không thể gửi đánh giá"
            };
        });
}