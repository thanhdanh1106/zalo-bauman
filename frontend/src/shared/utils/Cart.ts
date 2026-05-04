import { instance } from "./axiosInstance";

export const getCart = async () => {
    return await instance
        .get("/cart")
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const addToCart = async (productId: number, quantity: number = 1) => {
    return await instance
        .post("/cart", { product_id: productId, quantity })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const updateCart = async (productId: number, quantity: number) => {
    return await instance
        .patch("/cart", { product_id: productId, quantity })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const removeFromCart = async (productId: number) => {
    return await instance
        .delete("/cart", { data: { product_id: productId } })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const syncCart = async (items: { id: number; quantity: number }[]) => {
    return await instance
        .post("/cart/sync", { items })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};
